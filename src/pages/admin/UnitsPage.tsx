import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useAppContext } from "@/context/AppContext";
import { UseCaseChips } from "@/components/common/UseCaseChips";

export const UnitsPage = () => {
  const { units, users, createUnit } = useAppContext();
  const [form, setForm] = useState({
    name: "",
    parentId: "",
    leadId: "",
  });

  const hierarchy = useMemo(
    () => units.filter((unit) => unit.parentId === null || unit.parentId === undefined),
    [units],
  );

  const childrenOf = (parentId: string) => units.filter((unit) => unit.parentId === parentId);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name) return;
    await createUnit({
      name: form.name,
      parentId: form.parentId || null,
      leadId: form.leadId || null,
    });
    setForm({ name: "", parentId: "", leadId: "" });
  };

  return (
    <div className="grid" style={{ gap: "1.25rem" }}>
      <section className="card">
        <h2 className="section-title">Unidades internas</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field">
            <span className="field-label">Nombre de la unidad</span>
            <input
              placeholder="Equipo de operaciones"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <span className="field-hint">Así se mostrará en organigramas y reportes.</span>
          </label>
          <label className="field">
            <span className="field-label">Depende de</span>
            <select
              value={form.parentId}
              onChange={(event) => setForm((prev) => ({ ...prev, parentId: event.target.value }))}
            >
              <option value="">Unidad raíz</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
            <span className="field-hint">Selecciona si pertenece a otra área.</span>
          </label>
          <label className="field">
            <span className="field-label">Líder responsable</span>
            <select
              value={form.leadId}
              onChange={(event) => setForm((prev) => ({ ...prev, leadId: event.target.value }))}
            >
              <option value="">Sin líder asignado</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </select>
            <span className="field-hint">Omitir si aún no existe responsable.</span>
          </label>
          <div style={{ alignSelf: "end" }}>
            <button type="submit" className="btn btn-primary">
              Crear unidad
            </button>
          </div>
        </form>
        <UseCaseChips cases={["CU2"]} />
      </section>

      <section className="card">
        <h2 className="section-title">Organigrama</h2>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {hierarchy.map((root) => (
            <div key={root.id} style={{ minWidth: "240px" }}>
              <strong>{root.name}</strong>
              <small style={{ display: "block", color: "var(--text-muted)" }}>
                Líder: {users.find((user) => user.id === root.leadId)?.fullName ?? "Pendiente"}
              </small>
              <ul>
                {childrenOf(root.id).map((child) => (
                  <li key={child.id}>
                    {child.name}{" "}
                    <small style={{ color: "var(--text-muted)" }}>
                      · {users.find((user) => user.id === child.leadId)?.fullName ?? "Sin líder"}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
