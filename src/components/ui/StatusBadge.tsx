interface StatusBadgeProps {
  status: 'online' | 'offline' | 'thinking' | 'idle';
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`status-dot ${status}`} />
      <span className="text-xs text-gray-400 font-mono">
        {label || status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}
