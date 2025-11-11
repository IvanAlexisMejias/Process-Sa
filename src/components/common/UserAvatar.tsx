interface UserAvatarProps {
  name: string;
  color?: string | null;
  size?: number;
}

const fallbackPalette = ['#0052cc', '#36b37e', '#ff5630', '#6554c0', '#ff991f'];

const initialsFromName = (name: string) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

export const UserAvatar = ({ name, color, size = 40 }: UserAvatarProps) => {
  const initials = initialsFromName(name);
  const paletteIndex = Math.abs(initials.charCodeAt(0)) % fallbackPalette.length;
  const background = color && color.trim() ? color : fallbackPalette[paletteIndex];

  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        letterSpacing: 0.5,
      }}
    >
      {initials}
    </div>
  );
};
