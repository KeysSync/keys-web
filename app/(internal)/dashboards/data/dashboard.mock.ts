import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  CalendarX,
  FileCheck,
  FileEdit,
  FileMinus,
  FileSignature,
  FileX,
  HandCoins,
  Home,
  Receipt,
  Send,
  ShieldCheck,
} from "lucide-react";

export const dashboardColors = {
  black: "#08080C",
  purple: "#972DC8",
  white: "#F2F6FA",
  info: "#0962D7",
  success: "#09D766",
  warning: "#FFC600",
  danger: "#FE5448",
  receivableDark: "#0F8A5F",
  receivableMonth: "#0B6B4C",
} as const;

export type DashboardColorKey = keyof typeof dashboardColors;

export const getColorAlpha = (color: string, alpha: number) => {
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export type KpiMetric = {
  id: string;
  title: string;
  value: string;
  color: DashboardColorKey;
  icon: LucideIcon;
};

export type FinanceMetric = {
  id: string;
  title: string;
  value: string;
  backgroundColor: string;
  icon: LucideIcon;
};

export type MonthlyProjectionBar = {
  id: string;
  label: string;
  amount: number;
  formattedAmount: string;
  color: DashboardColorKey;
};

export const dashboardMock = {
  page: {
    title: "Dashboard",
    subtitle: "Visão consolidada de contratos, cobranças e fluxo financeiro do período.",
  },

  sections: {
    kpi: "Indicadores operacionais",
    finance: "Resumo financeiro",
    monthly: "Situação do mês",
  },

  kpiMetrics: [
    {
      id: "total-contracts",
      title: "Total de Contratos",
      value: "118",
      color: "success",
      icon: FileCheck,
    },
    {
      id: "contracts-to-adjust",
      title: "Contratos para Reajustar",
      value: "52",
      color: "info",
      icon: FileEdit,
    },
    {
      id: "contracts-to-adjust-month",
      title: "Contratos para Reajustar este mês",
      value: "7",
      color: "purple",
      icon: FileEdit,
    },
    {
      id: "contracts-to-renew",
      title: "Contratos para Renovar",
      value: "1",
      color: "danger",
      icon: FileSignature,
    },
    {
      id: "fire-insurance-renew",
      title: "Seguro contra incêndio (renovar)",
      value: "5",
      color: "warning",
      icon: ShieldCheck,
    },
    {
      id: "guarantee-insurance-renew",
      title: "Seguro fiança (renovar)",
      value: "3",
      color: "warning",
      icon: Home,
    },
    {
      id: "period-slips",
      title: "Boletos do período",
      value: "0 / 97",
      color: "info",
      icon: Receipt,
    },
    {
      id: "rejected-slips",
      title: "Boletos rejeitados",
      value: "0",
      color: "danger",
      icon: FileX,
    },
    {
      id: "write-off-before-issue",
      title: "Baixa antes da emissão",
      value: "0",
      color: "success",
      icon: FileMinus,
    },
    {
      id: "pending-send",
      title: "Envio pendente",
      value: "0",
      color: "success",
      icon: Send,
    },
  ] satisfies KpiMetric[],

  financeMetrics: [
    {
      id: "receivable-overdue",
      title: "Contas a receber em atraso",
      value: "R$ 963.511,84",
      backgroundColor: dashboardColors.receivableDark,
      icon: CalendarX,
    },
    {
      id: "receivable-open-month",
      title: "Contas a receber em aberto para este mês",
      value: "R$ 37.491,70",
      backgroundColor: dashboardColors.receivableMonth,
      icon: HandCoins,
    },
    {
      id: "payable-open-month",
      title: "Contas a pagar em aberto para este mês",
      value: "R$ 10.286,50",
      backgroundColor: dashboardColors.warning,
      icon: HandCoins,
    },
    {
      id: "payable-overdue",
      title: "Contas a pagar em atraso",
      value: "R$ 1.090.098,93",
      backgroundColor: dashboardColors.danger,
      icon: CalendarClock,
    },
  ] satisfies FinanceMetric[],

  monthlySituation: {
    title: "Situação no mês atual",
    activeContracts: 116,
    activeContractsLabel: "contratos vigentes",
    projections: [
      {
        id: "income",
        label: "Projeção de recebimentos",
        amount: 412965.22,
        formattedAmount: "R$ 412.965,22",
        color: "success",
      },
      {
        id: "expense",
        label: "Projeção de pagamentos",
        amount: 352114.93,
        formattedAmount: "R$ 352.114,93",
        color: "danger",
      },
    ] satisfies MonthlyProjectionBar[],
    balanceLabel: "Projeção de saldo até o final do mês",
    balanceAmount: 60850.29,
    balanceFormatted: "R$ 60.850,29",
  },
} as const;

const { projections } = dashboardMock.monthlySituation;
const maxProjection = Math.max(...projections.map((item) => item.amount));

export const monthlyProjectionsWithProgress = projections.map((item) => ({
  ...item,
  colorHex: dashboardColors[item.color],
  progress: Math.round((item.amount / maxProjection) * 100),
}));

export const monthlyFlowChartData = projections.map((item) => ({
  id: item.id,
  name: item.label.replace("Projeção de ", ""),
  amount: item.amount,
  fill: dashboardColors[item.color],
}));

export const monthlyFlowChartConfig = {
  amount: { label: "Valor" },
  income: {
    label: "Recebimentos",
    color: dashboardColors.success,
  },
  expense: {
    label: "Pagamentos",
    color: dashboardColors.danger,
  },
} satisfies Record<string, { label: string; color?: string }>;

export const monthlyBalancePercent = Math.round(
  (dashboardMock.monthlySituation.balanceAmount /
    dashboardMock.monthlySituation.projections[0].amount) *
    100
);
