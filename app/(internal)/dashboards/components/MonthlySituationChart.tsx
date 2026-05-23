"use client";

import { Info, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  dashboardMock,
  monthlyBalancePercent,
  monthlyFlowChartConfig,
  monthlyFlowChartData,
  monthlyProjectionsWithProgress,
} from "../data/dashboard.mock";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const MonthlySituationChart = () => {
  const { monthlySituation } = dashboardMock;

  return (
    <Card className="dashboard-monthly-card">
      <CardHeader className="dashboard-monthly-card__header">
        <div className="dashboard-monthly-card__heading">
          <CardTitle className="dashboard-monthly-card__title">
            {monthlySituation.title}
          </CardTitle>
          <span className="dashboard-monthly-card__badge">
            {monthlySituation.activeContracts}{" "}
            {monthlySituation.activeContractsLabel}
          </span>
        </div>
      </CardHeader>

      <CardContent className="dashboard-monthly-card__content">
        <div className="dashboard-monthly-card__grid">
          <div className="dashboard-monthly-card__projections">
            {monthlyProjectionsWithProgress.map((projection) => (
              <article
                key={projection.id}
                className="dashboard-projection"
              >
                <div className="dashboard-projection__head">
                  <div className="dashboard-projection__label-wrap">
                    <p className="dashboard-projection__label">
                      {projection.label}
                    </p>
                    <Info
                      size={15}
                      className="dashboard-projection__info"
                      aria-hidden
                    />
                  </div>
                  <div className="dashboard-projection__meta">
                    <span
                      className="dashboard-projection__percent"
                      style={{ color: projection.colorHex }}
                    >
                      {projection.progress}%
                    </span>
                    <strong className="dashboard-projection__amount">
                      {projection.formattedAmount}
                    </strong>
                  </div>
                </div>
                <div className="dashboard-projection__track">
                  <span
                    className="dashboard-projection__fill"
                    style={{
                      width: `${projection.progress}%`,
                      backgroundColor: projection.colorHex,
                    }}
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="dashboard-monthly-card__chart-panel">
            <p className="dashboard-monthly-card__chart-title">
              Comparativo do fluxo
            </p>
            <ChartContainer
              config={monthlyFlowChartConfig}
              className="dashboard-monthly-card__chart"
              style={{ minHeight: 220, minWidth: 0 }}
            >
              <BarChart
                accessibilityLayer
                data={monthlyFlowChartData}
                margin={{ top: 20, right: 8, left: 0, bottom: 8 }}
                barCategoryGap="28%"
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="4 4"
                  stroke="rgba(8, 8, 12, 0.08)"
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "rgba(8, 8, 12, 0.55)", fontSize: 12 }}
                />
                <YAxis
                  hide
                  domain={[0, "dataMax"]}
                  tickFormatter={(value) =>
                    `${Math.round(Number(value) / 1000)}k`
                  }
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(8, 8, 12, 0.04)" }}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={72}>
                  {monthlyFlowChartData.map((entry) => (
                    <Cell key={entry.id} fill={entry.fill} />
                  ))}
                  <LabelList
                    dataKey="amount"
                    position="top"
                    formatter={(value) =>
                      formatCurrency(Number(value))
                    }
                    className="fill-[#08080C] text-[11px] font-semibold"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="dashboard-monthly-card__balance">
          <div className="dashboard-monthly-card__balance-icon">
            <TrendingUp size={22} strokeWidth={2} />
          </div>
          <div className="dashboard-monthly-card__balance-copy">
            <p className="dashboard-monthly-card__balance-label">
              {monthlySituation.balanceLabel}
            </p>
            <p className="dashboard-monthly-card__balance-value">
              {monthlySituation.balanceFormatted}
            </p>
          </div>
          <span className="dashboard-monthly-card__balance-tag">
            +{monthlyBalancePercent}% sobre recebimentos
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlySituationChart;
