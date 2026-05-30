"use client";

import { Chip } from "@/components/ui/chip";
import { SelectField } from "@/components/ui/select";
import type { Group, GroupVisualType } from "@/lib/dashboards/groups/types";
import {
  DEFAULT_GROUP_BORDER_COLOR,
  DEFAULT_GROUP_BORDER_WHEN_ENABLED,
  DEFAULT_GROUP_BACKGROUND,
  DEFAULT_GROUP_ICON_COLOR,
  DEFAULT_GROUP_TEXT_COLOR,
  DEFAULT_GROUP_ICON,
  GROUP_ICON_OPTIONS,
  isGroupIcon,
  isGroupImage,
  normalizeGroupBorderColor,
  normalizeGroupBackgroundColor,
  normalizeGroupIconColor,
  normalizeGroupTextColor,
} from "@/lib/dashboards/groups/types";
import { GroupIcon } from "./GroupVisual";

export type GroupFormValues = {
  name: string;
  visualType: GroupVisualType;
  visualValue: string;
backgroundColor: string;
iconColor: string;
textColor: string;
borderColor: string;
};

type GroupFormProps = {
  title: string;
  hint?: string;
  submitLabel: string;
  values: GroupFormValues;
  onChange: (values: GroupFormValues) => void;
  onSubmit: () => void;
  onCancel?: () => void;
};

function ColorField({
  label,
  value,
  onChange,
  onNormalize,
  placeholder,
  ariaLabel,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onNormalize: (value: string) => string;
  placeholder: string;
  ariaLabel: string;
  disabled?: boolean;
}) {
  const normalized = onNormalize(value);
  const isTransparent = normalized === DEFAULT_GROUP_BORDER_COLOR;
  const pickerValue = isTransparent ? "#CCCCCC" : normalized;

  const showLabel = label.trim().length > 0;

  return (
    <label className="groups-field">
      {showLabel ? (
        <span className="groups-field__label">{label}</span>
      ) : null}
      <div
        className={`groups-color-field${disabled ? " is-disabled" : ""}`}
      >
        <input
          type="color"
          className="groups-color-input"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          aria-label={ariaLabel}
          disabled={disabled}
        />
        <input
          type="text"
          className="agrupamentos-input groups-color-field__hex"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => onChange(onNormalize(value))}
          placeholder={placeholder}
          spellCheck={false}
          disabled={disabled}
        />
      </div>
    </label>
  );
}

const SEM_BORDA_LABEL = "Sem borda ativado";

function BorderColorField({
  values,
  onChange,
}: {
  values: GroupFormValues;
  onChange: (values: GroupFormValues) => void;
}) {
  const semBorda =
    normalizeGroupBorderColor(values.borderColor) === DEFAULT_GROUP_BORDER_COLOR;

  function patchBorderColor(borderColor: string) {
    onChange({ ...values, borderColor });
  }

  const normalized = normalizeGroupBorderColor(values.borderColor);
  const pickerValue = semBorda ? "#CCCCCC" : normalized;

  return (
    <div className="groups-field">
      <span className="groups-field__label">Cor da borda</span>
      <div
        className={`groups-color-field${semBorda ? " is-disabled" : ""}`}
      >
        <input
          type="color"
          className="groups-color-input"
          value={pickerValue}
          onChange={(e) => patchBorderColor(e.target.value.toUpperCase())}
          aria-label="Selecionar cor da borda do chip"
          disabled={semBorda}
        />
        <input
          type="text"
          className="agrupamentos-input groups-color-field__hex"
          value={semBorda ? SEM_BORDA_LABEL : values.borderColor}
          onChange={(e) => patchBorderColor(e.target.value)}
          onBlur={() => patchBorderColor(normalizeGroupBorderColor(values.borderColor))}
          placeholder={DEFAULT_GROUP_BORDER_WHEN_ENABLED}
          spellCheck={false}
          disabled={semBorda}
        />
        <label className="agrupamentos-checkbox agrupamentos-checkbox--inline">
          <input
            type="checkbox"
            checked={semBorda}
            onChange={(e) => {
              if (e.target.checked) {
                patchBorderColor(DEFAULT_GROUP_BORDER_COLOR);
                return;
              }
              patchBorderColor(
                values.borderColor === DEFAULT_GROUP_BORDER_COLOR
                  ? DEFAULT_GROUP_BORDER_WHEN_ENABLED
                  : values.borderColor,
              );
            }}
          />
          <span>Sem borda</span>
        </label>
      </div>
    </div>
  );
}

