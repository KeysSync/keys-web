"use client";

import {
  buildGroupFieldsFromDraft,
  createEmptyGroupDraft,
  createGroupId,
  DEFAULT_LISTING_EXAMPLE,
  isGroupBorderVisible,
  isGroupIcon,
  type ListingExample,
  type Group,
} from "@/lib/dashboards/groups/types";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ListingForm } from "./ListingForm";
import { ListingPreview } from "./ListingPreview";
import { GroupForm, groupToFormValues, type GroupFormValues } from "./GroupForm";
import { GroupVisual } from "./GroupVisual";

const INITIAL_GROUPS: Group[] = [
  {
    id: "group-emccamp",
    name: "Emccamp",
    visualType: "image",
    visualValue: "https://raichu-uploads.s3.amazonaws.com/logo_emccamp-residencial_BVJTev.png",
  backgroundColor: "#FFFFFF",
  iconColor: "#000000",
  textColor: "#6c6d6f",
  borderColor: "#96c43e",
  },
  {
    id: "group-garotas-palhaco",
    name: "Garotas Palhaço",
    visualType: "image",
    visualValue: "https://i.pinimg.com/736x/f5/5e/3b/f55e3b8ce2d6156a016cfea264af884a.jpg",
  backgroundColor: "#FFE5FB",
  iconColor: "#08080C",
  textColor: "#56206A",
  borderColor: "#B847A7",
  },
];

