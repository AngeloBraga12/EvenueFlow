import "./plan.css";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { ArrowLeft, DoorOpen, Layers3, Plus, Ruler, Trash2, Edit3, AlertTriangle, Square, PanelTop, Magnet, Grid3X3, ZoomIn, ZoomOut } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getSupabaseClient } from "../../lib/supabase/client";
import type { Json, Tables } from "../../../supabase/database.types";
import { isPointInsideVenue, isRectInsideVenue, makeSpatialRect, metersToMillimeters, parseSpatialRect } from "./venue-geometry";

type Venue = Tables<"venues">;
type Wall = Tables<"venue_walls">;
type Opening = Tables<"venue_openings">;
type Obstacle = Tables<"venue_obstacles">;
type Structure = Tables<"venue_fixed_structures">;
type Kind = "wall" | "opening" | "obstacle" | "structure";
type FormState = { id?: string; kind: Kind; name: string; x: string; y: string; endX: string; endY: string; width: string; height: string; thickness: string; ceiling: string; rotation: string; openingType: Opening["opening_type"]; essential: boolean; blocks: boolean };
const blankForm = (kind: Kind): FormState => ({ kind, name: "", x: "1", y: "1", endX: "5", endY: "1", width: "1", height: "2.1", thickness: "0.15", ceiling: "", rotation: "0", openingType: "door", essential: false, blocks: true });
const mm = (value: number) => (value / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 });
const inputMeters = (value: number) => (value / 1000).toString();
const parseMm = (value: string) => metersToMillimeters(Number(value));
const parseCoordinate = (value: string) => { const n = Number(value); if (!Number.isFinite(n) || n < 0) throw new RangeError("Coordenadas devem ser zero ou positivas."); const result = Math.round(n * 1000); if (!Number.isSafeInteger(result)) throw new RangeError("Coordenada fora do intervalo permitido."); return result; };
const labelForWall = (wall: Wall, index: number) => {
  const metadata = wall.metadata as Record<string, Json | undefined>;
  return typeof metadata.label === "string" ? metadata.label : `Parede ${String(index + 1).padStart(2, "0")}`;
};

