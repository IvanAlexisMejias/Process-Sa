import { useState } from "react";
import type { FormEvent } from "react";
import { useAppContext } from "@/context/AppContext";
import { UseCaseChips } from "@/components/common/UseCaseChips";
import type { RoleKey } from "@/types/domain";

const stageTemplate = { name: "", description: "", expectedDurationDays: 2, ownerRole: "DESIGNER" as RoleKey };

export const FlowsPage = () => {
  const { flowTemplates, flowInstances, roles, units, createFlowTemplate, instantiateFlow } = useAppContext();
  const [stageDraft, setStageDraft] = useState(stageTemplate);
  const [form, setForm] = useState({
    name: "",
    description: "",
    businessObjective: "",
    typicalDurationDays: 10,
    ownerId: "",
  });
  const [stages, setStages] = useState<typeof flowTemplates[number]["stages"]>([]);

  const [instanceForm, setInstanceForm] = useState({
    templateId: flowTemplates[0]?.id ?? "",
    ownerUnitId: units[0]?.id ?? "",
    name: "Ejecución personalizada",
    kickoffDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  });

  const addStage = () => {
    if (!stageDraft.name) return;
    setStages((prev) => [
      ...prev,
      {
        id: `stage-${prev.length + 1}`,
        ...stageDraft,
        exitCriteria: "Por definir",
      },
    ]);
    setStageDraft(stageTemplate);
  };

  const handleTemplateSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name || stages.length === 0) return;
    createFlowTemplate({
      name: form.name,
      description: form.description,
      businessObjective: form.businessObjective,
      ownerId: form.ownerId || flowTemplates[0]?.ownerId || "",
      typicalDurationDays: form.typicalDurationDays,
      stages,
    });
    setForm({
      name: "",
      description: "",
      businessObjective: "",
      typicalDurationDays: 10,
      ownerId: "",
    });
    setStages([]);
  };

  const handleInstanceSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!instanceForm.templateId) return;
    instantiateFlow({
      ...instanceForm,
      kickoffDate: new Date(instanceForm.kickoffDate).toISOString(),
      dueDate: new Date(instanceForm.dueDate).toISOString(),
    });
  };

  return (
    <div className="grid" style={{ gap: "1.25rem" }}>
      <section className="card">
        <h2 className="section-title">Diseñar flujo tipo</h2>
        <form onSubmit={handleTemplateSubmit} className="grid" style={{ gap: "1rem" }}>
          <div className="form-grid">
            <label className="field">
              <span className="field-label">Nombre del flujo</span>
              <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
            </label>
            <label className="field">
              <span className="field-label">Objetivo del negocio</span>
              <input value={form.businessObjective} onChange={(event) => setForm((prev) => ({ ...prev, businessObjective: event.target.value }))} />
            </label>
            <label className="field">
              <span className="field-label">Responsable principal</span>
              <input value={form.ownerId} onChange={(event) => setForm((prev) => ({ ...prev, ownerId: event.target.value }))} placeholder="ID de usuario" />
              <span className="field-hint">Puedes copiarlo desde la tabla de usuarios.</span>
            </label>
            <label className="field">
              <span className="field-label">Duración típica (días)</span>
              <input
                type="number"
                min={1}
                value={form.typicalDurationDays}
                onChange={(event) => setForm((prev) => ({ ...prev, typicalDurationDays: Number(event.target.value) }))}
              />
            </label>
          </div>
          <label className="field">
            <span className="field-label">Descripción</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              style={{ minHeight: "90px" }}
            />
          </label>
          <div
            style={{
              border: "1px dashed var(--border-soft)",
              borderRadius: "var(--radius)",
              padding: "1rem",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Etapas del flujo</h3>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              {stages.map((stage) => (
                <span key={stage.id} className="tag">
                  {stage.name} · {stage.ownerRole}
                </span>
              ))}
            </div>
            <div className="form-grid">
              <label className="field">
                <span className="field-label">Nombre de etapa</span>
                <input value={stageDraft.name} onChange={(event) => setStageDraft((prev) => ({ ...prev, name: event.target.value }))} />
              </label>
              <label className="field">
                <span className="field-label">Rol responsable</span>
                <select
                  value={stageDraft.ownerRole}
                  onChange={(event) => setStageDraft((prev) => ({ ...prev, ownerRole: event.target.value as RoleKey }))}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.key}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Duración estimada</span>
                <input
                  type="number"
                  min={1}
                  value={stageDraft.expectedDurationDays}
                  onChange={(event) => setStageDraft((prev) => ({ ...prev, expectedDurationDays: Number(event.target.value) }))}
                />
              </label>
              <div style={{ alignSelf: "end" }}>
                <button type="button" className="btn btn-outline" onClick={addStage}>
                  Agregar etapa
                </button>
              </div>
            </div>
          </div>
          <div>
            <button type="submit" className="btn btn-primary">
              Guardar flujo
            </button>
          </div>
        </form>
        <UseCaseChips cases={["CU5"]} />
      </section>

      <section className="card">
        <h2 className="section-title">Instanciar flujo</h2>
        <form onSubmit={handleInstanceSubmit} className="form-grid">
          <label className="field">
            <span className="field-label">Plantilla</span>
            <select value={instanceForm.templateId} onChange={(event) => setInstanceForm((prev) => ({ ...prev, templateId: event.target.value }))}>
              {flowTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Unidad propietaria</span>
            <select value={instanceForm.ownerUnitId} onChange={(event) => setInstanceForm((prev) => ({ ...prev, ownerUnitId: event.target.value }))}>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Fecha de inicio</span>
            <input
              type="date"
              value={instanceForm.kickoffDate}
              onChange={(event) => setInstanceForm((prev) => ({ ...prev, kickoffDate: event.target.value }))}
            />
          </label>
          <label className="field">
            <span className="field-label">Fecha de término</span>
            <input
              type="date"
              value={instanceForm.dueDate}
              onChange={(event) => setInstanceForm((prev) => ({ ...prev, dueDate: event.target.value }))}
            />
          </label>
          <div style={{ alignSelf: "end" }}>
            <button type="submit" className="btn btn-primary">
              Ejecutar flujo
            </button>
          </div>
        </form>
        <UseCaseChips cases={["CU19"]} />
      </section>

      <section className="card">
        <h2 className="section-title">Biblioteca de flujos</h2>
        <div className="grid two">
          {flowTemplates.map((template) => (
            <article key={template.id} style={{ border: "1px solid var(--border-soft)", borderRadius: "var(--radius)", padding: "1rem" }}>
              <strong>{template.name}</strong>
              <p style={{ color: "var(--text-muted)" }}>{template.description}</p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {template.stages.map((stage) => (
                  <span key={stage.id} className="tag">
                    {stage.name} · {stage.ownerRole}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Ejecuciones recientes</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Unidad</th>
              <th>Avance</th>
              <th>Salud</th>
            </tr>
          </thead>
          <tbody>
            {flowInstances.map((instance) => (
              <tr key={instance.id}>
                <td>{instance.name}</td>
                <td>{units.find((unit) => unit.id === instance.ownerUnitId)?.name}</td>
                <td>{instance.progress}%</td>
                <td>{instance.health}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
