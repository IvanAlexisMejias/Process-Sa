import type { RoleDefinition } from '@/types/domain';

export const RoleBadge = ({ role }: { role: RoleDefinition }) => (
  <span
    style={{
      background: 'rgba(37, 99, 235, 0.1)',
      color: '#1d4ed8',
      padding: '0.2rem 0.6rem',
      borderRadius: 999,
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
    }}
  >
    {role.name}
  </span>
);
