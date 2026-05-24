"use client";

import { Chip } from "@/components/ui/chip";
import type { Grupo, GrupoVisualType } from "@/lib/dashboards/agrupamentos/types";
import {
  DEFAULT_GRUPO_COR_BORDA,
  DEFAULT_GRUPO_BORDER_WHEN_ENABLED,
  DEFAULT_GRUPO_COR_FUNDO,
  DEFAULT_GRUPO_COR_ICONE,
  DEFAULT_GRUPO_COR_TEXTO,
  DEFAULT_GRUPO_ICON,
  GRUPO_ICON_OPTIONS,
  isGrupoIcon,
  isGrupoImage,
  normalizeGrupoCorBorda,
  normalizeGrupoCorFundo,
  normalizeGrupoCorIcone,
  normalizeGrupoCorTexto,
} from "@/lib/dashboards/agrupamentos/types";
import { GrupoIcon } from "./GrupoVisual";

export type GrupoFormValues = {
  nome: string;
  visualType: GrupoVisualType;
  visualValue: string;
  corFundo: string;
  corIcone: string;
  corTexto: string;
  corBorda: string;
};

type GrupoFormProps = {
  title: string;
  hint?: string;
  submitLabel: string;
  values: GrupoFormValues;
  onChange: (values: GrupoFormValues) => void;
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
  const isTransparent = normalized === DEFAULT_GRUPO_COR_BORDA;
  const pickerValue = isTransparent ? "#CCCCCC" : normalized;

  const showLabel = label.trim().length > 0;

  return (
    <label className="agrupamentos-field">
      {showLabel ? (
        <span className="agrupamentos-field__label">{label}</span>
      ) : null}
      <div
        className={`agrupamentos-color-field${disabled ? " is-disabled" : ""}`}
      >
        <input
          type="color"
          className="agrupamentos-color-input"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          aria-label={ariaLabel}
          disabled={disabled}
        />
        <input
          type="text"
          className="agrupamentos-input agrupamentos-color-field__hex"
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
  values: GrupoFormValues;
  onChange: (values: GrupoFormValues) => void;
}) {
  const semBorda =
    normalizeGrupoCorBorda(values.corBorda) === DEFAULT_GRUPO_COR_BORDA;

  function patchCorBorda(corBorda: string) {
    onChange({ ...values, corBorda });
  }

  const normalized = normalizeGrupoCorBorda(values.corBorda);
  const pickerValue = semBorda ? "#CCCCCC" : normalized;

  return (
    <div className="agrupamentos-field">
      <span className="agrupamentos-field__label">Cor da borda</span>
      <div
        className={`agrupamentos-color-field${semBorda ? " is-disabled" : ""}`}
      >
        <input
          type="color"
          className="agrupamentos-color-input"
          value={pickerValue}
          onChange={(e) => patchCorBorda(e.target.value.toUpperCase())}
          aria-label="Selecionar cor da borda do chip"
          disabled={semBorda}
        />
        <input
          type="text"
          className="agrupamentos-input agrupamentos-color-field__hex"
          value={semBorda ? SEM_BORDA_LABEL : values.corBorda}
          onChange={(e) => patchCorBorda(e.target.value)}
          onBlur={() => patchCorBorda(normalizeGrupoCorBorda(values.corBorda))}
          placeholder={DEFAULT_GRUPO_BORDER_WHEN_ENABLED}
          spellCheck={false}
          disabled={semBorda}
        />
        <label className="agrupamentos-checkbox agrupamentos-checkbox--inline">
          <input
            type="checkbox"
            checked={semBorda}
            onChange={(e) => {
              if (e.target.checked) {
                patchCorBorda(DEFAULT_GRUPO_COR_BORDA);
                return;
              }
              patchCorBorda(
                values.corBorda === DEFAULT_GRUPO_COR_BORDA
                  ? DEFAULT_GRUPO_BORDER_WHEN_ENABLED
                  : values.corBorda,
              );
            }}
          />
          <span>Sem borda</span>
        </label>
      </div>
    </div>
  );
}

