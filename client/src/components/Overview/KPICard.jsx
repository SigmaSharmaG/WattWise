
import ProgressBar from "../ui/ProgressBar";

export default function KPICard({ data }) {
  const {
    title,
    badge,
    icon: Icon,
    value,
    subtitle,
    trend,
    footer,
    secondaryValue,
    progress,
    status,
    description,
    metrics,
    type,
    color
  } = data;

  const TrendIcon = trend?.icon;
  const FooterIcon = footer?.icon;
  const StatusIcon = status?.icon;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
          {title}
        </h3>

        {badge && (
          <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600 dark:bg-red-500/10">
            {badge}
          </span>
        )}

        {Icon && !badge && (
          <Icon size={19} className="text-green-600" />
        )}
      </div>

      {/* Value */}
      <div className="mt-4 flex flex-wrap items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          {value}
        </span>

        {secondaryValue && (
          <span className="text-sm text-gray-500">
            {secondaryValue}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      )}

      {/* Trend */}
      {trend && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          {TrendIcon && (
            <TrendIcon
              size={15}
              className={
                trend.positive
                  ? "text-emerald-500"
                  : "text-orange-500"
              }
            />
          )}

          <span
            className={
              trend.positive
                ? "font-semibold text-emerald-600"
                : "font-semibold text-orange-600"
            }
          >
            {trend.value}
          </span>

          <span className="text-gray-500">
            {trend.description}
          </span>
        </div>
      )}

      {/* Power footer */}
      {footer && (
        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800">
          {FooterIcon && <FooterIcon size={15} />}
          {footer.text}
        </div>
      )}

      {/* Cost progress */}
      {type === "cost" && (
        <div className="mt-4 space-y-3">
          <ProgressBar
            percent={progress}
            color="#16a34a"
            size={7}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              {StatusIcon && <StatusIcon size={15} />}
              {status.text} ({progress}%)
            </span>

            <span className="text-gray-500">
              {status.description}
            </span>
          </div>
        </div>
      )}

      {/* Savings metrics */}
      {type === "savings" && (
        <>
          <p className="mt-1 text-xs text-gray-500">
            {description}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
            {metrics.map((metric) => {
              const MetricIcon = metric.icon;

              return (
                <div key={metric.label} className="min-w-0 flex items-center">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <MetricIcon size={16} />
                    <span className="text-sm font-bold">
                      {metric.value}
                    </span>

                    <p className=" text-xs text-gray-500">
                    {metric.label}
                  </p>
                  </div>

                  
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
