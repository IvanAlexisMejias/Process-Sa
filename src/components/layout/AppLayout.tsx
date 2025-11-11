import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

export const AppLayout = () => (
  <div className="app-shell">
    <Sidebar />
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-muted)' }}>
      <TopBar />
      <main style={{ padding: '1.5rem', flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  </div>
);
