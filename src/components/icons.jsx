/* eslint-disable react-refresh/only-export-components */
function Icon({ children, size = 16, stroke = 1.7, fill = 'none', className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const Icons = {
  search: (p) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>,
  plus: (p) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>,
  edit: (p) => <Icon {...p}><path d="M4 20h4l10-10-4-4L4 16v4Z" /><path d="m13.5 6.5 4 4" /></Icon>,
  trash: (p) => (
    <Icon {...p}>
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </Icon>
  ),
  chevDown: (p) => <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>,
  chevLeft: (p) => <Icon {...p}><path d="m15 18-6-6 6-6" /></Icon>,
  chevRight: (p) => <Icon {...p}><path d="m9 18 6-6-6-6" /></Icon>,
  arrowLeft: (p) => <Icon {...p}><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></Icon>,
  arrowRight: (p) => <Icon {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>,
  close: (p) => <Icon {...p}><path d="M18 6 6 18M6 6l12 12" /></Icon>,
  check: (p) => <Icon {...p}><path d="m5 12 5 5L20 7" /></Icon>,
  eye: (p) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Icon>,
  eyeOff: (p) => (
    <Icon {...p}>
      <path d="M2 2l20 20" />
      <path d="M6.7 6.7C4 8.5 2 12 2 12s3.5 7 10 7c2 0 3.7-.6 5.2-1.5" />
      <path d="M9.9 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7-.7 1.3-1.6 2.5-2.6 3.6" />
      <path d="M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.1-.9" />
    </Icon>
  ),
  logout: (p) => (
    <Icon {...p}>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 17l-5-5 5-5" />
      <path d="M15 12H5" />
    </Icon>
  ),
  box: (p) => (
    <Icon {...p}>
      <path d="m3 7 9-4 9 4-9 4-9-4Z" />
      <path d="M3 7v10l9 4 9-4V7" />
      <path d="m3 7 9 4 9-4" />
      <path d="M12 11v10" />
    </Icon>
  ),
  grid: (p) => (
    <Icon {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </Icon>
  ),
  list: (p) => (
    <Icon {...p}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="4" cy="6" r="1" fill="currentColor" />
      <circle cx="4" cy="12" r="1" fill="currentColor" />
      <circle cx="4" cy="18" r="1" fill="currentColor" />
    </Icon>
  ),
  alert: (p) => (
    <Icon {...p}>
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.3 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z" />
    </Icon>
  ),
  sort: (p) => (
    <Icon {...p}>
      <path d="M7 4v16" />
      <path d="m3 8 4-4 4 4" />
      <path d="M17 20V4" />
      <path d="m13 16 4 4 4-4" />
    </Icon>
  ),
  dashboard: (p) => (
    <Icon {...p}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </Icon>
  ),
  team: (p) => (
    <Icon {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 21a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 21a5 5 0 0 1 6-4.5" />
    </Icon>
  ),
  bell: (p) => (
    <Icon {...p}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4 2 5 2 7H4c0-2 2-3 2-7Z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </Icon>
  ),
  settings: (p) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </Icon>
  ),
  briefcase: (p) => (
    <Icon {...p}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </Icon>
  ),
  help: (p) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
      <path d="M12 17h.01" />
    </Icon>
  ),
  filter: (p) => <Icon {...p}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5Z" /></Icon>,
};

export { default as Spinner } from './Spinner';
