import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { trafficLight } from '@/utils/dates';
import { UseCaseChips } from '@/components/common/UseCaseChips';

export const OverviewPage = () => {
  const { tasks, flowInstances, notifications, metrics } = useAppContext();

  const summary = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const delayed = tasks.filter(
      (task) => new Date(task.deadline) < new Date() && task.status !== 'completed',
    ).length;
    const atRisk = tasks.filter((task) => task.status === 'blocked').length;
    return { completed, delayed, atRisk };
  }, [tasks]);

  return (
    <div className="grid" style={{ paddingBottom: '2rem', gap: '1.25rem' }}>
      <section className="card">
        <h2 className="section-title">Radar operativo</h2>
        <div className="grid three">
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Tareas terminadas</p>
            <strong style={{ fontSize: '2rem' }}>{summary.completed}</strong>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Tareas retrasadas</p>
            <strong style={{ fontSize: '2rem', color: 'var(--danger)' }}>{summary.delayed}</strong>
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Bloqueadas</p>
            <strong style={{ fontSize: '2rem', color: 'var(--warning)' }}>{summary.atRisk}</strong>
          </div>
        </div>
        <UseCaseChips cases={['CU8', 'CU13', 'CU17', 'CU18']} />
      </section>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="section-title">Flujos activos (Diseñador / Administrador)</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {flowInstances.length} ejecuciones
          </span>
        </div>
        <div className="grid two">
          {flowInstances.map((instance) => {
            const stageEntries =
              instance.stageStatuses?.length && instance.stageStatuses.length > 0
                ? instance.stageStatuses.map((stage) => ({
                    id: stage.id,
                    status: stage.status,
                    progress: stage.progress,
                  }))
                : instance.stageStatus
                  ? Object.entries(instance.stageStatus).map(([id, stage]) => ({
                      id,
                      status: stage.status,
                      progress: stage.progress,
                    }))
                  : [];
            return (
              <article
                key={instance.id}
                style={{
                  border: '1px solid var(--border-soft)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem',
                }}
              >
                <strong>{instance.name}</strong>
                <p style={{ margin: '0.35rem 0', color: 'var(--text-muted)' }}>
                  Avance {instance.progress}% · Salud {instance.health}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {stageEntries.map((stage) => (
                    <span key={stage.id} className={`status-pill ${stage.status}`}>
                      {stage.status} {stage.progress}%
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
        <UseCaseChips cases={['CU5', 'CU19']} />
      </section>

      <section className="card">
        <h2 className="section-title">Semáforo de tareas en ejecución</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {tasks.slice(0, 6).map((task) => (
            <div
              key={task.id}
              style={{
                minWidth: '220px',
                borderRadius: 'var(--radius)',
                padding: '0.85rem',
                border: '1px dashed var(--border-soft)',
              }}
            >
              <small style={{ color: 'var(--text-muted)' }}>{task.title}</small>
              <div
                style={{
                  marginTop: '0.4rem',
                  fontWeight: 600,
                  color:
                    trafficLight(task.deadline, task.status) === 'red'
                      ? 'var(--danger)'
                      : trafficLight(task.deadline, task.status) === 'yellow'
                        ? 'var(--warning)'
                        : 'var(--success)',
                }}
              >
                Semáforo {trafficLight(task.deadline, task.status)}
              </div>
            </div>
          ))}
        </div>
        <UseCaseChips cases={['CU13', 'CU15']} />
      </section>

      <section className="card">
        <h2 className="section-title">Tendencia de rendimiento</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {metrics.map((metric) => (
            <div key={metric.date} style={{ flex: 1 }}>
              <small style={{ color: 'var(--text-muted)' }}>
                {new Date(metric.date).toLocaleDateString()}
              </small>
              <div
                style={{
                  height: '120px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--bg-muted)',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  gap: '0.15rem',
                }}
              >
                <div
                  style={{
                    height: `${metric.completed}px`,
                    background: 'var(--success)',
                    borderRadius: '999px',
                  }}
                />
                <div
                  style={{
                    height: `${metric.delayed * 2}px`,
                    background: 'var(--warning)',
                    borderRadius: '999px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Alertas generadas</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-soft)',
                paddingBottom: '0.75rem',
              }}
            >
              <span>{notification.message}</span>
              <small style={{ color: 'var(--text-muted)' }}>
                {new Date(notification.createdAt).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
        <UseCaseChips cases={['CU13', 'CU18']} />
      </section>
    </div>
  );
};
