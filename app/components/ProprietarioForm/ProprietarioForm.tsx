"use client";

import { EntityFormField } from "@/app/components/EntityForm/EntityFormField";
import { FormSection } from "@/app/components/FormSection/FormSection";
import { Checkbox } from "@/app/components/Checkbox/Checkbox";
import { CepInputBr } from "@/components/ui/cep-input-br";
import { DateInputBr } from "@/components/ui/date-input-br";
import { DocumentInputBr } from "@/components/ui/document-input-br";
import { MaskedTextInputBr } from "@/components/ui/masked-text-input-br";
import { PixKeyInputBr } from "@/components/ui/pix-key-input-br";
import { Select } from "@/components/ui/select";
import { bancoOptions } from "@/lib/mocks/bancos";
import { mockProprietarios } from "@/lib/mocks/proprietarios";
import {
  BANK_ACCOUNT_TYPE_OPTIONS,
  CIVIL_STATUS_OPTIONS,
  CIVIL_STATUS_WITH_PARTNER,
  MARRIAGE_REGIME_OPTIONS,
  PIX_TYPE_OPTIONS,
  PROPRIETARIO_TYPE_OPTIONS,
  STATE_OPTIONS,
} from "@/lib/proprietarios/constants";
import {
  createBankAccount,
  createTelefone,
  defaultProprietarioFormData,
  hasFormErrors,
  validateProprietarioForm,
} from "@/lib/proprietarios/form";
import type {
  ProprietarioBankAccount,
  ProprietarioFormData,
  ProprietarioFormErrors,
  ProprietarioType,
} from "@/lib/proprietarios/types";
import { fetchAddressByCep } from "@/lib/utils/cep/fetch-viacep";
import { onlyDigits } from "@/lib/utils/validation";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass = (hasError?: boolean) =>
  `contrato-criar-input${hasError ? " contrato-criar-input--error" : ""}`;

const partnerOptions = [
  { value: "", label: "Nenhum" },
  ...mockProprietarios
    .filter((p) => p.tipo === "pf")
    .map((p) => ({ value: p.id, label: p.nome })),
];