export function GroupsWorkspace() {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [createDraft, setCreateDraft] = useState<GroupFormValues>(createEmptyGroupDraft);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<GroupFormValues>(createEmptyGroupDraft);
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(
    () => new Set(["group-pet"]),
  );
  const [listing, setListing] = useState<ListingExample>(DEFAULT_LISTING_EXAMPLE);
  const [listingDraft, setListingDraft] = useState<ListingExample>(DEFAULT_LISTING_EXAMPLE);
  const [editingListing, setEditingListing] = useState(false);

  const editingGroup = useMemo(
    () => groups.find((g) => g.id === editingGroupId) ?? null,
    [groups, editingGroupId],
  );

  const groupsSelected = useMemo(
    () => groups.filter((g) => selectedGroupIds.has(g.id)),
    [groups, selectedGroupIds],
  );

  function handleCreateGroup() {
    const name = createDraft.name.trim();
    if (!name) return;

    const newGroup: Group = {
      id: createGroupId(),
      ...buildGroupFieldsFromDraft(createDraft),
    };

    setGroups((prev) => [...prev, newGroup]);
    setCreateDraft(createEmptyGroupDraft());
  }

  function handleSaveEditGroup() {
    if (!editingGroupId) return;
    const name = editDraft.name.trim();
    if (!name) return;

    setGroups((prev) =>
      prev.map((g) =>
        g.id === editingGroupId
          ? { ...g, ...buildGroupFieldsFromDraft(editDraft) }
          : g,
      ),
    );
    setEditingGroupId(null);
  }

  function handleDeleteGroup(id: string) {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setSelectedGroupIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (editingGroupId === id) setEditingGroupId(null);
  }

  function openEditGroup(group: Group) {
    setEditingGroupId(group.id);
    setEditDraft(groupToFormValues(group));
  }

  function toggleGroupSelection(id: string) {
    setSelectedGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openEditListing() {
    setListingDraft(listing);
    setEditingListing(true);
  }

  function handleSaveListing() {
    setListing(listingDraft);
    setEditingListing(false);
  }

  return (
    <div className="groups-page">
      <section className="groups-col groups-col--create">
        <GroupForm
          title="Novo Group"
          hint="Pré-visualização do chip em tempo real."
          submitLabel="Criar grupo"
          values={createDraft}
          onChange={setCreateDraft}
          onSubmit={handleCreateGroup}
        />
      </section>

      <section className="groups-col groups-col--list">
        {editingGroup ? (
          <GroupForm
            title={`Editar: ${editingGroup.name}`}
            hint="Altere as opções do grupo abaixo."
            submitLabel="Salvar alterações"
            values={editDraft}
            onChange={setEditDraft}
            onSubmit={handleSaveEditGroup}
            onCancel={() => setEditingGroupId(null)}
          />
        ) : (
          <div className="agrupamentos-list-panel">
            <header className="groups-col__header">
              <h2 className="agrupamentos-list-panel__title">Grupos</h2>
              <p className="agrupamentos-list-panel__hint">
                Clique em um grupo para exibir no anúncio de exemplo.
              </p>
            </header>

            <div className="agrupamentos-list-panel__body">
            {groups.length === 0 ? (
              <p className="agrupamentos-list-panel__empty">
                Nenhum agrupamento criado ainda.
              </p>
            ) : (
              <ul className="groups-groups-list">
                {groups.map((group) => {
                  const isSelected = selectedGroupIds.has(group.id);

                  return (
                    <li key={group.id}>
                      <div
                        className={`groups-group-item${isSelected ? " is-selected" : ""}`}
                        style={
                          isSelected
                            ? {
                                borderColor: group.backgroundColor,
                                boxShadow: `0 0 0 2px color-mix(in srgb, ${group.backgroundColor} 45%, transparent)`,
                              }
                            : undefined
                        }
                      >
                        <button
                          type="button"
                          className="groups-group-item__main"
                          onClick={() => toggleGroupSelection(group.id)}
                          aria-pressed={isSelected}
                        >
                          <GroupVisual
                            visualType={group.visualType}
                            visualValue={group.visualValue}
                            backgroundColor={group.backgroundColor}
                            iconColor={group.iconColor}
                          />
                          <span className="groups-group-item__name">
                            {group.name}
                          </span>
                          <span className="groups-group-item__cores" aria-hidden>
                            <span
                              className="groups-group-item__cor groups-group-item__cor--fundo"
                              style={{ backgroundColor: group.backgroundColor }}
                              title={`Cor de fundo: ${group.backgroundColor}`}
                            />
                            <span
                              className="groups-group-item__cor groups-group-item__cor--texto"
                              style={{ backgroundColor: group.textColor }}
                              title={`Cor do texto: ${group.textColor}`}
                            />
                            {isGroupIcon(group) ? (
                              <span
                                className="groups-group-item__cor groups-group-item__cor--icone"
                                style={{ backgroundColor: group.iconColor }}
                                title={`Cor do ícone: ${group.iconColor}`}
                              />
                            ) : null}
                            <span
                              className={[
                                "groups-group-item__cor",
                                "groups-group-item__cor--borda",
                                !isGroupBorderVisible(group.borderColor)
                                  ? "groups-group-item__cor--borda-empty"
                                  : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              style={{
                                borderColor: isGroupBorderVisible(group.borderColor)
                                  ? group.borderColor
                                  : "rgba(8, 8, 12, 0.2)",
                              }}
                              title={`Cor da borda: ${group.borderColor}`}
                            />
                          </span>
                        </button>
                        <div className="groups-group-item__actions">
                          <button
                            type="button"
                            className="agrupamentos-icon-btn"
                            aria-label={`Editar ${group.name}`}
                            onClick={() => openEditGroup(group)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="agrupamentos-icon-btn agrupamentos-icon-btn--danger"
                            aria-label={`Excluir ${group.name}`}
                            onClick={() => handleDeleteGroup(group.id)}
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
        className={`groups-col groups-col--preview${editingListing ? " is-editing" : ""}`}
      >
        <div className="groups-col__inner">
          <div className="agrupamentos-preview-panel">
            <header className="groups-col__header">
              <h2 className="agrupamentos-list-panel__title">Anúncio de exemplo</h2>
              <p className="agrupamentos-list-panel__hint">
                Pré-visualização com os chips dos grupos selecionados.
              </p>
            </header>
            <div className="agrupamentos-preview-panel__body">
              <ListingPreview
                listing={listing}
                groupsSelected={groupsSelected}
                onEdit={openEditListing}
              />
            </div>
          </div>

          {editingListing ? (
            <div className="groups-col__extension">
              <ListingForm
                values={listingDraft}
                onChange={setListingDraft}
                onSubmit={handleSaveListing}
                onCancel={() => setEditingListing(false)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
