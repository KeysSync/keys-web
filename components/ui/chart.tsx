"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, item]) => item.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(config)
          .filter(([, item]) => item.color)
          .map(
            ([key, item]) =>
              `[data-chart=${id}] .color-${key} { color: ${item.color}; } [data-chart=${id}] .fill-${key} { fill: ${item.color}; }`
          )
          .join("\n"),
      }}
    />
  );
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "[&_.recharts-cartesian-grid_line]:stroke-[#E0E0E0]/60 [&_.recharts-layer]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    active?: boolean;
    payload?: Array<{
      name?: string;
      value?: number;
      dataKey?: string;
      color?: string;
      payload?: { fill?: string };
    }>;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
    label?: string;
    labelFormatter?: (
      label: unknown,
      payload: Array<{
        name?: string;
        value?: number;
        dataKey?: string;
      }>
    ) => React.ReactNode;
    labelClassName?: string;
    formatter?: (
      value: unknown,
      name: unknown,
      item: unknown,
      index: number,
      payload: unknown
    ) => React.ReactNode;
    color?: string;
  }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
      const itemConfig = config[key as keyof typeof config];

      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter
            ? labelFormatter(label, payload)
            : itemConfig?.label || item?.name}
        </div>
      );
    }, [
      config,
      hideLabel,
      label,
      labelClassName,
      labelFormatter,
      labelKey,
      payload,
    ]);

    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] gap-1.5 rounded-lg border border-[#E0E0E0] bg-white px-2.5 py-1.5 text-xs shadow-md",
          className
        )}
      >
        {!hideLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = config[key as keyof typeof config];
            const indicatorColor = color || item.payload?.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full items-center gap-2",
                  indicator === "dot" && "items-center"
                )}
              >
                {!hideIndicator ? (
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: indicatorColor }}
                  />
                ) : null}
                <div className="flex flex-1 justify-between gap-4 leading-none">
                  <span className="text-[#08080C]/70">
                    {itemConfig?.label || item.name}
                  </span>
                  <span className="font-mono font-medium text-[#08080C]">
                    {formatter
                      ? formatter(item.value, item.name, item, index, item.payload)
                      : item.value?.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
};