export function VenuePlanPage() {
  const { venueId = "" } = useParams();
  const supabase = getSupabaseClient();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState | null>(null);
  const [selected, setSelected] = useState<{ kind: Kind; id: string } | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [drawingWall, setDrawingWall] = useState(false);
  const [wallDraft, setWallDraft] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const wallStartRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; ids: string[] } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const patternId = useId().replace(/:/g, "");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const [v, w, o, b, s] = await Promise.all([
      supabase.from("venues").select("*").eq("id", venueId).is("deleted_at", null).single(),
      supabase.from("venue_walls").select("*").eq("venue_id", venueId).is("deleted_at", null).order("created_at"),
      supabase.from("venue_openings").select("*").eq("venue_id", venueId).is("deleted_at", null).order("created_at"),
      supabase.from("venue_obstacles").select("*").eq("venue_id", venueId).is("deleted_at", null).order("created_at"),
      supabase.from("venue_fixed_structures").select("*").eq("venue_id", venueId).is("deleted_at", null).order("created_at"),
    ]);
    if (v.error || w.error || o.error || b.error || s.error) {
      setError("Não foi possível carregar a planta. Verifique se o salão existe e se você tem acesso.");
      setVenue(null);
    } else {
      setVenue(v.data);
      setWalls(w.data ?? []);
      setOpenings(o.data ?? []);
      setObstacles(b.data ?? []);
      setStructures(s.data ?? []);
    }
    setLoading(false);
  }, [supabase, venueId]);

  useEffect(() => { void load(); }, [load]);

  const area = useMemo(() => venue ? venue.width_mm * venue.height_mm / 1_000_000 : 0, [venue]);
  function keyOf(kind: Kind, id: string) { return `${kind}:${id}`; }
  function startCreate(kind: Kind) { setError(""); setSelected(null); setSelectedKeys([]); setForm(blankForm(kind)); }
  function beginCanvasDrag(event: PointerEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const target = (event.target as Element).closest<SVGGElement>("[data-kind][data-id]");
    if (!target) {
      if (!drawingWall || !venue) return;
      const point = svgRef.current.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
      const matrix = svgRef.current.getScreenCTM(); if (!matrix) return;
      const local = point.matrixTransform(matrix.inverse()); const step = snapEnabled ? 100 : 1;
      const x = Math.max(0, Math.min(venue.width_mm, Math.round(local.x / step) * step));
      const y = Math.max(0, Math.min(venue.height_mm, Math.round(local.y / step) * step));
      wallStartRef.current = { pointerId: event.pointerId, x, y }; setWallDraft({ x1:x, y1:y, x2:x, y2:y });
      svgRef.current.setPointerCapture(event.pointerId); return;
    }
    const kind = target.dataset.kind as Kind; const id = target.dataset.id;
    if (!id || !["wall", "opening", "obstacle", "structure"].includes(kind)) return;
    const key = keyOf(kind, id);
    const next = event.ctrlKey || event.metaKey ? (selectedKeys.includes(key) ? selectedKeys.filter(value => value !== key) : [...selectedKeys, key]) : selectedKeys.includes(key) ? selectedKeys : [key];
    setSelectedKeys(next); setSelected({ kind, id });
    if (event.ctrlKey || event.metaKey) return;
    const point = svgRef.current.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
    const matrix = svgRef.current.getScreenCTM(); if (!matrix) return;
    const local = point.matrixTransform(matrix.inverse());
    dragRef.current = { pointerId: event.pointerId, startX: local.x, startY: local.y, ids: next.length ? next : [key] };
    svgRef.current.setPointerCapture(event.pointerId);
  }
  function canvasPointerMove(event: PointerEvent<SVGSVGElement>) {
    if (wallStartRef.current?.pointerId === event.pointerId && svgRef.current && venue) {
      const point = svgRef.current.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
      const matrix = svgRef.current.getScreenCTM(); if (!matrix) return;
      const local = point.matrixTransform(matrix.inverse()); const step = snapEnabled ? 100 : 1;
      const x = Math.max(0, Math.min(venue.width_mm, Math.round(local.x / step) * step));
      const y = Math.max(0, Math.min(venue.height_mm, Math.round(local.y / step) * step));
      setWallDraft({ x1:wallStartRef.current.x, y1:wallStartRef.current.y, x2:x, y2:y }); return;
    }
    const drag = dragRef.current; if (!drag || drag.pointerId !== event.pointerId || !svgRef.current) return;
    const point = svgRef.current.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
    const matrix = svgRef.current.getScreenCTM(); if (!matrix) return;
    const local = point.matrixTransform(matrix.inverse());
    let x = Math.round(local.x - drag.startX), y = Math.round(local.y - drag.startY);
    if (snapEnabled) { x = Math.round(x / 100) * 100; y = Math.round(y / 100) * 100; }
    setDragDelta({ x, y });
  }
  async function finishCanvasDrag(event: React.PointerEvent<SVGSVGElement>) {
    if (wallStartRef.current?.pointerId === event.pointerId) {
      const start = wallStartRef.current; wallStartRef.current = null; const draft = wallDraft; setWallDraft(null);
      if (venue && draft && (draft.x1 !== draft.x2 || draft.y1 !== draft.y2)) {
        setSaving(true);
        const result = await supabase.from("venue_walls").insert({ venue_id:venue.id, start_x_mm:start.x, start_y_mm:start.y, end_x_mm:draft.x2, end_y_mm:draft.y2, thickness_mm:150, height_mm:null, metadata:{label:"Parede"} as Json });
        setSaving(false);
        if (result.error) setError("Não foi possível criar a parede. Verifique sua permissão."); else { setDrawingWall(false); await load(); }
      }
      return;
    }
    if (!venue) return;
    const drag = dragRef.current; if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null; const delta = dragDelta; setDragDelta({ x: 0, y: 0 });
    if (!delta.x && !delta.y) return;
    const jobs: Array<PromiseLike<any>> = [];
    for (const key of drag.ids) {
      const [kind, id] = key.split(":") as [Kind, string];
      if (kind === "wall") {
        const item = walls.find(value => value.id === id); if (!item) continue;
        const x1=item.start_x_mm+delta.x,y1=item.start_y_mm+delta.y,x2=item.end_x_mm+delta.x,y2=item.end_y_mm+delta.y;
        if (Math.min(x1,x2)<0 || Math.min(y1,y2)<0 || Math.max(x1,x2)>venue.width_mm || Math.max(y1,y2)>venue.height_mm) { setError("A movimentação ultrapassaria os limites do salão."); return; }
        jobs.push(supabase.from("venue_walls").update({start_x_mm:x1,start_y_mm:y1,end_x_mm:x2,end_y_mm:y2}).eq("id",id));
      } else if (kind === "opening") {
        const item=openings.find(value=>value.id===id); if(!item) continue;
        const r=item.rotation_deg*Math.PI/180, ex=item.x_mm+item.width_mm*Math.cos(r)+delta.x, ey=item.y_mm+item.width_mm*Math.sin(r)+delta.y, x=item.x_mm+delta.x,y=item.y_mm+delta.y;
        if(Math.min(x,ex)<0 || Math.min(y,ey)<0 || Math.max(x,ex)>venue.width_mm || Math.max(y,ey)>venue.height_mm){setError("A movimentação ultrapassaria os limites do salão.");return;}
        jobs.push(supabase.from("venue_openings").update({x_mm:x,y_mm:y}).eq("id",id));
      } else {
        const list=kind==="obstacle"?obstacles:structures; const item=list.find(value=>value.id===id); if(!item) continue;
        const rect=parseSpatialRect(item.geometry); if(!rect) continue;
        const moved={...rect,x_mm:rect.x_mm+delta.x,y_mm:rect.y_mm+delta.y};
        if(!isRectInsideVenue(moved,venue.width_mm,venue.height_mm)){setError("A movimentação ultrapassaria os limites do salão.");return;}
        jobs.push(kind==="obstacle" ? supabase.from("venue_obstacles").update({geometry:moved as unknown as Json}).eq("id",id) : supabase.from("venue_fixed_structures").update({geometry:moved as unknown as Json}).eq("id",id));
      }
    }
    setSaving(true); const results=await Promise.all(jobs); setSaving(false);
    if(results.some(result=>result.error)) setError("Não foi possível salvar a movimentação. A planta será recarregada.");
    await load();
  }
  function startEdit(kind: Kind, id: string) {
    if (!venue) return;
    const base = blankForm(kind);
    if (kind === "wall") {
      const item = walls.find(x => x.id === id); if (!item) return;
      const meta = item.metadata as Record<string, Json | undefined>;
      setForm({ ...base, id, name: typeof meta.label === "string" ? meta.label : "Parede", x: inputMeters(item.start_x_mm), y: inputMeters(item.start_y_mm), endX: inputMeters(item.end_x_mm), endY: inputMeters(item.end_y_mm), thickness: inputMeters(item.thickness_mm), ceiling: item.height_mm ? inputMeters(item.height_mm) : "" });
    } else if (kind === "opening") {
      const item = openings.find(x => x.id === id); if (!item) return;
      setForm({ ...base, id, x: inputMeters(item.x_mm), y: inputMeters(item.y_mm), width: inputMeters(item.width_mm), height: item.height_mm ? inputMeters(item.height_mm) : "", rotation: String(item.rotation_deg), openingType: item.opening_type, essential: item.is_essential });
    } else {
      const list = kind === "obstacle" ? obstacles : structures;
      const item = list.find(x => x.id === id); if (!item) return;
      const rect = parseSpatialRect(item.geometry);
      if (!rect) { setError("A geometria salva possui um formato não reconhecido e não pode ser editada nesta versão."); return; }
      setForm({ ...base, id, name: item.name, x: inputMeters(rect.x_mm), y: inputMeters(rect.y_mm), width: inputMeters(rect.width_mm), height: inputMeters(rect.height_mm) });
    }
    setError("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!venue || !form) return;
    setSaving(true); setError("");
    try {
      const x = parseCoordinate(form.x); const y = parseCoordinate(form.y);
      if (form.kind === "wall") {
        const endX = parseCoordinate(form.endX); const endY = parseCoordinate(form.endY);
        const thickness = parseMm(form.thickness);
        const height = form.ceiling.trim() ? parseMm(form.ceiling) : null;
        if (!isPointInsideVenue({ x_mm: x, y_mm: y }, venue.width_mm, venue.height_mm) || !isPointInsideVenue({ x_mm: endX, y_mm: endY }, venue.width_mm, venue.height_mm) || (x === endX && y === endY)) throw new Error("Os pontos da parede devem ser diferentes e estar dentro do salão.");
        const payload = { venue_id: venue.id, start_x_mm: x, start_y_mm: y, end_x_mm: endX, end_y_mm: endY, thickness_mm: thickness, height_mm: height, metadata: { label: form.name.trim() || "Parede" } as Json };
        const result = form.id ? await supabase.from("venue_walls").update(payload).eq("id", form.id) : await supabase.from("venue_walls").insert(payload);
        if (result.error) throw result.error;
      } else if (form.kind === "opening") {
        const width = parseMm(form.width);
        const height = form.height.trim() ? parseMm(form.height) : null;
        const rotation = Number(form.rotation);
        if (!Number.isFinite(rotation) || rotation < 0 || rotation >= 360 || !Number.isInteger(rotation)) throw new Error("A rotação deve ser um inteiro entre 0° e 359°.");
        const radians = rotation * Math.PI / 180;
        const endX = x + width * Math.cos(radians);
        const endY = y + width * Math.sin(radians);
        if (Math.min(x, endX) < 0 || Math.max(x, endX) > venue.width_mm || Math.min(y, endY) < 0 || Math.max(y, endY) > venue.height_mm) throw new Error("A abertura deve ficar dentro dos limites do salão.");
        const payload = { venue_id: venue.id, x_mm: x, y_mm: y, width_mm: width, height_mm: height, rotation_deg: rotation, opening_type: form.openingType, is_essential: form.essential };
        const result = form.id ? await supabase.from("venue_openings").update(payload).eq("id", form.id) : await supabase.from("venue_openings").insert(payload);
        if (result.error) throw result.error;
      } else {
        const rect = makeSpatialRect(x, y, parseMm(form.width), parseMm(form.height));
        if (!isRectInsideVenue(rect, venue.width_mm, venue.height_mm)) throw new Error("O retângulo deve ficar completamente dentro do salão.");
        if (!form.name.trim()) throw new Error("Informe um nome para o elemento.");
        if (form.kind === "obstacle") {
          const payload = { venue_id: venue.id, name: form.name.trim(), geometry: rect as unknown as Json, blocks_circulation: form.blocks };
          const result = form.id ? await supabase.from("venue_obstacles").update(payload).eq("id", form.id) : await supabase.from("venue_obstacles").insert(payload);
          if (result.error) throw result.error;
        } else {
          const payload = { venue_id: venue.id, name: form.name.trim(), geometry: rect as unknown as Json };
          const result = form.id ? await supabase.from("venue_fixed_structures").update(payload).eq("id", form.id) : await supabase.from("venue_fixed_structures").insert(payload);
          if (result.error) throw result.error;
        }
      }
      setForm(null); await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível salvar o elemento.");
    } finally { setSaving(false); }
  }

  async function archive(kind: Kind, id: string) {
    if (!window.confirm("Arquivar este elemento da planta?")) return;
    const stamp = new Date().toISOString();
    const result = kind === "wall" ? await supabase.from("venue_walls").update({ deleted_at: stamp }).eq("id", id)
      : kind === "opening" ? await supabase.from("venue_openings").update({ deleted_at: stamp }).eq("id", id)
      : kind === "obstacle" ? await supabase.from("venue_obstacles").update({ deleted_at: stamp }).eq("id", id)
      : await supabase.from("venue_fixed_structures").update({ deleted_at: stamp }).eq("id", id);
    if (result.error) setError("Não foi possível arquivar o elemento. Verifique sua permissão.");
    else { setSelected(null); await load(); }
  }

  if (loading) return <div className="screen-loader">Carregando planta técnica…</div>;
  if (!venue) return <main className="plan-shell"><div className="plan-error">{error || "Salão não encontrado."}<Link to="/app/saloes">Voltar aos salões</Link></div></main>;

  const rectShape = (item: Obstacle | Structure, kind: Kind) => {
    const rect = parseSpatialRect(item.geometry);
    if (!rect) return null;
    return <g key={item.id} data-kind={kind} data-id={item.id} transform={`translate(${selectedKeys.includes(keyOf(kind,item.id)) ? dragDelta.x : 0} ${selectedKeys.includes(keyOf(kind,item.id)) ? dragDelta.y : 0}) rotate(${rect.rotation_deg} ${rect.x_mm + rect.width_mm / 2} ${rect.y_mm + rect.height_mm / 2})`} onClick={() => setSelected({ kind, id: item.id })} className="plan-selectable">
      <rect x={rect.x_mm} y={rect.y_mm} width={rect.width_mm} height={rect.height_mm} className={kind === "obstacle" ? "svg-obstacle" : "svg-structure"} />
      <text x={rect.x_mm + rect.width_mm / 2} y={rect.y_mm + rect.height_mm / 2} className="svg-label" textAnchor="middle" dominantBaseline="middle">{item.name}</text>
      {selected?.id === item.id && <rect x={rect.x_mm} y={rect.y_mm} width={rect.width_mm} height={rect.height_mm} className="svg-selected" />}
    </g>;
  };

  return <main className="plan-shell">
    <header className="plan-header"><Link to="/app/saloes" className="plan-back"><ArrowLeft size={16}/> Salões</Link><div><span className="eyebrow">EDITOR DE ESPAÇO · P0</span><h1>{venue.name}</h1><p>{mm(venue.width_mm)} × {mm(venue.height_mm)} m · {area.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} m²</p></div><span className="plan-unit"><Ruler size={14}/> UNIDADE: MM</span></header>
    {error && <div className="plan-alert" role="alert"><AlertTriangle size={16}/>{error}</div>}
    <div className="plan-workspace">
      <section className="plan-canvas-panel"><div className="plan-canvas-head"><div><span className="eyebrow">PLANTA BAIXA</span><strong>Arraste para mover · Ctrl/clique para seleção múltipla</strong></div><div className="plan-canvas-actions"><button type="button" title="Desenhar parede" aria-pressed={drawingWall} className={drawingWall ? "active" : ""} onClick={() => { setDrawingWall(value => !value); setWallDraft(null); setSelectedKeys([]); }}><Plus size={14}/> Parede livre</button><button type="button" title="Encaixe em grade" aria-pressed={snapEnabled} className={snapEnabled ? "active" : ""} onClick={() => setSnapEnabled(value => !value)}><Magnet size={14}/> Encaixe</button><button type="button" title="Mostrar ou ocultar grade" aria-pressed={gridVisible} className={gridVisible ? "active" : ""} onClick={() => setGridVisible(value => !value)}><Grid3X3 size={14}/> Grade</button><button type="button" title="Diminuir zoom" onClick={() => setZoom(value => Math.max(.5, Number((value - .1).toFixed(1))))}><ZoomOut size={14}/></button><span>{Math.round(zoom * 100)}%</span><button type="button" title="Aumentar zoom" onClick={() => setZoom(value => Math.min(2, Number((value + .1).toFixed(1))))}><ZoomIn size={14}/></button><span>{walls.length + openings.length + obstacles.length + structures.length} elementos</span></div></div>
        <div className="plan-canvas-wrap"><svg ref={svgRef} className="venue-svg" viewBox={`${-500 + venue.width_mm * (1 - 1 / zoom) / 2} ${-500 + venue.height_mm * (1 - 1 / zoom) / 2} ${(venue.width_mm + 1000) / zoom} ${(venue.height_mm + 1000) / zoom}`} role="img" aria-label={`Planta técnica de ${venue.name}`} onPointerDown={beginCanvasDrag} onPointerMove={canvasPointerMove} onPointerUp={finishCanvasDrag} onPointerCancel={finishCanvasDrag}>
          <defs><pattern id={patternId} width="500" height="500" patternUnits="userSpaceOnUse"><path d="M 500 0 L 0 0 0 500" className="svg-grid-line" fill="none"/></pattern></defs>
          {gridVisible && <rect x="-500" y="-500" width={venue.width_mm + 1000} height={venue.height_mm + 1000} fill={`url(#${patternId})`}/>}
          <rect x="0" y="0" width={venue.width_mm} height={venue.height_mm} className="svg-room"/>
          <rect x="0" y="0" width={venue.width_mm} height={venue.height_mm} className="svg-boundary"/>
          {wallDraft && <line x1={wallDraft.x1} y1={wallDraft.y1} x2={wallDraft.x2} y2={wallDraft.y2} className="svg-wall-draft" pointerEvents="none"/>}
          {walls.map(wall=><g key={wall.id} data-kind="wall" data-id={wall.id} transform={`translate(${selectedKeys.includes(keyOf("wall",wall.id)) ? dragDelta.x : 0} ${selectedKeys.includes(keyOf("wall",wall.id)) ? dragDelta.y : 0})`} className="plan-selectable"><line x1={wall.start_x_mm} y1={wall.start_y_mm} x2={wall.end_x_mm} y2={wall.end_y_mm} strokeWidth={Math.max(wall.thickness_mm,60)} className={selected?.id===wall.id?"svg-wall svg-wall-selected":"svg-wall"}/></g>)}
          {openings.map(item=><g key={item.id} data-kind="opening" data-id={item.id} transform={`translate(${selectedKeys.includes(keyOf("opening",item.id)) ? dragDelta.x : 0} ${selectedKeys.includes(keyOf("opening",item.id)) ? dragDelta.y : 0})`} className="plan-selectable"><line x1={item.x_mm} y1={item.y_mm} x2={item.x_mm+item.width_mm} y2={item.y_mm} transform={`rotate(${item.rotation_deg} ${item.x_mm} ${item.y_mm})`} className={selected?.id===item.id?"svg-opening svg-opening-selected":"svg-opening"}/><text x={item.x_mm+item.width_mm/2} y={item.y_mm-100} className="svg-opening-label" textAnchor="middle">{item.opening_type==="door"?"PORTA":item.opening_type==="window"?"JANELA":item.opening_type==="emergency_exit"?"SAÍDA":"SERVIÇO"}</text></g>)}
          {obstacles.map(item=>rectShape(item,"obstacle"))}
          {structures.map(item=>rectShape(item,"structure"))}
        </svg></div>
        <div className="plan-legend"><span><i className="legend-wall"/> Paredes</span><span><i className="legend-opening"/> Aberturas</span><span><i className="legend-obstacle"/> Obstáculos</span><span><i className="legend-structure"/> Estruturas</span></div>
      </section>
      <aside className="plan-tools"><div className="plan-tools-title"><Layers3 size={16}/> ELEMENTOS DO ESPAÇO</div>
        <div className="plan-add-grid">
          <button onClick={()=>startCreate("wall")}><Plus size={14}/> Parede</button><button onClick={()=>startCreate("opening")}><DoorOpen size={14}/> Abertura</button><button onClick={()=>startCreate("obstacle")}><AlertTriangle size={14}/> Obstáculo</button><button onClick={()=>startCreate("structure")}><Square size={14}/> Estrutura</button>
        </div>
        <div className="plan-section"><h3><span>PAREDES</span><small>{walls.length}</small></h3>{walls.map((item,index)=><PlanRow key={item.id} title={labelForWall(item,index)} detail={`${mm(item.start_x_mm)}, ${mm(item.start_y_mm)} → ${mm(item.end_x_mm)}, ${mm(item.end_y_mm)} m`} active={selected?.id===item.id} onSelect={()=>setSelected({kind:"wall",id:item.id})} onEdit={()=>startEdit("wall",item.id)} onArchive={()=>void archive("wall",item.id)}/>)}</div>
        <div className="plan-section"><h3><span>PORTAS E JANELAS</span><small>{openings.length}</small></h3>{openings.map(item=><PlanRow key={item.id} title={item.opening_type==="door"?"Porta":item.opening_type==="window"?"Janela":item.opening_type==="emergency_exit"?"Saída de emergência":"Entrada de serviço"} detail={`${mm(item.width_mm)} m · X ${mm(item.x_mm)} / Y ${mm(item.y_mm)}`} active={selected?.id===item.id} onSelect={()=>setSelected({kind:"opening",id:item.id})} onEdit={()=>startEdit("opening",item.id)} onArchive={()=>void archive("opening",item.id)}/>)}</div>
        <div className="plan-section"><h3><span>OBSTÁCULOS</span><small>{obstacles.length}</small></h3>{obstacles.map(item=><PlanRow key={item.id} title={item.name} detail={item.blocks_circulation?"Bloqueia circulação":"Não bloqueia circulação"} active={selected?.id===item.id} onSelect={()=>setSelected({kind:"obstacle",id:item.id})} onEdit={()=>startEdit("obstacle",item.id)} onArchive={()=>void archive("obstacle",item.id)}/>)}</div>
        <div className="plan-section"><h3><span>ESTRUTURAS FIXAS</span><small>{structures.length}</small></h3>{structures.map(item=><PlanRow key={item.id} title={item.name} detail="Elemento permanente" active={selected?.id===item.id} onSelect={()=>setSelected({kind:"structure",id:item.id})} onEdit={()=>startEdit("structure",item.id)} onArchive={()=>void archive("structure",item.id)}/>)}</div>
      </aside>
    </div>
    <footer className="plan-footer"><span><PanelTop size={14}/> Modelo geométrico compartilhado · 2D / 3D</span><span>Coordenadas em milímetros · {walls.length} paredes · {openings.length} aberturas</span></footer>
    {form && <div className="modal-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setForm(null);}}><section className="modal plan-modal" role="dialog" aria-modal="true" aria-labelledby="element-title">
      <div className="modal-heading"><div><span className="eyebrow">{form.id?"EDITAR ELEMENTO":"NOVO ELEMENTO"}</span><h2 id="element-title">{form.kind==="wall"?"Parede":form.kind==="opening"?"Porta, janela ou saída":form.kind==="obstacle"?"Obstáculo":"Estrutura fixa"}</h2><p>Informe as coordenadas e dimensões em metros.</p></div><button className="icon-close" onClick={()=>setForm(null)} aria-label="Fechar">×</button></div>
      <form onSubmit={save}>
        {form.kind!=="opening" && <><label htmlFor="element-name">Identificação</label><input id="element-name" className="text-input" value={form.name} onChange={e=>setForm(v=>v?{...v,name:e.target.value}:v)} maxLength={100} placeholder={form.kind==="wall"?"Parede lateral":"Ex.: Pilar central"} required={form.kind!=="wall"}/></>}
        {form.kind==="wall"?<><div className="plan-form-grid"><NumberField label="Início X (m)" value={form.x} onChange={v=>setForm(s=>s?{...s,x:v}:s)}/><NumberField label="Início Y (m)" value={form.y} onChange={v=>setForm(s=>s?{...s,y:v}:s)}/><NumberField label="Fim X (m)" value={form.endX} onChange={v=>setForm(s=>s?{...s,endX:v}:s)}/><NumberField label="Fim Y (m)" value={form.endY} onChange={v=>setForm(s=>s?{...s,endY:v}:s)}/><NumberField label="Espessura (m)" value={form.thickness} onChange={v=>setForm(s=>s?{...s,thickness:v}:s)}/><NumberField label="Altura (m)" value={form.ceiling} onChange={v=>setForm(s=>s?{...s,ceiling:v}:s)} optional/></div></>
        :form.kind==="opening"?<><label htmlFor="opening-kind">Tipo</label><select id="opening-kind" className="text-input" value={form.openingType} onChange={e=>setForm(s=>s?{...s,openingType:e.target.value as Opening["opening_type"]}:s)}><option value="door">Porta</option><option value="window">Janela</option><option value="emergency_exit">Saída de emergência</option><option value="service_entrance">Entrada de serviço</option></select><div className="plan-form-grid"><NumberField label="Posição X (m)" value={form.x} onChange={v=>setForm(s=>s?{...s,x:v}:s)}/><NumberField label="Posição Y (m)" value={form.y} onChange={v=>setForm(s=>s?{...s,y:v}:s)}/><NumberField label="Largura (m)" value={form.width} onChange={v=>setForm(s=>s?{...s,width:v}:s)}/><NumberField label="Altura (m)" value={form.height} onChange={v=>setForm(s=>s?{...s,height:v}:s)} optional/><NumberField label="Rotação (°)" value={form.rotation} onChange={v=>setForm(s=>s?{...s,rotation:v}:s)}/></div><label className="plan-check"><input type="checkbox" checked={form.essential} onChange={e=>setForm(s=>s?{...s,essential:e.target.checked}:s)}/> Abertura essencial para operação ou segurança</label></>
        :<><div className="plan-form-grid"><NumberField label="Posição X (m)" value={form.x} onChange={v=>setForm(s=>s?{...s,x:v}:s)}/><NumberField label="Posição Y (m)" value={form.y} onChange={v=>setForm(s=>s?{...s,y:v}:s)}/><NumberField label="Largura (m)" value={form.width} onChange={v=>setForm(s=>s?{...s,width:v}:s)}/><NumberField label="Profundidade (m)" value={form.height} onChange={v=>setForm(s=>s?{...s,height:v}:s)}/></div>{form.kind==="obstacle"&&<label className="plan-check"><input type="checkbox" checked={form.blocks} onChange={e=>setForm(s=>s?{...s,blocks:e.target.checked}:s)}/> Bloqueia circulação</label>}</>}
        {error&&<p className="form-message error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="button button-quiet" onClick={()=>setForm(null)}>Cancelar</button><button className="button button-primary" disabled={saving}>{saving?"Salvando…":"Salvar elemento"}</button></div>
      </form>
    </section></div>}
  </main>;
}

function NumberField({label,value,onChange,optional=false}:{label:string;value:string;onChange:(value:string)=>void;optional?:boolean}) {
  const id=useId();
  return <div className="plan-number-field"><label htmlFor={id}>{label}{optional&&<span> opcional</span>}</label><input id={id} className="text-input" type="number" min="0" max="1000" step="0.01" value={value} onChange={e=>onChange(e.target.value)} placeholder={optional?"—":"0,00"} required={!optional}/></div>;
}

function PlanRow({title,detail,active,onSelect,onEdit,onArchive}:{title:string;detail:string;active:boolean;onSelect:()=>void;onEdit:()=>void;onArchive:()=>void}) {
  return <div className={active?"plan-row active":"plan-row"}><button className="plan-row-main" onClick={onSelect}><strong>{title}</strong><small>{detail}</small></button><button className="plan-icon-button" onClick={onEdit} aria-label={`Editar ${title}`}><Edit3 size={13}/></button><button className="plan-icon-button" onClick={onArchive} aria-label={`Arquivar ${title}`}><Trash2 size={13}/></button></div>;
}
