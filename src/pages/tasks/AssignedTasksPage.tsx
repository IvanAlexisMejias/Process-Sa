import { useMemo, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { UseCaseChips } from "@/components/common/UseCaseChips";
import { UserAvatar } from "@/components/common/UserAvatar";

type Feedback = { type: "success" | "error"; message: string } | null;

export const AssignedTasksPage = () => {
  const { tasks, users, currentUser, updateTask, roles } = useAppContext();
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [newOwnerId, setNewOwnerId] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const currentRole = roles.find((role) => role.id === currentUser?.roleId);
  const canReassignAll = currentRole?.key === "ADMIN";

  const reassignableTasks = useMemo(() => {
    if (canReassignAll) return tasks;
    if (!currentUser) return [];
    return tasks.filter((task) => task.assignerId === currentUser.id);
  }, [tasks, currentUser, canReassignAll]);

  const delegatedTasks = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter((task) => task.assignerId === currentUser.id);
  }, [currentUser, tasks]);

  const handleReassign = async () => {
    if (!selectedTaskId || !newOwnerId) return;
    try {
      await updateTask(selectedTaskId, { ownerId: newOwnerId });
      setSelectedTaskId("");
      setNewOwnerId("");
      const newOwner = users.find((user) => user.id === newOwnerId)?.fullName ?? "el nuevo responsable";
      setFeedback({ type: "success", message: `La tarea cambió de responsable a ${newOwner}.` });
    } catch (error) {
      setFeedback({ type: "error", message: "No fue posible reasignar la tarea." });
    }
  };

  return (
    <div className="grid" style={{ gap: "1.25rem" }}>
      <section className="card">
        <h2 className="section-title">Seguimiento de tareas delegadas</h2>
        <p style={{ color: "var(--text-muted)", marginTop: 0 }}>
          {canReassignAll
            ? "Como administrador puedes ver y reasignar cualquier tarea activa."
            : "Filtramos las tareas donde apareces como asignador."}
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>Tarea</th>
              <th>Responsable</th>
              <th>Estado</th>
              <th>Plazo</th>
              <th>Progreso</th>
            </tr>
          </thead>
          <tbody>
            {delegatedTasks.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ color: "var(--text-muted)", textAlign: "center" }}>
                  Aún no delegaste tareas.
                </td>
              </tr>
            ) : (
              delegatedTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{users.find((user) => user.id === task.ownerId)?.fullName}</td>
                  <td>
                    <span className={`status-pill ${task.status}`}>{task.status}</span>
                  </td>
                  <td>{new Date(task.deadline).toLocaleDateString()}</td>
                  <td>{task.progress}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <UseCaseChips cases={["CU7", "CU9", "CU10"]} />
      </section>

      <section className="card">
        <h2 className="section-title">Reasignar tarea</h2>
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
        <div className="form-grid">
          <label className="field">
            <span className="field-label">Tarea</span>
            <select value={selectedTaskId} onChange={(event) => setSelectedTaskId(event.target.value)}>
              <option value="">Selecciona tarea</option>
              {reassignableTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
            <span className="field-hint">Solo se muestran tareas activas.</span>
          </label>
          <label className="field">
            <span className="field-label">Nuevo responsable</span>
            <select value={newOwnerId} onChange={(event) => setNewOwnerId(event.target.value)}>
              <option value="">Selecciona colaborador</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </select>
            <span className="field-hint">Recibirá todas las notificaciones futuras.</span>
          </label>
          <div style={{ alignSelf: "end" }}>
            <button className="btn btn-primary" type="button" onClick={handleReassign} disabled={!selectedTaskId || !newOwnerId}>
              Reasignar
            </button>
          </div>
        </div>
      </section>

      {canReassignAll && (
        <section className="card">
          <h2 className="section-title">Resumen rápido</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {reassignableTasks.slice(0, 5).map((task) => (
              <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <UserAvatar name={users.find((user) => user.id === task.ownerId)?.fullName ?? "Sin responsable"} color={users.find((user) => user.id === task.ownerId)?.avatarColor} size={36} />
                <div>
                  <strong>{task.title}</strong>
                  <div style={{ color: "var(--text-muted)" }}>
                    Responsable: {users.find((user) => user.id === task.ownerId)?.fullName ?? "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