export function ProprietarioForm() {
  const router = useRouter();
  const [data, setData] = useState<ProprietarioFormData>(defaultProprietarioFormData);
  const [errors, setErrors] = useState<ProprietarioFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const isPerson = data.type === "person";
  const showMarriageFields =
    isPerson && data.civil_status && CIVIL_STATUS_WITH_PARTNER.has(data.civil_status);

  function patch(partial: Partial<ProprietarioFormData>) {
    setData((prev) => {
      const next = { ...prev, ...partial };
      if (partial.name !== undefined) {
        next.bank_account = next.bank_account.map((acc) =>
          !acc.favored || acc.favored === prev.name
            ? { ...acc, favored: partial.name ?? "" }
            : acc,
        );
      }
      return next;
    });
    setErrors({});
  }

  async function handleCepBlur() {
    const digits = onlyDigits(data.postal_code);
    if (digits.length !== 8) return;

    setCepLoading(true);
    const address = await fetchAddressByCep(digits);
    setCepLoading(false);

    if (!address) return;
    patch({
      street: address.street || data.street,
      neighborhood: address.neighborhood || data.neighborhood,
      city: address.city || data.city,
      state: address.state || data.state,
    });
  }

  function updateTelefone(id: string, partial: Partial<ProprietarioFormData["telefones"][0]>) {
    setData((prev) => ({
      ...prev,
      telefones: prev.telefones.map((t) =>
        t.id === id ? { ...t, ...partial } : t,
      ),
    }));
    setErrors((prev) => {
      const current = prev.telefones;
      if (!current?.[id]) return prev;
      const next = { ...current };
      delete next[id];
      return {
        ...prev,
        telefones:
          Object.keys(next).length > 0 ? next : undefined,
      };
    });
  }

  function updateBankAccount(
    id: string,
    partial: Partial<ProprietarioBankAccount>,
  ) {
    setData((prev) => ({
      ...prev,
      bank_account: prev.bank_account.map((acc) => {
        if (acc.id === id) return { ...acc, ...partial };
        if (partial.main === true) return { ...acc, main: false };
        return acc;
      }),
    }));
    setErrors((prev) => {
      const current = prev.bank_account;
      if (!current?.[id]) return prev;
      const next = { ...current };
      delete next[id];
      return {
        ...prev,
        bank_account:
          Object.keys(next).length > 0 ? next : undefined,
      };
    });
  }

  function addTelefone() {
    setData((prev) => ({
      ...prev,
      telefones: [...prev.telefones, createTelefone()],
    }));
  }

  function removeTelefone(id: string) {
    setData((prev) => ({
      ...prev,
      telefones:
        prev.telefones.length <= 1
          ? prev.telefones
          : prev.telefones.filter((t) => t.id !== id),
    }));
  }

  function addBankAccount() {
    setData((prev) => ({
      ...prev,
      bank_account: [
        ...prev.bank_account,
        createBankAccount(prev.name),
      ],
    }));
  }

  function removeBankAccount(id: string) {
    setData((prev) => ({
      ...prev,
      bank_account: prev.bank_account.filter((acc) => acc.id !== id),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateProprietarioForm(data);
    setErrors(nextErrors);
    if (hasFormErrors(nextErrors)) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    router.push("/imoveis/proprietarios");
  }

  return (
    <form className="entity-form-page" onSubmit={handleSubmit} noValidate>
      <header className="entity-form-page__header">
        <div>
          <Link
            href="/imoveis/proprietarios"
            className="contrato-criar-back"
            style={{ marginBottom: "0.75rem" }}
          >
            <ArrowLeft size={16} aria-hidden />
            Proprietários
          </Link>
          <h1 className="entity-form-page__title">Novo proprietário</h1>
          <p className="entity-form-page__desc">
            Preencha os dados do proprietário. Campos com * são obrigatórios.
          </p>
        </div>
        <div className="entity-form-page__actions">
          <Link
            href="/imoveis/proprietarios"
            className="entity-form-btn entity-form-btn--ghost"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="entity-form-btn entity-form-btn--primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden />
                Salvando…
              </>
            ) : (
              "Salvar proprietário"
            )}
          </button>
        </div>
      </header>

      <FormSection
        title="Identificação"
        description="Tipo de pessoa e dados principais de contato."
      >
        <div className="contrato-criar-form-grid">
          <EntityFormField
            label="Tipo"
            htmlFor="proprietario-type"
            required
            error={errors.type}
            className="contrato-criar-field--wide"
          >
            <Select
              id="proprietario-type"
              options={[...PROPRIETARIO_TYPE_OPTIONS]}
              value={data.type}
              onChange={(e) => {
                const type = e.target.value as ProprietarioType;
                patch({
                  type,
                  marriage_regime: type === "enterprise" ? "" : data.marriage_regime,
                  partner: type === "enterprise" ? "" : data.partner,
                  civil_status: type === "enterprise" ? "" : data.civil_status,
                });
              }}
            />
          </EntityFormField>

          <EntityFormField
            label={isPerson ? "Nome completo" : "Razão social"}
            htmlFor="proprietario-name"
            required
            error={errors.name}
            className="contrato-criar-field--wide"
          >
            <input
              id="proprietario-name"
              type="text"
              className={inputClass(Boolean(errors.name))}
              value={data.name}
              onChange={(e) => patch({ name: e.target.value })}
              autoComplete="name"
            />
          </EntityFormField>

          <EntityFormField
            label="E-mail"
            htmlFor="proprietario-email"
            required
            error={errors.email}
          >
            <input
              id="proprietario-email"
              type="email"
              className={inputClass(Boolean(errors.email))}
              value={data.email}
              onChange={(e) => patch({ email: e.target.value })}
              autoComplete="email"
            />
          </EntityFormField>

          <EntityFormField
            label={isPerson ? "CPF" : "CNPJ"}
            htmlFor="proprietario-document"
            required
            error={errors.document}
          >
            <DocumentInputBr
              id="proprietario-document"
              className={inputClass(Boolean(errors.document))}
              value={data.document}
              onChange={(v) => patch({ document: v })}
              placeholder={
                isPerson ? "000.000.000-00" : "00.000.000/0000-00"
              }
            />
          </EntityFormField>

          {isPerson ? (
            <EntityFormField
              label="Data de nascimento"
              htmlFor="proprietario-birthdate"
              required
              error={errors.birthdate}
              className="contrato-criar-field--date"
            >
              <DateInputBr
                id="proprietario-birthdate"
                value={data.birthdate}
                onChange={(iso) => patch({ birthdate: iso })}
              />
            </EntityFormField>
          ) : null}

          {isPerson ? (
            <EntityFormField label="Profissão" htmlFor="proprietario-occupation">
              <input
                id="proprietario-occupation"
                type="text"
                className={inputClass()}
                value={data.occupation}
                onChange={(e) => patch({ occupation: e.target.value })}
              />
            </EntityFormField>
          ) : null}
        </div>
      </FormSection>

      {isPerson ? (
        <FormSection title="Documentação" description="RG e órgão emissor.">
          <div className="contrato-criar-form-grid">
            <EntityFormField label="RG" htmlFor="proprietario-rg">
              <input
                id="proprietario-rg"
                type="text"
                className={inputClass()}
                value={data.rg}
                onChange={(e) => patch({ rg: e.target.value })}
              />
            </EntityFormField>
            <EntityFormField label="Órgão emissor" htmlFor="proprietario-rg-origin">
              <input
                id="proprietario-rg-origin"
                type="text"
                className={inputClass()}
                value={data.rg_origin}
                onChange={(e) => patch({ rg_origin: e.target.value })}
                placeholder="Ex.: SSP/SP"
              />
            </EntityFormField>
          </div>
        </FormSection>
      ) : null}

      {isPerson ? (
        <FormSection
          title="Dados pessoais"
          description="Nacionalidade, naturalidade e estado civil."
        >
          <div className="contrato-criar-form-grid">
            <EntityFormField label="Nacionalidade" htmlFor="proprietario-nationality">
              <input
                id="proprietario-nationality"
                type="text"
                className={inputClass()}
                value={data.nationality}
                onChange={(e) => patch({ nationality: e.target.value })}
              />
            </EntityFormField>
            <EntityFormField
              label="Naturalidade"
              htmlFor="proprietario-place-of-birth"
            >
              <input
                id="proprietario-place-of-birth"
                type="text"
                className={inputClass()}
                value={data.place_of_birth}
                onChange={(e) => patch({ place_of_birth: e.target.value })}
              />
            </EntityFormField>
            <EntityFormField label="Estado civil" htmlFor="proprietario-civil-status">
              <Select
                id="proprietario-civil-status"
                placeholder="Selecione"
                options={[
                  { value: "", label: "Selecione" },
                  ...CIVIL_STATUS_OPTIONS,
                ]}
                value={data.civil_status}
                onChange={(e) => {
                  const civil_status = e.target.value;
                  patch({
                    civil_status,
                    marriage_regime: CIVIL_STATUS_WITH_PARTNER.has(civil_status)
                      ? data.marriage_regime
                      : "",
                    partner: CIVIL_STATUS_WITH_PARTNER.has(civil_status)
                      ? data.partner
                      : "",
                  });
                }}
              />
            </EntityFormField>
            {showMarriageFields ? (
              <>
                <EntityFormField
                  label="Regime de casamento"
                  htmlFor="proprietario-marriage-regime"
                  required
                  error={errors.marriage_regime}
                >
                  <Select
                    id="proprietario-marriage-regime"
                    placeholder="Selecione"
                    options={[
                      { value: "", label: "Selecione" },
                      ...MARRIAGE_REGIME_OPTIONS,
                    ]}
                    value={data.marriage_regime}
                    onChange={(e) =>
                      patch({
                        marriage_regime: e.target
                          .value as ProprietarioFormData["marriage_regime"],
                      })
                    }
                  />
                </EntityFormField>
                <EntityFormField label="Cônjuge" htmlFor="proprietario-partner">
                  <Select
                    id="proprietario-partner"
                    placeholder="Vincular pessoa"
                    options={partnerOptions}
                    value={data.partner}
                    onChange={(e) => patch({ partner: e.target.value })}
                  />
                </EntityFormField>
              </>
            ) : null}
          </div>
        </FormSection>
      ) : null}

      <FormSection
        title="Telefones"
        description="Adicione um ou mais números com observações internas."
      >
        <div className="entity-form-repeater">
          {data.telefones.map((tel, index) => (
            <div key={tel.id} className="entity-form-repeater__item">
              <div className="entity-form-repeater__item-head">
                <p className="entity-form-repeater__item-title">
                  Telefone {index + 1}
                </p>
                {data.telefones.length > 1 ? (
                  <button
                    type="button"
                    className="entity-form-repeater__remove"
                    onClick={() => removeTelefone(tel.id)}
                  >
                    <Trash2 size={14} aria-hidden />
                    Remover
                  </button>
                ) : null}
              </div>
              <div className="contrato-criar-form-grid">
                <EntityFormField
                  label="Número"
                  htmlFor={`tel-${tel.id}`}
                  error={errors.telefones?.[tel.id]?.number}
                >
                  <MaskedTextInputBr
                    id={`tel-${tel.id}`}
                    mask="phone"
                    className={inputClass(Boolean(errors.telefones?.[tel.id]?.number))}
                    value={tel.number}
                    onChange={(v) => updateTelefone(tel.id, { number: v })}
                  />
                </EntityFormField>
                <EntityFormField
                  label="Observações"
                  htmlFor={`tel-obs-${tel.id}`}
                  className="contrato-criar-field--wide"
                >
                  <input
                    id={`tel-obs-${tel.id}`}
                    type="text"
                    className={inputClass()}
                    value={tel.obs}
                    onChange={(e) =>
                      updateTelefone(tel.id, { obs: e.target.value })
                    }
                    placeholder="Ex.: WhatsApp preferencial"
                  />
                </EntityFormField>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="entity-form-repeater__add"
            onClick={addTelefone}
          >
            <Plus size={16} aria-hidden />
            Adicionar telefone
          </button>
        </div>
      </FormSection>

      <FormSection
        title="Endereço"
        description="Informe o CEP para preencher logradouro, bairro, cidade e UF automaticamente."
      >
        <div className="contrato-criar-form-grid">
          <EntityFormField
            label="CEP"
            htmlFor="proprietario-cep"
            required
            error={errors.postal_code}
          >
            <CepInputBr
              id="proprietario-cep"
              className={inputClass(Boolean(errors.postal_code))}
              value={data.postal_code}
              onChange={(v) => patch({ postal_code: v })}
              onBlur={handleCepBlur}
            />
            {cepLoading ? (
              <span className="entity-form-cep-hint">Buscando endereço…</span>
            ) : null}
          </EntityFormField>
          <EntityFormField
            label="Logradouro"
            htmlFor="proprietario-street"
            required
            error={errors.street}
            className="contrato-criar-field--wide"
          >
            <input
              id="proprietario-street"
              type="text"
              className={inputClass(Boolean(errors.street))}
              value={data.street}
              onChange={(e) => patch({ street: e.target.value })}
            />
          </EntityFormField>
          <EntityFormField label="Número" htmlFor="proprietario-number">
            <input
              id="proprietario-number"
              type="text"
              className={inputClass()}
              value={data.number}
              onChange={(e) => patch({ number: e.target.value })}
            />
          </EntityFormField>
          <EntityFormField label="Complemento" htmlFor="proprietario-complement">
            <input
              id="proprietario-complement"
              type="text"
              className={inputClass()}
              value={data.complement}
              onChange={(e) => patch({ complement: e.target.value })}
            />
          </EntityFormField>
          <EntityFormField label="Bairro" htmlFor="proprietario-neighborhood">
            <input
              id="proprietario-neighborhood"
              type="text"
              className={inputClass()}
              value={data.neighborhood}
              onChange={(e) => patch({ neighborhood: e.target.value })}
            />
          </EntityFormField>
          <EntityFormField
            label="Cidade"
            htmlFor="proprietario-city"
            required
            error={errors.city}
          >
            <input
              id="proprietario-city"
              type="text"
              className={inputClass(Boolean(errors.city))}
              value={data.city}
              onChange={(e) => patch({ city: e.target.value })}
            />
          </EntityFormField>
          <EntityFormField
            label="Estado (UF)"
            htmlFor="proprietario-state"
            required
            error={errors.state}
          >
            <Select
              id="proprietario-state"
              placeholder="UF"
              options={[{ value: "", label: "UF" }, ...STATE_OPTIONS]}
              value={data.state}
              onChange={(e) => patch({ state: e.target.value })}
            />
          </EntityFormField>
        </div>
      </FormSection>

      <FormSection
        title="Contas bancárias"
        description="Opcional. Cadastre contas para repasses e pagamentos."
      >
        <div className="entity-form-repeater">
          {data.bank_account.length === 0 ? (
            <p className="contrato-criar-field__hint" style={{ margin: 0 }}>
              Nenhuma conta cadastrada.
            </p>
          ) : null}
          {data.bank_account.map((acc, index) => (
            <div key={acc.id} className="entity-form-repeater__item">
              <div className="entity-form-repeater__item-head">
                <p className="entity-form-repeater__item-title">
                  Conta {index + 1}
                </p>
                <button
                  type="button"
                  className="entity-form-repeater__remove"
                  onClick={() => removeBankAccount(acc.id)}
                >
                  <Trash2 size={14} aria-hidden />
                  Remover
                </button>
              </div>
              <div className="contrato-criar-form-grid">
                <EntityFormField
                  label="Tipo"
                  required
                  error={errors.bank_account?.[acc.id]?.type}
                >
                  <Select
                    placeholder="Tipo"
                    options={[
                      { value: "", label: "Selecione" },
                      ...BANK_ACCOUNT_TYPE_OPTIONS,
                    ]}
                    value={acc.type}
                    onChange={(e) =>
                      updateBankAccount(acc.id, {
                        type: e.target.value as ProprietarioBankAccount["type"],
                      })
                    }
                  />
                </EntityFormField>
                <EntityFormField
                  label="Banco"
                  required
                  error={errors.bank_account?.[acc.id]?.bank_id}
                >
                  <Select
                    placeholder="Banco"
                    options={[{ value: "", label: "Selecione" }, ...bancoOptions]}
                    value={acc.bank_id}
                    onChange={(e) =>
                      updateBankAccount(acc.id, { bank_id: e.target.value })
                    }
                  />
                </EntityFormField>
                <EntityFormField label="Agência">
                  <MaskedTextInputBr
                    mask="agency"
                    value={acc.agency}
                    onChange={(v) => updateBankAccount(acc.id, { agency: v })}
                  />
                </EntityFormField>
                <EntityFormField label="Conta">
                  <MaskedTextInputBr
                    mask="bankAccount"
                    value={acc.account}
                    onChange={(v) => updateBankAccount(acc.id, { account: v })}
                  />
                </EntityFormField>
                <EntityFormField
                  label="Documento do titular"
                  required
                  error={errors.bank_account?.[acc.id]?.document}
                >
                  <DocumentInputBr
                    className={inputClass(
                      Boolean(errors.bank_account?.[acc.id]?.document),
                    )}
                    value={acc.document}
                    onChange={(v) => updateBankAccount(acc.id, { document: v })}
                  />
                </EntityFormField>
                <EntityFormField
                  label="Favorecido"
                  required
                  error={errors.bank_account?.[acc.id]?.favored}
                  className="contrato-criar-field--wide"
                >
                  <input
                    type="text"
                    className={inputClass(
                      Boolean(errors.bank_account?.[acc.id]?.favored),
                    )}
                    value={acc.favored}
                    onChange={(e) =>
                      updateBankAccount(acc.id, { favored: e.target.value })
                    }
                  />
                </EntityFormField>
                <EntityFormField label="Tipo PIX">
                  <Select
                    placeholder="Tipo"
                    options={[
                      { value: "", label: "Nenhum" },
                      ...PIX_TYPE_OPTIONS,
                    ]}
                    value={acc.pix_type}
                    onChange={(e) =>
                      updateBankAccount(acc.id, {
                        pix_type: e.target.value as ProprietarioBankAccount["pix_type"],
                      })
                    }
                  />
                </EntityFormField>
                <EntityFormField label="Chave PIX">
                  <PixKeyInputBr
                    value={acc.pix_key}
                    onChange={(v) => updateBankAccount(acc.id, { pix_key: v })}
                  />
                </EntityFormField>
                <EntityFormField label="Conta principal" className="contrato-criar-field--wide">
                  <Checkbox
                    label="Usar como conta principal"
                    checked={acc.main}
                    onChange={(e) =>
                      updateBankAccount(acc.id, { main: e.target.checked })
                    }
                  />
                </EntityFormField>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="entity-form-repeater__add"
            onClick={addBankAccount}
          >
            <Plus size={16} aria-hidden />
            Adicionar conta bancária
          </button>
        </div>
      </FormSection>
    </form>
  );
}
