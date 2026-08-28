export function Stamp({
  value,
  label,
  size = 'md',
  color = 'forest',
}: {
  value: string | number;
  label?: string;
  size?: 'sm' | 'md';
  color?: 'forest' | 'gold' | 'brick';
}) {
  const colorClass = color === 'gold' ? 'text-gold' : color === 'brick' ? 'text-brick' : 'text-forest';
  return (
    <div className={`stamp ${size === 'sm' ? 'stamp-sm' : ''} ${colorClass}`}>
      <div className="flex flex-col items-center leading-none">
        <span className={size === 'sm' ? 'text-xs' : 'text-lg'}>{value}</span>
        {label && <span className="text-[8px] tracking-wide uppercase mt-0.5">{label}</span>}
      </div>
    </div>
  );
}

export function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="progress-track w-full">
      <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }} />
    </div>
  );
}
