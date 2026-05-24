"use client";

import type { AnuncioExemplo } from "@/lib/dashboards/agrupamentos/types";

type AnuncioFormProps = {
  values: AnuncioExemplo;
  onChange: (values: AnuncioExemplo) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function AnuncioForm({
  values,
  onChange,
  onSubmit,
  onCancel,
}: AnuncioFormProps) {
  function patch(partial: Partial<AnuncioExemplo>) {
    onChange({ ...values, ...partial });
  }

  return (
    <form
      className="agrupamentos-form agrupamentos-form--scroll"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <header className="agrupamentos-form__header">
        <h2 className="agrupamentos-form__title">Editar anúncio de exemplo</h2>
        <button
          type="button"
          className="agrupamentos-btn agrupamentos-btn--ghost agrupamentos-btn--sm"
          onClick={onCancel}
        >
          Fechar
        </button>
      </header>

      <div className="agrupamentos-form__body">
        <label className="agrupamentos-field">
          <span className="agrupamentos-field__label">Título</span>
          <input
            type="text"
            className="agrupamentos-input"
            value={values.titulo}
            onChange={(e) => patch({ titulo: e.target.value })}
          />
        </label>

        <label className="agrupamentos-field">
          <span className="agrupamentos-field__label">Descrição</span>
          <textarea
            className="agrupamentos-input agrupamentos-textarea"
            value={values.descricao}
            onChange={(e) => patch({ descricao: e.target.value })}
            rows={3}
          />
        </label>

        <label className="agrupamentos-field">
          <span className="agrupamentos-field__label">Preço (texto)</span>
          <input
            type="text"
            className="agrupamentos-input"
            value={values.preco}
            onChange={(e) => patch({ preco: e.target.value })}
          />
        </label>

        <label className="agrupamentos-field">
          <span className="agrupamentos-field__label">URL da imagem</span>
          <input
            type="url"
            className="agrupamentos-input"
            value={values.imageUrl}
            onChange={(e) => patch({ imageUrl: e.target.value })}
            placeholder="https://…"
          />
        </label>

        <label className="agrupamentos-field">
          <span className="agrupamentos-field__label">Endereço</span>
          <input
            type="text"
            className="agrupamentos-input"
            value={values.endereco}
            onChange={(e) => patch({ endereco: e.target.value })}
          />
        </label>

        <label className="agrupamentos-field">
          <span className="agrupamentos-field__label">Bairro / cidade</span>
          <input
            type="text"
            className="agrupamentos-input"
            value={values.bairro}
            onChange={(e) => patch({ bairro: e.target.value })}
          />
        </label>

        <label className="agrupamentos-field">
          <span className="agrupamentos-field__label">Tipo</span>
          <input
            type="text"
            className="agrupamentos-input"
            value={values.tipo}
            onChange={(e) => patch({ tipo: e.target.value })}
          />
        </label>

        <div className="agrupamentos-form__row">
          <label className="agrupamentos-field">
            <span className="agrupamentos-field__label">Quartos</span>
            <input
              type="number"
              min={0}
              className="agrupamentos-input"
              value={values.quartos}
              onChange={(e) => patch({ quartos: Number(e.target.value) || 0 })}
            />
          </label>
          <label className="agrupamentos-field">
            <span className="agrupamentos-field__label">Banheiros</span>
            <input
              type="number"
              min={0}
              className="agrupamentos-input"
              value={values.banheiros}
              onChange={(e) =>
                patch({ banheiros: Number(e.target.value) || 0 })
              }
            />
          </label>
        </div>

        <div className="agrupamentos-form__row">
          <label className="agrupamentos-field">
            <span className="agrupamentos-field__label">Vagas</span>
            <input
              type="number"
              min={0}
              className="agrupamentos-input"
              value={values.vagas}
              onChange={(e) => patch({ vagas: Number(e.target.value) || 0 })}
            />
          </label>
          <label className="agrupamentos-field">
            <span className="agrupamentos-field__label">Área (m²)</span>
            <input
              type="number"
              min={0}
              className="agrupamentos-input"
              value={values.areaM2}
              onChange={(e) => patch({ areaM2: Number(e.target.value) || 0 })}
            />
          </label>
        </div>
      </div>

      <footer className="agrupamentos-form__footer">
        <button type="submit" className="agrupamentos-btn agrupamentos-btn--primary">
          Salvar anúncio
        </button>
      </footer>
    </form>
  );
}
