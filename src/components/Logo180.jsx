export default function Logo180({ size = 28, light = false }) {
  const fg = light ? '#FFFFFF' : 'var(--color-ink-950)';
  const accent = light ? 'var(--color-brand-500)' : 'var(--color-brand-700)';

  const markStyle = {
    width: size + 6,
    height: size + 6,
    flexShrink: 0,
    borderRadius: Math.round((size + 6) * 0.22),
    background: '#0A0B0A url(/assets/logo-180dc.jpg) no-repeat',
    backgroundSize: 'auto 240%',
    backgroundPosition: '50% 18%',
    boxShadow: light
      ? '0 0 0 1px rgba(255,255,255,0.06)'
      : '0 1px 2px rgba(10,11,10,0.08), 0 0 0 1px rgba(10,11,10,0.05)',
  };

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        style={markStyle}
        aria-label="180 Degrees Consulting UNAIR"
        role="img"
      />
      <span className="inline-flex flex-col leading-none">
        <span
          style={{ fontSize: size * 0.55, color: fg }}
          className="font-semibold tracking-tight"
        >
          180<span className="font-normal">Degrees</span>
        </span>
        <span
          className="font-mono mt-1"
          style={{
            fontSize: size * 0.32,
            color: accent,
            letterSpacing: '0.15em',
          }}
        >
          CONSULTING · UNAIR
        </span>
      </span>
    </span>
  );
}