function GrupoChipPreview({ values }: { values: GroupFormValues }) {
  const previewGrupo = {
    visualType: values.visualType,
    visualValue: values.visualValue,
  };
  const label = values.name.trim() || "Nome do grupo";

  return (
    <div className="groups-form__chip-preview" aria-live="polite">
      <div className="groups-form__chip-preview-stage">
        <div className="">
          <Chip
            backgroundColor={normalizeGroupBackgroundColor(values.backgroundColor)}
            borderColor={normalizeGroupBorderColor(values.borderColor)}
            textColor={normalizeGroupTextColor(values.textColor)}
            icon={
              isGroupIcon(previewGrupo) ? (
                <GroupIcon
                  visualValue={values.visualValue || DEFAULT_GROUP_ICON}
                  size={18}
                  color={normalizeGroupIconColor(values.iconColor)}
                />
              ) : undefined
            }
            iconColor={normalizeGroupIconColor(values.iconColor)}
            avatarSrc={isGroupImage(previewGrupo) ? values.visualValue : undefined}
            avatarAlt={label}
          >
            {label}
          </Chip>
        </div>
      </div>
    </div>
  );
}

export function GroupForm({
  title,
  hint,
  submitLabel,
  values,
  onChange,
  onSubmit,
  onCancel,
}: GroupFormProps) {
  function patch(partial: Partial<GroupFormValues>) {
    onChange({ ...values, ...partial });
  }

  function handleVisualTypeChange(type: GroupVisualType) {
    if (type === values.visualType) return;
    onChange({
      ...values,
      visualType: type,
      visualValue: type === "icon" ? DEFAULT_GROUP_ICON : "",
    });
  }

  return (
    <form
      className="groups-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="groups-form__sticky">
        <header className="groups-form__header">
          <h2 className="groups-form__title">{title}</h2>
          {onCancel ? (
            <button
              type="button"
              className="agrupamentos-btn agrupamentos-btn--ghost agrupamentos-btn--sm"
              onClick={onCancel}
            >
              Fechar
            </button>
          ) : null}
        </header>
        {hint ? (
          <p className="groups-form__hint">{hint}</p>
        ) : null}
        <GrupoChipPreview values={values} />
      </div>

      <div className="groups-form__body">
        <label className="groups-field">
          <span className="groups-field__label px-8">Nome do grupo</span>
          <input
            type="text"
            className="agrupamentos-input"
            value={values.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Ex.: Premium, Pet friendly…"
            required
          />
        </label>

        <fieldset className="groups-field">
          <legend className="groups-field__label">Visual</legend>
          <div className="agrupamentos-segmented agrupamentos-segmented--3">
            <button
              type="button"
              className={`agrupamentos-segmented__btn${values.visualType === "none" ? " is-active" : ""}`}
              onClick={() => handleVisualTypeChange("none")}
            >
              Nenhum
            </button>
            <button
              type="button"
              className={`agrupamentos-segmented__btn${values.visualType === "icon" ? " is-active" : ""}`}
              onClick={() => handleVisualTypeChange("icon")}
            >
              Ícone
            </button>
            <button
              type="button"
              className={`agrupamentos-segmented__btn${values.visualType === "image" ? " is-active" : ""}`}
              onClick={() => handleVisualTypeChange("image")}
            >
              Imagem (URL)
            </button>
          </div>
        </fieldset>

        {values.visualType === "icon" ? (
          <SelectField
            label="Ícone"
            value={values.visualValue}
            onChange={(e) => patch({ visualValue: e.target.value })}
            options={GROUP_ICON_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            fieldClassName="groups-field"
            labelClassName="groups-field__label"
          />
        ) : null}

        {values.visualType === "image" ? (
          <label className="groups-field">
            <span className="groups-field__label">URL da imagem</span>
            <input
              type="url"
              className="agrupamentos-input"
              value={values.visualValue}
              onChange={(e) => patch({ visualValue: e.target.value })}
              placeholder="https://…"
            />
          </label>
        ) : null}

        <ColorField
          label="Cor de fundo"
          value={values.backgroundColor}
          onChange={(backgroundColor) => patch({ backgroundColor })}
          onNormalize={normalizeGroupBackgroundColor}
          placeholder={DEFAULT_GROUP_BACKGROUND}
          ariaLabel="Selecionar cor de fundo do grupo"
        />

        <ColorField
          label="Cor do texto"
          value={values.textColor}
          onChange={(textColor) => patch({ textColor })}
          onNormalize={normalizeGroupTextColor}
          placeholder={DEFAULT_GROUP_TEXT_COLOR}
          ariaLabel="Selecionar cor do texto do grupo"
        />

        {values.visualType === "icon" ? (
          <ColorField
            label="Cor do ícone"
            value={values.iconColor}
            onChange={(iconColor) => patch({ iconColor })}
            onNormalize={normalizeGroupIconColor}
            placeholder={DEFAULT_GROUP_ICON_COLOR}
            ariaLabel="Selecionar cor do ícone do grupo"
          />
        ) : null}

        <BorderColorField values={values} onChange={onChange} />
      </div>

      <footer className="groups-form__footer">
        <button
          type="submit"
          className="agrupamentos-btn agrupamentos-btn--primary"
          disabled={!values.name.trim()}
        >
          {submitLabel}
        </button>
      </footer>
    </form>
  );
}

export function groupToFormValues(group: Group): GroupFormValues {
  return {
    name: group.name,
    visualType: group.visualType,
    visualValue: group.visualValue,
    backgroundColor: group.backgroundColor,
    iconColor: group.iconColor,
    textColor: group.textColor,
    borderColor: group.borderColor,
  };
}
