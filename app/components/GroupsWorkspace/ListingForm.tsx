"use client";

import type { ListingExample } from "@/lib/dashboards/groups/types";

type ListingFormProps = {
  values: ListingExample;
  onChange: (values: ListingExample) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function ListingForm({
  values,
  onChange,
  onSubmit,
  onCancel,
}: ListingFormProps) {
  function patch(partial: Partial<ListingExample>) {
    onChange({ ...values, ...partial });
  }

  return (
    <form
      className="groups-form groups-form--scroll"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <header className="groups-form__header">
        <h2 className="groups-form__title">Editar anúncio de exemplo</h2>
        <button
          type="button"
          className="agrupamentos-btn agrupamentos-btn--ghost agrupamentos-btn--sm"
          onClick={onCancel}
        >
          Fechar
        </button>
      </header>

      <div className="groups-form__body">
        <label className="groups-field">
          <span className="groups-field__label">Título</span>
          <input
            type="text"
            className="agrupamentos-input"
            value={values.title}
            onChange={(e) => patch({ title: e.target.value })}
          />
        </label>

        <label className="groups-field">
          <span className="groups-field__label">Descrição</span>
          <textarea
            className="agrupamentos-input agrupamentos-textarea"
            value={values.description}
            onChange={(e) => patch({ description: e.target.value })}
            rows={3}
          />
        </label>

        <label className="groups-field">
          <span className="groups-field__label">Preço (texto)</span>
          <input
            type="text"
            className="agrupamentos-input"
            value={values.price}
            onChange={(e) => patch({ price: e.target.value })}
          />
        </label>

        <label className="groups-field">
          <span className="groups-field__label">URL da imagem</span>
          <input
            type="url"
            className="agrupamentos-input"
            value={values.imageUrl}
            onChange={(e) => patch({ imageUrl: e.target.value })}
            placeholder="https://…"
          />
        </label>

        <label className="groups-field">
          <span className="groups-field__label">Endereço</span>
          <input
            type="text"
            className="agrupamentos-input"
            value={values.address}
            onChange={(e) => patch({ address: e.target.value })}
          />
        </label>

        <label className="groups-field">
          <span className="groups-field__label">Bairro / cidade</span>
          <input
            type="text"
            className="agrupamentos-input"
            value={values.neighborhood}
            onChange={(e) => patch({ neighborhood: e.target.value })}
          />
        </label>

        <label className="groups-field">
          <span className="groups-field__label">Tipo</span>
          <input
            type="text"
            className="agrupamentos-input"
            value={values.propertyType}
            onChange={(e) => patch({ propertyType: e.target.value })}
          />
        </label>

        <div className="groups-form__row">
          <label className="groups-field">
            <span className="groups-field__label">Quartos</span>
            <input
              type="number"
              min={0}
              className="agrupamentos-input"
              value={values.bedrooms}
              onChange={(e) => patch({ bedrooms: Number(e.target.value) || 0 })}
            />
          </label>
          <label className="groups-field">
            <span className="groups-field__label">Banheiros</span>
            <input
              type="number"
              min={0}
              className="agrupamentos-input"
              value={values.bathrooms}
              onChange={(e) =>
                patch({ bathrooms: Number(e.target.value) || 0 })
              }
            />
          </label>
        </div>

        <div className="groups-form__row">
          <label className="groups-field">
            <span className="groups-field__label">Vagas</span>
            <input
              type="number"
              min={0}
              className="agrupamentos-input"
              value={values.parkingSpots}
              onChange={(e) => patch({ parkingSpots: Number(e.target.value) || 0 })}
            />
          </label>
          <label className="groups-field">
            <span className="groups-field__label">Área (m²)</span>
            <input
              type="number"
              min={0}
              className="agrupamentos-input"
              value={values.areaSqm}
              onChange={(e) => patch({ areaSqm: Number(e.target.value) || 0 })}
            />
          </label>
        </div>
      </div>

      <footer className="groups-form__footer">
        <button type="submit" className="agrupamentos-btn agrupamentos-btn--primary">
          Salvar anúncio
        </button>
      </footer>
    </form>
  );
}
