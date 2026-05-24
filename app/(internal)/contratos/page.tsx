"use client";

import { markContratoCriarEntry } from "@/lib/contratos/wizard/draft";
import {
  mockContratos,
  type Contrato,
  type ContratoStatus,
} from "@/lib/mocks/contratos";
import {
  ArrowDownUp,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  Plus,
  Search,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import "./style.css";

const statusLabel: Record<ContratoStatus, string> = {
  ativo: "Ativo",
  rescindido: "Rescindido",
  pendente: "Pendente",
};

type StatusFilter = "todos" | ContratoStatus;

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR");
}

export default function ContratosPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");

  const stats = useMemo(() => {
    const ativos = mockContratos.filter((c) => c.status === "ativo");
    const receitaAtiva = ativos.reduce((sum, c) => sum + c.valorMensal, 0);

    return {
      total: mockContratos.length,
      ativo: ativos.length,
      pendente: mockContratos.filter((c) => c.status === "pendente").length,
      rescindido: mockContratos.filter((c) => c.status === "rescindido").length,
      receitaAtiva,
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return mockContratos.filter((c) => {
      if (statusFilter !== "todos" && c.status !== statusFilter) return false;
      if (!q) return true;

      return (
        c.codigo.toLowerCase().includes(q) ||
        c.imovelTitulo.toLowerCase().includes(q) ||
        c.imovelBairro.toLowerCase().includes(q) ||
        c.inquilino.toLowerCase().includes(q) ||
        c.proprietario.toLowerCase().includes(q)
      );
    });
  }, [search, statusFilter]);

  return (
    <div className="contratos-page">
      <header className="contratos-hero">
        <div className="contratos-hero-text">
          <p className="contratos-page-desc">
            Acompanhe o status, valores e prazos de todos os contratos ativos da
            sua carteira.
          </p>
        </div>
        <div className="contratos-hero-actions">
          <button type="button" className="contratos-btn-outline">
            <Download size={18} />
            Exportar
          </button>
          <button
            type="button"
            className="contratos-btn-primary"
            onClick={() => {
              markContratoCriarEntry();
              router.push("/contratos/criar");
            }}
          >
            <Plus size={18} />
            Novo contrato
          </button>
        </div>
      </header>

      <div className="contratos-stats">
        <article className="contratos-stat-card">
          <div className="contratos-stat-icon contratos-stat-icon--info">
            <FileText size={22} />
          </div>
          <div>
            <p className="contratos-stat-label">Total de contratos</p>
            <p className="contratos-stat-value">{stats.total}</p>
            <p className="contratos-stat-hint">Carteira completa</p>
          </div>
        </article>
        <article className="contratos-stat-card">
          <div className="contratos-stat-icon contratos-stat-icon--success">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="contratos-stat-label">Ativos</p>
            <p className="contratos-stat-value contratos-stat-value--success">
              {stats.ativo}
            </p>
            <p className="contratos-stat-hint">
              Receita {formatCurrency(stats.receitaAtiva)}/mês
            </p>
          </div>
        </article>
        <article className="contratos-stat-card">
          <div className="contratos-stat-icon contratos-stat-icon--warning">
            <Clock size={22} />
          </div>
          <div>
            <p className="contratos-stat-label">Pendentes</p>
            <p className="contratos-stat-value contratos-stat-value--warning">
              {stats.pendente}
            </p>
            <p className="contratos-stat-hint">Aguardando assinatura</p>
          </div>
        </article>
        <article className="contratos-stat-card">
          <div className="contratos-stat-icon contratos-stat-icon--danger">
            <XCircle size={22} />
          </div>
          <div>
            <p className="contratos-stat-label">Rescindidos</p>
            <p className="contratos-stat-value contratos-stat-value--danger">
              {stats.rescindido}
            </p>
            <p className="contratos-stat-hint">Encerrados</p>
          </div>
        </article>
      </div>

      <section className="contratos-panel">
        <div className="contratos-toolbar">
          <div className="contratos-tabs" role="tablist" aria-label="Status">
            {(
              [
                ["todos", "Todos"],
                ["ativo", "Ativos"],
                ["pendente", "Pendentes"],
                ["rescindido", "Rescindidos"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={statusFilter === key}
                className={`contratos-tab${statusFilter === key ? " contratos-tab--active" : ""}`}
                onClick={() => setStatusFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="contratos-toolbar-right">
            <label className="contratos-search-wrap">
              <Search size={18} className="contratos-search-icon" aria-hidden />
              <input
                type="search"
                className="contratos-search"
                placeholder="Buscar contrato, imóvel ou pessoa…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="contratos-btn-outline contratos-btn-filter"
            >
              <Filter size={18} />
              Filtros
            </button>
          </div>
        </div>

        <div className="contratos-table-wrap">
          <table className="contratos-table">
            <thead>
              <tr>
                <th>
                  Código <ArrowDownUp size={14} />
                </th>
                <th>
                  Imóvel <ArrowDownUp size={14} />
                </th>
                <th>
                  Inquilino <ArrowDownUp size={14} />
                </th>
                <th>
                  Proprietário <ArrowDownUp size={14} />
                </th>
                <th>
                  Valor <ArrowDownUp size={14} />
                </th>
                <th>
                  Vigência <ArrowDownUp size={14} />
                </th>
                <th className="contratos-col-status">
                  <span className="contratos-col-status-head">
                    Status
                    <ArrowDownUp size={14} aria-hidden />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="contratos-empty">
                    Nenhum contrato encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((contrato: Contrato) => (
                  <tr key={contrato.id}>
                    <td>
                      <button type="button" className="contratos-code">
                        {contrato.codigo}
                      </button>
                    </td>
                    <td>
                      <div className="contratos-imovel">
                        <span className="contratos-imovel-icon">
                          <Building2 size={16} />
                        </span>
                        <span>
                          <span className="contratos-imovel-titulo">
                            {contrato.imovelTitulo}
                          </span>
                          <span className="contratos-imovel-bairro">
                            {contrato.imovelBairro}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td>{contrato.inquilino}</td>
                    <td>{contrato.proprietario}</td>
                    <td className="contratos-valor">
                      {formatCurrency(contrato.valorMensal)}
                    </td>
                    <td>
                      <div className="contratos-vigencia">
                        <span>{formatDate(contrato.inicio)}</span>
                        <span className="contratos-vigencia-sep">até</span>
                        <span>
                          {contrato.fim ? formatDate(contrato.fim) : "—"}
                        </span>
                      </div>
                    </td>
                    <td className="contratos-col-status">
                      <span
                        className={`contratos-badge contratos-badge--${contrato.status}`}
                      >
                        {statusLabel[contrato.status]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="contratos-footer">
          <p className="contratos-footer-count">
            <TrendingUp size={16} className="contratos-footer-icon" />
            {filtered.length === mockContratos.length
              ? `${mockContratos.length} contratos`
              : `Mostrando ${filtered.length} de ${mockContratos.length} contratos`}
          </p>
        </footer>
      </section>
    </div>
  );
}
