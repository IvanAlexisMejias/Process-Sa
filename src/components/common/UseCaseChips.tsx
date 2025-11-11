interface UseCaseChipsProps {
  cases: string[];
}

export const UseCaseChips = ({ cases }: UseCaseChipsProps) => (
  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
    {cases.map((cu) => (
      <span
        key={cu}
        style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          padding: '0.2rem 0.6rem',
          borderRadius: '999px',
          background: 'var(--brand-soft)',
          color: '#1e3a8a',
        }}
      >
        {cu}
      </span>
    ))}
  </div>
);
