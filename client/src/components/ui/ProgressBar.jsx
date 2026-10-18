
export default function ProgressBar({
  percent,
  color = "#16a34a",
  size = 8,
  showPercent = false,
  label,
}) {
  const value = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span>{label}</span>}

          {showPercent && (
            <span className="font-semibold">{value}%</span>
          )}
        </div>
      )}

      <div
        className="w-full overflow-hidden rounded-full bg-gray-200"
        style={{ height: `${size}px` }}
        role="progressbar"
        aria-label={label || "Progress"}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
