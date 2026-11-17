import "./venues.css";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, Building2, Edit3, Plus, Ruler, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { getSupabaseClient } from "../../lib/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "../../../supabase/database.types";
import { metersToMillimeters, rectangleBoundary } from "./venue-geometry";

type Venue = Tables<"venues">;
type Project = Pick<Tables<"projects">, "id" | "name" | "organization_id">;
type VenueForm = {
  id?: string;
  projectId: string;
  name: string;
  widthM: string;
  heightM: string;
  ceilingM: string;
};

const emptyForm: VenueForm = { projectId: "", name: "", widthM: "20", heightM: "15", ceilingM: "" };
const toMeters = (value: number | null) => value == null ? "" : (value / 1000).toString();

export function VenuesPage() {
  const { user } = useAuth();
  const supabase = getSupabaseClient();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<VenueForm>(emptyForm);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    const [venueResult, projectResult] = await Promise.all([
      supabase.from("venues").select("*").is("deleted_at", null).order("updated_at", { ascending: false }),
      supabase.from("projects").select("id,name,organization_id").is("deleted_at", null).order("updated_at", { ascending: false }),
    ]);
    if (venueResult.error || projectResult.error) {
      setError("Não foi possível carregar os salões e projetos. Confira seu acesso e tente novamente.");
    } else {
      setVenues(venueResult.data ?? []);
      setProjects(projectResult.data ?? []);
    }
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => { void load(); }, [load]);

  const projectNames = useMemo(() => new Map(projects.map(project => [project.id, project.name])), [projects]);
  const filtered = venues.filter(venue =>
    venue.name.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")) ||
    (projectNames.get(venue.project_id) ?? "").toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))
  );

  function openCreate() {
    setForm({ ...emptyForm, projectId: projects[0]?.id ?? "" });
    setError("");
    setModalOpen(true);
  }

  function openEdit(venue: Venue) {
    setForm({
      id: venue.id,
      projectId: venue.project_id,
      name: venue.name,
      widthM: toMeters(venue.width_mm),
      heightM: toMeters(venue.height_mm),
      ceilingM: toMeters(venue.ceiling_height_mm),
    });
    setError("");
    setModalOpen(true);
  }

  async function saveVenue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const width = metersToMillimeters(Number(form.widthM));
    const height = metersToMillimeters(Number(form.heightM));
    const ceiling = form.ceilingM.trim() ? metersToMillimeters(Number(form.ceilingM)) : null;
    const project = projects.find(item => item.id === form.projectId);
    if (!project || !form.name.trim() || !Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0 || (ceiling !== null && (!Number.isSafeInteger(ceiling) || ceiling <= 0))) {
      setError("Informe um projeto, nome e dimensões válidas em metros.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (form.id) {
        const changes: TablesUpdate<"venues"> = {
          name: form.name.trim(),
          width_mm: width,
          height_mm: height,
          ceiling_height_mm: ceiling,
          boundary: rectangleBoundary(width, height),
        };
        const result = await supabase.from("venues").update(changes).eq("id", form.id).select("*").single();
        if (result.error) throw result.error;
        setVenues(current => current.map(item => item.id === form.id ? result.data : item));
      } else {
        const record: TablesInsert<"venues"> = {
          name: form.name.trim(),
          project_id: project.id,
          organization_id: project.organization_id,
          created_by: user.id,
          shape: "rectangle",
          width_mm: width,
          height_mm: height,
          ceiling_height_mm: ceiling,
          boundary: rectangleBoundary(width, height),
        };
        const result = await supabase.from("venues").insert(record).select("*").single();
        if (result.error) throw result.error;
        setVenues(current => [result.data, ...current]);
      }
      setModalOpen(false);
      setForm(emptyForm);
    } catch {
      setError("Não foi possível salvar o salão. Verifique as permissões do projeto e os dados informados.");
    } finally {
      setSaving(false);
    }
  }

  async function archiveVenue(venue: Venue) {
    if (!window.confirm(`Arquivar o salão “${venue.name}”? Ele deixará de aparecer na lista, mas não será apagado permanentemente.`)) return;
    setError("");
    const result = await supabase.from("venues").update({ deleted_at: new Date().toISOString() }).eq("id", venue.id);
    if (result.error) setError("Não foi possível arquivar este salão. Verifique sua permissão no projeto.");
    else setVenues(current => current.filter(item => item.id !== venue.id));
  }

  return (
    <div className="app-shell">
      <main className="workspace-main venues-main">
        <header className="topbar">
          <Link className="breadcrumb" to="/app"><ArrowLeft size={14} /> Workspace <span>/</span> Salões</Link>
          <span className="mode-indicator">VENUE MANAGER</span>
        </header>
        <section className="page-content">
          <div className="page-heading">
            <div><span className="eyebrow">BIBLIOTECA DE ESPAÇOS</span><h1>Salões</h1><p className="muted">Cadastre dimensões e mantenha os espaços vinculados aos projetos.</p></div>
            <button className="button button-primary" onClick={openCreate} disabled={projects.length === 0}><Plus size={17} /> Novo salão</button>
          </div>
          <div className="venue-toolbar">
            <div className="project-search"><Search size={16} /><input aria-label="Buscar salões" placeholder="Buscar salão ou projeto…" value={query} onChange={event => setQuery(event.target.value)} /></div>
            <span className="venue-count">{filtered.length} {filtered.length === 1 ? "salão" : "salões"}</span>
          </div>
          {error && <p className="form-message error" role="alert">{error}</p>}
          {loading ? <div className="loading-line">Carregando salões…</div> :
            filtered.length === 0 ? <div className="empty-state">
              <div className="empty-mark"><Building2 size={28} /></div>
              <h3>{query ? "Nenhum salão encontrado" : "Sua biblioteca de espaços está vazia."}</h3>
              <p>{query ? "Tente outro termo de busca." : projects.length ? "Cadastre o primeiro espaço e informe suas dimensões físicas." : "Crie um projeto antes de cadastrar um salão."}</p>
              {projects.length > 0 && !query && <button className="button button-secondary" onClick={openCreate}><Plus size={16} /> Cadastrar primeiro salão</button>}
              {!projects.length && <Link className="button button-secondary" to="/app">Ir para projetos</Link>}
            </div> :
            <div className="venue-list">{filtered.map(venue => <article className="venue-row" key={venue.id}>
              <div className="venue-symbol"><Building2 size={19} /></div>
              <div className="venue-info"><strong>{venue.name}</strong><span>{projectNames.get(venue.project_id) ?? "Projeto indisponível"} · {venue.shape === "rectangle" ? "Retangular" : venue.shape}</span></div>
              <div className="venue-dimensions"><Ruler size={14} /><strong>{(venue.width_mm / 1000).toLocaleString("pt-BR")} × {(venue.height_mm / 1000).toLocaleString("pt-BR")} m</strong><small>{(venue.width_mm * venue.height_mm / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} m²</small></div>
              <div className="venue-actions"><button className="icon-action" onClick={() => openEdit(venue)} aria-label={`Editar ${venue.name}`}><Edit3 size={16} /></button><button className="icon-action danger-action" onClick={() => void archiveVenue(venue)} aria-label={`Arquivar ${venue.name}`}><Trash2 size={16} /></button></div>
            </article>)}</div>}
        </section>
      </main>
      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setModalOpen(false); }}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="venue-modal-title">
          <div className="modal-heading"><div><span className="eyebrow">{form.id ? "EDITAR ESPAÇO" : "NOVO ESPAÇO"}</span><h2 id="venue-modal-title">{form.id ? "Gerenciar salão" : "Cadastrar salão"}</h2><p>As medidas são armazenadas em milímetros para manter precisão.</p></div><button className="icon-close" onClick={() => setModalOpen(false)} aria-label="Fechar">×</button></div>
          <form onSubmit={saveVenue}>
            <label htmlFor="venue-project">Projeto vinculado</label>
            <select id="venue-project" className="text-input" value={form.projectId} onChange={event => setForm(current => ({ ...current, projectId: event.target.value }))} disabled={Boolean(form.id)} required>
              <option value="">Selecione um projeto</option>{projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
            <label htmlFor="venue-name">Nome do salão</label><input id="venue-name" className="text-input" value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} maxLength={120} placeholder="Ex.: Salão principal" required />
            <div className="venue-form-grid">
              <div><label htmlFor="venue-width">Largura (m)</label><input id="venue-width" className="text-input" type="number" min="0.1" max="1000" step="0.01" value={form.widthM} onChange={event => setForm(current => ({ ...current, widthM: event.target.value }))} required /></div>
              <div><label htmlFor="venue-height">Comprimento (m)</label><input id="venue-height" className="text-input" type="number" min="0.1" max="1000" step="0.01" value={form.heightM} onChange={event => setForm(current => ({ ...current, heightM: event.target.value }))} required /></div>
              <div className="venue-ceiling"><label htmlFor="venue-ceiling">Pé-direito (m) <span>opcional</span></label><input id="venue-ceiling" className="text-input" type="number" min="0.1" max="100" step="0.01" value={form.ceilingM} onChange={event => setForm(current => ({ ...current, ceilingM: event.target.value }))} placeholder="Ex.: 4,50" /></div>
            </div>
            {error && <p className="form-message error" role="alert">{error}</p>}
            <div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setModalOpen(false)}>Cancelar</button><button className="button button-primary" disabled={saving}>{saving ? "Salvando…" : "Salvar salão"}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}
