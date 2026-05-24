"use client";

import { Pencil } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import {
  isGrupoIcon,
  isGrupoImage,
  type AnuncioExemplo,
  type Grupo,
} from "@/lib/dashboards/agrupamentos/types";
import { AnuncioImage, GrupoIcon } from "./GrupoVisual";

type AnuncioPreviewProps = {
  anuncio: AnuncioExemplo;
  gruposSelecionados: Grupo[];
  onEdit: () => void;
};

export function AnuncioPreview({
  anuncio,
  gruposSelecionados,
  onEdit,
}: AnuncioPreviewProps) {
  return (
    <article className="agrupamentos-anuncio">
      <div className="agrupamentos-anuncio__media">
        <AnuncioImage src={anuncio.imageUrl} alt={anuncio.titulo} />
        <button
          type="button"
          className="agrupamentos-anuncio__edit"
          onClick={onEdit}
          aria-label="Editar anúncio de exemplo"
        >
          <Pencil size={16} />
        </button>
      </div>

      <div className="agrupamentos-anuncio__body">
        {gruposSelecionados.length > 0 ? (
          <div className="agrupamentos-anuncio__chips" aria-label="Agrupamentos">
            {gruposSelecionados.map((grupo) => (
              <Chip
                key={grupo.id}
                backgroundColor={grupo.corFundo}
                borderColor={grupo.corBorda}
                textColor={grupo.corTexto}
                icon={
                  isGrupoIcon(grupo) ? (
                    <GrupoIcon
                      visualValue={grupo.visualValue}
                      size={16}
                      color={grupo.corIcone}
                    />
                  ) : undefined
                }
                iconColor={grupo.corIcone}
                avatarSrc={isGrupoImage(grupo) ? grupo.visualValue : undefined}
                avatarAlt={grupo.nome}
              >
                {grupo.nome}
              </Chip>
            ))}
          </div>
        ) : null}

        <p className="agrupamentos-anuncio__tipo">{anuncio.tipo}</p>
        <h3 className="agrupamentos-anuncio__titulo">{anuncio.titulo}</h3>
        <p className="agrupamentos-anuncio__endereco">{anuncio.endereco}</p>
        <p className="agrupamentos-anuncio__bairro">{anuncio.bairro}</p>

        <ul className="agrupamentos-anuncio__meta">
          <li>{anuncio.quartos} quartos</li>
          <li>{anuncio.banheiros} banheiros</li>
          <li>{anuncio.vagas} vaga{anuncio.vagas !== 1 ? "s" : ""}</li>
          <li>{anuncio.areaM2} m²</li>
        </ul>

        <p className="agrupamentos-anuncio__descricao">{anuncio.descricao}</p>
        <p className="agrupamentos-anuncio__preco">{anuncio.preco}</p>
      </div>
    </article>
  );
}
