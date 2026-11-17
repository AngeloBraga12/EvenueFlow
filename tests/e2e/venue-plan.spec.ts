import { expect, test, type Page } from "@playwright/test";

const user = {
  id: "11111111-1111-4111-8111-111111111111",
  aud: "authenticated",
  role: "authenticated",
  email: "editor@example.test",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {},
  created_at: "2026-01-01T00:00:00.000Z"
};
const venue = {
  id: "22222222-2222-4222-8222-222222222222",
  project_id: "33333333-3333-4333-8333-333333333333",
  organization_id: "44444444-4444-4444-8444-444444444444",
  created_by: user.id,
  name: "Salão de teste",
  width_mm: 10000,
  height_mm: 8000,
  origin_x_mm: 0,
  origin_y_mm: 0,
  shape: "rectangle",
  boundary: {},
  ceiling_height_mm: 4000,
  metadata: {},
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  deleted_at: null
};
const obstacle = {
  id: "55555555-5555-4555-8555-555555555555",
  venue_id: venue.id,
  name: "Pilar central",
  geometry: { schema_version: 1, kind: "rectangle", x_mm: 2000, y_mm: 2000, width_mm: 1000, height_mm: 1000, rotation_deg: 0 },
  blocks_circulation: true,
  metadata: {},
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  deleted_at: null
};

async function mockBackend(page: Page) {
  const versions: Array<Record<string, unknown>> = [];
  const updates: Array<{ table: string; body: Record<string, unknown> }> = [];
  let projectVersion=1;
  const obstacles=[obstacle,{...obstacle,id:"66666666-6666-4666-8666-666666666666",name:"Pilar 2",geometry:{...obstacle.geometry,x_mm:5000}},{...obstacle,id:"77777777-7777-4777-8777-777777777777",name:"Pilar 3",geometry:{...obstacle.geometry,x_mm:7500}}];
  await page.addInitScript(({ userData }) => {
    localStorage.setItem("sb-pfzigswxultqyjahunqo-auth-token", JSON.stringify({
      access_token: "test-access-token",
      token_type: "bearer",
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: "test-refresh-token",
      user: userData
    }));
  }, { userData: user });
  await page.route("**/auth/v1/user", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(user) }));
  await page.route("**/rest/v1/**", async route => {
    const request = route.request();
    const url = new URL(request.url());
    const table = url.pathname.split("/").pop() ?? "";
    const method = request.method();
    const body = request.postDataJSON?.() as Record<string, unknown> | undefined;
    if (method === "GET") {
      if (table === "venues") return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(venue)});
      if (table === "projects") return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({current_version:projectVersion})});
      if (table === "venue_obstacles") return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(obstacles)});
      if (table === "project_versions") {
        let data=url.searchParams.get("select")==="version"?versions.map(row=>({version:row.version})): [...versions];
        if(url.searchParams.get("order")==="version.desc")data=[...data].sort((a,b)=>Number(b.version)-Number(a.version));
        const limit=Number(url.searchParams.get("limit")??0);if(limit>0)data=data.slice(0,limit);
        return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(data)});
      }
      return route.fulfill({status:200,contentType:"application/json",body:"[]"});
    }
    if (method === "POST" && table === "project_versions") {
      const rows=Array.isArray(body)?body:[body];
      for(const row of rows) if(row) versions.push(row);
      return route.fulfill({status:201,contentType:"application/json",body:JSON.stringify(rows)});
    }
    if (method === "PATCH") {
      updates.push({table,body:body??{}});
      if(table==="projects"&&typeof body?.current_version==="number"){projectVersion=body.current_version;return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({id:venue.project_id})});}
      return route.fulfill({status:204,body:""});
    }
    return route.fulfill({status:200,contentType:"application/json",body:"[]"});
  });
  return updates;
}

async function openEditor(page: Page) {
  const updates=await mockBackend(page);
  await page.goto("/app/saloes/22222222-2222-4222-8222-222222222222/planta");
  await expect(page.getByText("PLANTA BAIXA")).toBeVisible();
  await expect(page.locator("rect.svg-obstacle").first()).toBeVisible();
  return updates;
}

test("redimensiona um obstáculo diretamente pela alça e persiste a geometria", async ({page}) => {
  const updates=await openEditor(page);
  await page.locator("rect.svg-obstacle").first().click();
  const handle=page.locator('circle[data-kind="obstacle"][data-handle="e"]');
  await expect(handle).toBeVisible();
  const box=await handle.boundingBox();
  if(!box)throw new Error("Alça de redimensionamento não possui área visível.");
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  await page.mouse.down();
  await page.mouse.move(box.x+box.width/2+36,box.y+box.height/2,{steps:5});
  await page.mouse.up();
  await expect.poll(()=>updates.some(item=>item.table==="venue_obstacles"&&"geometry" in item.body)).toBeTruthy();
  const update=updates.find(item=>item.table==="venue_obstacles"&&"geometry" in item.body);
  expect((update?.body.geometry as {width_mm:number}).width_mm).toBeGreaterThan(1000);
});

test("mostra alinhamento e distribuição ao selecionar vários objetos", async ({page}) => {
  await openEditor(page);
  await expect(page.getByRole("button",{name:"Desfazer"})).toBeDisabled();
  await expect(page.getByRole("button",{name:"Refazer"})).toBeDisabled();
  const objects=page.locator("rect.svg-obstacle");
  await objects.nth(0).click();
  await objects.nth(1).click({modifiers:["Control"]});
  await objects.nth(2).click({modifiers:["Control"]});
  await expect(page.getByRole("button",{name:"Distribuir horizontalmente"})).toBeVisible();
});

test("desfaz e refaz uma edição usando versões persistidas", async ({page}) => {
  await openEditor(page);
  await page.locator("rect.svg-obstacle").first().click();
  const handle=page.locator('circle[data-kind="obstacle"][data-handle="e"]').first();
  const box=await handle.boundingBox();
  if(!box)throw new Error("Alça de redimensionamento indisponível.");
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  await page.mouse.down();await page.mouse.move(box.x+box.width/2+24,box.y+box.height/2,{steps:4});await page.mouse.up();
  await expect(page.getByRole("button",{name:"Desfazer"})).toBeEnabled();
  await page.getByRole("button",{name:"Desfazer"}).click();
  await expect(page.getByRole("button",{name:"Refazer"})).toBeEnabled();
  await page.getByRole("button",{name:"Refazer"}).click();
  await expect(page.getByRole("button",{name:"Desfazer"})).toBeEnabled();
});

test("rotaciona um elemento diretamente pela alça circular", async ({page}) => {
  const updates=await openEditor(page);
  await page.locator("rect.svg-obstacle").first().click();
  const handle=page.locator('circle[data-kind="obstacle"][data-handle="rotate"]').first();
  await expect(handle).toBeVisible();
  const box=await handle.boundingBox();
  if(!box)throw new Error("Alça de rotação indisponível.");
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  await page.mouse.down();
  await page.mouse.move(box.x+box.width/2+45,box.y+box.height/2,{steps:6});
  await page.mouse.up();
  await expect.poll(()=>updates.some(item=>item.table==="venue_obstacles"&&"geometry" in item.body)).toBeTruthy();
  const update=updates.find(item=>item.table==="venue_obstacles"&&"geometry" in item.body);
  expect((update?.body.geometry as {rotation_deg:number}).rotation_deg).not.toBe(0);
});
