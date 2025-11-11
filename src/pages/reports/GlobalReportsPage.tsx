import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { UseCaseChips } from '@/components/common/UseCaseChips';

export const GlobalReportsPage = () => {
  const { tasks, workload, units, users } = useAppContext();

  const perUnit = useMemo(() => {
    return units.map((unit) => {
      const people = users.filter((user) => user.unitId === unit.id);
      const unitTasks = tasks.filter((task) => people.some((person) => person.id === task.ownerId));
      const completed = unitTasks.filter((task) => task.status === 'completed').length;
      if (unitTasks.length === 0) {
        return { unit, completion: 0 };
      }
      return {
        unit,
        completion: Math.round((completed / unitTasks.length) * 100),
      };
    });
  }, [tasks, units, users]);

  return (
    <div className="grid" style={{ gap: '1.25rem' }}>
      <section className="card">
        <h2 className="section-title">Carga de trabajo por persona</h2>
        <div className="grid two">
          {workload.map((item) => {
            const user = users.find((candidate) => candidate.id === item.userId);
            const capacity = Math.max(item.capacity || 1, 1);
            const utilization = Math.min((item.inProgress / capacity) * 100, 100);
            return (
              <article
                key={`workload-${item.userId}`}
                style={{ border: '1px solid var(--border-soft)', borderRadius: 'var(--radius)', padding: '1rem' }}
              >
                <strong>{user?.fullName ?? item.userId}</strong>
                <p style={{ color: 'var(--text-muted)' }}>
                  {item.assigned} asignadas · {item.inProgress} en curso · {item.overdue} atrasadas
                </p>
                <div
                  style={{
                    height: '8px',
                    borderRadius: '999px',
                    background: 'var(--bg-muted)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${utilization}%`,
                      height: '100%',
                      background: 'var(--brand)',
                    }}
                  />
                </div>
              </article>
            );
          })}
        </div>
        <UseCaseChips cases={['CU17', 'CU18']} />
      </section>

      <section className="card">
        <h2 className="section-title">Avance por unidad interna</h2>
        <div className="grid two">
          {perUnit.map((row) => (
            <div key={`unit-${row.unit.id}`}>
              <strong>{row.unit.name}</strong>
              <div
                style={{
                  height: '14px',
                  borderRadius: '999px',
                  background: 'var(--bg-muted)',
                  margin: '0.35rem 0',
                }}
              >
                <div
                  style={{
                    width: `${row.completion}%`,
                    height: '100%',
                    borderRadius: '999px',
                    background: 'var(--success)',
                  }}
                />
              </div>
              <small style={{ color: 'var(--text-muted)' }}>{row.completion}% completado</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
