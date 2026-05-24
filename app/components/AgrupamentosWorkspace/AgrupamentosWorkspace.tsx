"use client";

import {
  buildGrupoFieldsFromDraft,
  createEmptyGrupoDraft,
  createGrupoId,
  DEFAULT_ANUNCIO_EXEMPLO,
  isGrupoBorderVisible,
  isGrupoIcon,
  type AnuncioExemplo,
  type Grupo,
} from "@/lib/dashboards/agrupamentos/types";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AnuncioForm } from "./AnuncioForm";
import { AnuncioPreview } from "./AnuncioPreview";
import { GrupoForm, grupoToFormValues, type GrupoFormValues } from "./GrupoForm";
import { GrupoVisual } from "./GrupoVisual";

const INITIAL_GRUPOS: Grupo[] = [
  {
    id: "grupo-emccamp",
    nome: "Emccamp",
    visualType: "image",
    visualValue: "https://raichu-uploads.s3.amazonaws.com/logo_emccamp-residencial_BVJTev.png",
    corFundo: "#FFFFFF",
    corIcone: "#000000",
    corTexto: "#6c6d6f",
    corBorda: "#96c43e",
  },
  {
    id: "grupo-garotas-palhaco",
    nome: "Garotas Palhaço",
    visualType: "image",
    visualValue: "https://i.pinimg.com/736x/f5/5e/3b/f55e3b8ce2d6156a016cfea264af884a.jpg",
    corFundo: "#FFE5FB",
    corIcone: "#08080C",
    corTexto: "#56206A",
    corBorda: "#B847A7",
  },
];

