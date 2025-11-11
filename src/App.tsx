import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { LoginPage } from '@/pages/auth/LoginPage';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppContext } from '@/context/AppContext';
import { appRoutes } from '@/routes/appRoutes';
import type { RoleKey } from '@/types/domain';

const RoleGuard = ({ roles, children }: { roles: RoleKey[]; children: ReactNode }) => {
  const { currentUser, roles: roleDefinitions } = useAppContext();
  const userRole = roleDefinitions.find((role) => role.id === currentUser?.roleId);

  if (!currentUser || !userRole) return <Navigate to="/" replace />;

  if (!roles.includes(userRole.key)) {
    return <Navigate to="/app/overview" replace />;
  }

  return <>{children}</>;
};

const ProtectedApp = () => {
  const { currentUser } = useAppContext();
  if (!currentUser) return <Navigate to="/" replace />;
  return <AppLayout />;
};

const App = () => {
  const { currentUser } = useAppContext();

  return (
    <Routes>
      <Route
        path="/"
        element={currentUser ? <Navigate to="/app/overview" replace /> : <LoginPage />}
      />
      <Route element={<ProtectedApp />}>
        {appRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<RoleGuard roles={route.roles}>{route.element}</RoleGuard>}
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
