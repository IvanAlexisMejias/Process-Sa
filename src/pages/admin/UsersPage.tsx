import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAppContext } from "@/context/AppContext";
import { UseCaseChips } from "@/components/common/UseCaseChips";
import { UserAvatar } from "@/components/common/UserAvatar";
import type { RoleDefinition } from "@/types/domain";

const DEFAULT_PASSWORD = "Process123*";

type Feedback = { type: "success" | "error"; message: string } | null;

export const UsersPage = () => {
  const { users, roles, units, createUser } = useAppContext();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: DEFAULT_PASSWORD,
    roleId: roles[0]?.id ?? "",
    unitId: units[0]?.id ?? "",
  });
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    setForm((prev) => {
      const roleId = prev.roleId || roles[0]?.id || "";
      const unitId = prev.unitId || units[0]?.id || "";
      if (roleId === prev.roleId && unitId === prev.unitId) {
        return prev;
      }
      return { ...prev, roleId, unitId };
    });
  }, [roles, units]);

  const handleChange = (field: keyof typeof form) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.fullName || !form.email || !form.roleId || !form.unitId) return;
    try {
      await createUser(form);
      setFeedback({ type: "success", message: `${form.fullName} fue dado de alta con la contraseña ${DEFAULT_PASSWORD}.` });
      setForm({
        fullName: "",
        email: "",
        password: DEFAULT_PASSWORD,
        roleId: roles[0]?.id ?? "",
        unitId: units[0]?.id ?? "",
      });
    } catch (error) {
      setFeedback({ type: "error", message: (error as Error).message ?? "No fue posible crear el usuario." });
    }
  };

  return (
    <div className="grid" style={{ gap: "1.25rem" }}>
      <section className="card">
        <h2 className="section-title">Alta rápida de usuarios (Admins)</h2>
        <p style={{ color: "var(--text-muted)", marginTop: 0 }}>
          La contraseña inicial se fija automáticamente en <strong>{DEFAULT_PASSWORD}</strong>.
          Comunica al colaborador que la cambie en su primer ingreso.
        </p>
        {feedback && (
          <div
            role="alert"
            style={{
              borderRadius: "var(--radius)",
              padding: "0.75rem 1rem",
              background: feedback.type === "success" ? "#e3fcef" : "#ffeceb",
              color: feedback.type === "success" ? "#027a48" : "#b71c1c",
              marginBottom: "1rem",
            }}
          >
            {feedback.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field">
            <span className="field-label">Nombre completo</span>
            <input value={form.fullName} onChange={handleChange("fullName")} required />
            <span className="field-hint">Se mostrará en tareas, reportes y perfiles.</span>
          </label>
          <label className="field">
            <span className="field-label">Correo corporativo</span>
            <input
              placeholder="email@empresa.com"
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
            <span className="field-hint">Debe ser único en la plataforma.</span>
          </label>
          <label className="field">
            <span className="field-label">Contraseña inicial</span>
            <input
              type="password"
              name="temporary-password"
              value={form.password}
              readOnly
              autoComplete="new-password"
              style={{ background: "#f8fafc", cursor: "not-allowed" }}
            />
            <span className="field-hint">Sólo lectura para recordar el valor predeterminado.</span>
          </label>
          <label className="field">
            <span className="field-label">Rol / Perfil</span>
            <select
              value={form.roleId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, roleId: event.target.value as RoleDefinition["id"] }))
              }
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <span className="field-hint">Controla los permisos disponibles.</span>
          </label>
          <label className="field">
            <span className="field-label">Unidad</span>
            <select value={form.unitId} onChange={handleChange("unitId")}>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
            <span className="field-hint">Relaciona al usuario con un área.</span>
          </label>
          <div style={{ alignSelf: "end" }}>
            <button type="submit" className="btn btn-primary">
              Crear usuario
            </button>
          </div>
        </form>
        <UseCaseChips cases={["CU1", "CU4"]} />
      </section>

      <section className="card">
        <h2 className="section-title">Usuarios y perfiles activos</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Unidad</th>
              <th>Último acceso</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const role = user.role ?? roles.find((r) => r.id === user.roleId);
              const unit = user.unit ?? units.find((u) => u.id === user.unitId);
              return (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <UserAvatar name={user.fullName} color={user.avatarColor} size={36} />
                      <div>
                        <strong>{user.fullName}</strong>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{role?.name ?? "Sin rol"}</td>
                  <td>{unit?.name ?? "Sin unidad"}</td>
                  <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Nunca"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};
