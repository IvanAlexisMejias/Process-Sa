import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { appRoutes, sectionLabels } from '@/routes/appRoutes';

export const Sidebar = () => {
  const location = useLocation();
  const { currentUser, roles } = useAppContext();

  const currentRole = roles.find((role) => role.id === currentUser?.roleId);

  const groupedRoutes = useMemo(() => {
    if (!currentRole) return [];
    const allowed = appRoutes.filter((route) => route.roles.includes(currentRole.key));
    const map = new Map<string, typeof allowed>();
    allowed.forEach((route) => {
      const section = route.section;
      const current = map.get(section) ?? [];
      current.push(route);
      map.set(section, current);
    });
    return Array.from(map.entries());
  }, [currentRole, location.pathname]);

  return (
    <aside
      style={{
        padding: '2rem 1.75rem',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        background: 'var(--sidebar-bg)',
        minHeight: '100vh',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Process SA</h1>
        <small style={{ color: 'rgba(255,255,255,0.65)' }}>
          Perfil: {currentRole?.name ?? 'Sin rol'}
        </small>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {groupedRoutes.map(([section, routes]) => (
          <div key={section}>
            <p style={{ margin: '0 0 0.35rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>
              {sectionLabels[section as keyof typeof sectionLabels]}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {routes.map((route) => {
                const active = location.pathname === route.path;
                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.85rem',
                      background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                      color: active ? '#fff' : 'rgba(255,255,255,0.85)',
                      display: 'flex',
                      flexDirection: 'column',
                      border: active ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>
                      {route.icon} {route.label}
                    </span>
                    <small style={{ color: 'rgba(255,255,255,0.65)' }}>{route.description}</small>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};