function GrupoChipPreview({ values }: { values: GrupoFormValues }) {
  const previewGrupo = {
    visualType: values.visualType,
    visualValue: values.visualValue,
  };
  const label = values.nome.trim() || "Nome do grupo";

  return (
    <div className="agrupamentos-form__chip-preview" aria-live="polite">
      <div className="agrupamentos-form__chip-preview-stage">
        <div className="">
          <Chip
            backgroundColor={normalizeGrupoCorFundo(values.corFundo)}
            borderColor={normalizeGrupoCorBorda(values.corBorda)}
            textColor={normalizeGrupoCorTexto(values.corTexto)}
            icon={
              isGrupoIcon(previewGrupo) ? (
                <GrupoIcon
                  visualValue={values.visualValue || DEFAULT_GRUPO_ICON}
                  size={18}
                  color={normalizeGrupoCorIcone(values.corIcone)}
                />
              ) : undefined
            }
            iconColor={normalizeGrupoCorIcone(values.corIcone)}
            avatarSrc={isGrupoImage(previewGrupo) ? values.visualValue : undefined}
            avatarAlt={label}
          >
            {label}
          </Chip>
        </div>
      </div>
    </div>
  );
}

export function GrupoForm({
  title,
  hint,
  submitLabel,
  values,
  onChange,
  onSubmit,
  onCancel,
}: GrupoFormProps) {
  function patch(partial: Partial<GrupoFormValues>) {
    onChange({ ...values, ...partial });
  }

  function handleVisualTypeChange(type: GrupoVisualType) {
    if (type === values.visualType) return;
    onChange({
      ...values,
      visualType: type,
      visualValue: type === "icon" ? DEFAULT_GRUPO_ICON : "",
    });
  }

  return (
    <form
      className="agrupamentos-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="agrupamentos-form__sticky">
        <header className="agrupamentos-form__header">
          <h2 className="agrupamentos-form__title">{title}</h2>
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
          <p className="agrupamentos-form__hint">{hint}</p>
        ) : null}
        <GrupoChipPreview values={values} />
      </div>

      <div className="agrupamentos-form__body">
        <label className="agrupamentos-field">
          <span className="agrupamentos-field__label px-8">Nome do grupo</span>
          <input
            type="text"
            className="agrupamentos-input"
            value={values.nome}
            onChange={(e) => patch({ nome: e.target.value })}
            placeholder="Ex.: Premium, Pet friendly…"
            required
          />
        </label>

        <fieldset className="agrupamentos-field">
          <legend className="agrupamentos-field__label">Visual</legend>
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
          <label className="agrupamentos-field">
            <span className="agrupamentos-field__label">Ícone</span>
            <select
              className="agrupamentos-input agrupamentos-select"
              value={values.visualValue}
              onChange={(e) => patch({ visualValue: e.target.value })}
            >
              {GRUPO_ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {values.visualType === "image" ? (
          <label className="agrupamentos-field">
            <span className="agrupamentos-field__label">URL da imagem</span>
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
          value={values.corFundo}
          onChange={(corFundo) => patch({ corFundo })}
          onNormalize={normalizeGrupoCorFundo}
          placeholder={DEFAULT_GRUPO_COR_FUNDO}
          ariaLabel="Selecionar cor de fundo do grupo"
        />

        <ColorField
          label="Cor do texto"
          value={values.corTexto}
          onChange={(corTexto) => patch({ corTexto })}
          onNormalize={normalizeGrupoCorTexto}
          placeholder={DEFAULT_GRUPO_COR_TEXTO}
          ariaLabel="Selecionar cor do texto do grupo"
        />

        {values.visualType === "icon" ? (
          <ColorField
            label="Cor do ícone"
            value={values.corIcone}
            onChange={(corIcone) => patch({ corIcone })}
            onNormalize={normalizeGrupoCorIcone}
            placeholder={DEFAULT_GRUPO_COR_ICONE}
            ariaLabel="Selecionar cor do ícone do grupo"
          />
        ) : null}

        <BorderColorField values={values} onChange={onChange} />
      </div>

      <footer className="agrupamentos-form__footer">
        <button
          type="submit"
          className="agrupamentos-btn agrupamentos-btn--primary"
          disabled={!values.nome.trim()}
        >
          {submitLabel}
        </button>
      </footer>
    </form>
  );
}

export function grupoToFormValues(grupo: Grupo): GrupoFormValues {
  return {
    nome: grupo.nome,
    visualType: grupo.visualType,
    visualValue: grupo.visualValue,
    corFundo: grupo.corFundo,
    corIcone: grupo.corIcone,
    corTexto: grupo.corTexto,
    corBorda: grupo.corBorda,
  };
}