export function AgrupamentosWorkspace() {
  const [grupos, setGrupos] = useState<Grupo[]>(INITIAL_GRUPOS);
  const [createDraft, setCreateDraft] = useState<GrupoFormValues>(createEmptyGrupoDraft);
  const [editingGrupoId, setEditingGrupoId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<GrupoFormValues>(createEmptyGrupoDraft);
  const [selectedGrupoIds, setSelectedGrupoIds] = useState<Set<string>>(
    () => new Set(["grupo-pet"]),
  );
  const [anuncio, setAnuncio] = useState<AnuncioExemplo>(DEFAULT_ANUNCIO_EXEMPLO);
  const [anuncioDraft, setAnuncioDraft] = useState<AnuncioExemplo>(DEFAULT_ANUNCIO_EXEMPLO);
  const [editingAnuncio, setEditingAnuncio] = useState(false);

  const editingGrupo = useMemo(
    () => grupos.find((g) => g.id === editingGrupoId) ?? null,
    [grupos, editingGrupoId],
  );

  const gruposSelecionados = useMemo(
    () => grupos.filter((g) => selectedGrupoIds.has(g.id)),
    [grupos, selectedGrupoIds],
  );

  function handleCreateGrupo() {
    const nome = createDraft.nome.trim();
    if (!nome) return;

    const novo: Grupo = {
      id: createGrupoId(),
      ...buildGrupoFieldsFromDraft(createDraft),
    };

    setGrupos((prev) => [...prev, novo]);
    setCreateDraft(createEmptyGrupoDraft());
  }

  function handleSaveEditGrupo() {
    if (!editingGrupoId) return;
    const nome = editDraft.nome.trim();
    if (!nome) return;

    setGrupos((prev) =>
      prev.map((g) =>
        g.id === editingGrupoId
          ? { ...g, ...buildGrupoFieldsFromDraft(editDraft) }
          : g,
      ),
    );
    setEditingGrupoId(null);
  }

  function handleDeleteGrupo(id: string) {
    setGrupos((prev) => prev.filter((g) => g.id !== id));
    setSelectedGrupoIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (editingGrupoId === id) setEditingGrupoId(null);
  }

  function openEditGrupo(grupo: Grupo) {
    setEditingGrupoId(grupo.id);
    setEditDraft(grupoToFormValues(grupo));
  }

  function toggleGrupoSelection(id: string) {
    setSelectedGrupoIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openEditAnuncio() {
    setAnuncioDraft(anuncio);
    setEditingAnuncio(true);
  }

  function handleSaveAnuncio() {
    setAnuncio(anuncioDraft);
    setEditingAnuncio(false);
  }

  return (
    <div className="agrupamentos-page">
      <section className="agrupamentos-col agrupamentos-col--create">
        <GrupoForm
          title="Novo Grupo"
          hint="Pré-visualização do chip em tempo real."
          submitLabel="Criar grupo"
          values={createDraft}
          onChange={setCreateDraft}
          onSubmit={handleCreateGrupo}
        />
      </section>

      <section className="agrupamentos-col agrupamentos-col--list">
        {editingGrupo ? (
          <GrupoForm
            title={`Editar: ${editingGrupo.nome}`}
            hint="Altere as opções do grupo abaixo."
            submitLabel="Salvar alterações"
            values={editDraft}
            onChange={setEditDraft}
            onSubmit={handleSaveEditGrupo}
            onCancel={() => setEditingGrupoId(null)}
          />
        ) : (
          <div className="agrupamentos-list-panel">
            <header className="agrupamentos-col__header">
              <h2 className="agrupamentos-list-panel__title">Grupos</h2>
              <p className="agrupamentos-list-panel__hint">
                Clique em um grupo para exibir no anúncio de exemplo.
              </p>
            </header>

            <div className="agrupamentos-list-panel__body">
            {grupos.length === 0 ? (
              <p className="agrupamentos-list-panel__empty">
                Nenhum agrupamento criado ainda.
              </p>
            ) : (
              <ul className="agrupamentos-grupos-list">
                {grupos.map((grupo) => {
                  const isSelected = selectedGrupoIds.has(grupo.id);

                  return (
                    <li key={grupo.id}>
                      <div
                        className={`agrupamentos-grupo-item${isSelected ? " is-selected" : ""}`}
                        style={
                          isSelected
                            ? {
                                borderColor: grupo.corFundo,
                                boxShadow: `0 0 0 2px color-mix(in srgb, ${grupo.corFundo} 45%, transparent)`,
                              }
                            : undefined
                        }
                      >
                        <button
                          type="button"
                          className="agrupamentos-grupo-item__main"
                          onClick={() => toggleGrupoSelection(grupo.id)}
                          aria-pressed={isSelected}
                        >
                          <GrupoVisual
                            visualType={grupo.visualType}
                            visualValue={grupo.visualValue}
                            corFundo={grupo.corFundo}
                            corIcone={grupo.corIcone}
                          />
                          <span className="agrupamentos-grupo-item__nome">
                            {grupo.nome}
                          </span>
                          <span className="agrupamentos-grupo-item__cores" aria-hidden>
                            <span
                              className="agrupamentos-grupo-item__cor agrupamentos-grupo-item__cor--fundo"
                              style={{ backgroundColor: grupo.corFundo }}
                              title={`Cor de fundo: ${grupo.corFundo}`}
                            />
                            <span
                              className="agrupamentos-grupo-item__cor agrupamentos-grupo-item__cor--texto"
                              style={{ backgroundColor: grupo.corTexto }}
                              title={`Cor do texto: ${grupo.corTexto}`}
                            />
                            {isGrupoIcon(grupo) ? (
                              <span
                                className="agrupamentos-grupo-item__cor agrupamentos-grupo-item__cor--icone"
                                style={{ backgroundColor: grupo.corIcone }}
                                title={`Cor do ícone: ${grupo.corIcone}`}
                              />
                            ) : null}
                            <span
                              className={[
                                "agrupamentos-grupo-item__cor",
                                "agrupamentos-grupo-item__cor--borda",
                                !isGrupoBorderVisible(grupo.corBorda)
                                  ? "agrupamentos-grupo-item__cor--borda-empty"
                                  : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              style={{
                                borderColor: isGrupoBorderVisible(grupo.corBorda)
                                  ? grupo.corBorda
                                  : "rgba(8, 8, 12, 0.2)",
                              }}
                              title={`Cor da borda: ${grupo.corBorda}`}
                            />
                          </span>
                        </button>
                        <div className="agrupamentos-grupo-item__actions">
                          <button
                            type="button"
                            className="agrupamentos-icon-btn"
                            aria-label={`Editar ${grupo.nome}`}
                            onClick={() => openEditGrupo(grupo)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="agrupamentos-icon-btn agrupamentos-icon-btn--danger"
                            aria-label={`Excluir ${grupo.nome}`}
                            onClick={() => handleDeleteGrupo(grupo.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            </div>
          </div>
        )}
      </section>

      <section
        className={`agrupamentos-col agrupamentos-col--preview${editingAnuncio ? " is-editing" : ""}`}
      >
        <div className="agrupamentos-col__inner">
          <div className="agrupamentos-preview-panel">
            <header className="agrupamentos-col__header">
              <h2 className="agrupamentos-list-panel__title">Anúncio de exemplo</h2>
              <p className="agrupamentos-list-panel__hint">
                Pré-visualização com os chips dos grupos selecionados.
              </p>
            </header>
            <div className="agrupamentos-preview-panel__body">
              <AnuncioPreview
                anuncio={anuncio}
                gruposSelecionados={gruposSelecionados}
                onEdit={openEditAnuncio}
              />
            </div>
          </div>

          {editingAnuncio ? (
            <div className="agrupamentos-col__extension">
              <AnuncioForm
                values={anuncioDraft}
                onChange={setAnuncioDraft}
                onSubmit={handleSaveAnuncio}
                onCancel={() => setEditingAnuncio(false)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
