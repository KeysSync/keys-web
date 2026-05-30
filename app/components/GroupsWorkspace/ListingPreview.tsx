"use client";

import { Pencil } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import {
  isGroupIcon,
  isGroupImage,
  type ListingExample,
  type Group,
} from "@/lib/dashboards/groups/types";
import { ListingImage, GroupIcon } from "./GroupVisual";

type ListingPreviewProps = {
  listing: ListingExample;
  groupsSelected: Group[];
  onEdit: () => void;
};

export function ListingPreview({
  listing,
  groupsSelected,
  onEdit,
}: ListingPreviewProps) {
  return (
    <article className="groups-listing">
      <div className="groups-listing__media">
        <ListingImage src={listing.imageUrl} alt={listing.title} />
        <button
          type="button"
          className="groups-listing__edit"
          onClick={onEdit}
          aria-label="Editar anúncio de exemplo"
        >
          <Pencil size={16} />
        </button>
      </div>

      <div className="groups-listing__body">
        {groupsSelected.length > 0 ? (
          <div className="groups-listing__chips" aria-label="Agrupamentos">
            {groupsSelected.map((group) => (
              <Chip
                key={group.id}
                backgroundColor={group.backgroundColor}
                borderColor={group.borderColor}
                textColor={group.textColor}
                icon={
                  isGroupIcon(group) ? (
                    <GroupIcon
                      visualValue={group.visualValue}
                      size={16}
                      color={group.iconColor}
                    />
                  ) : undefined
                }
                iconColor={group.iconColor}
                avatarSrc={isGroupImage(group) ? group.visualValue : undefined}
                avatarAlt={group.name}
              >
                {group.name}
              </Chip>
            ))}
          </div>
        ) : null}

        <p className="groups-listing__type">{listing.propertyType}</p>
        <h3 className="groups-listing__title">{listing.title}</h3>
        <p className="groups-listing__address">{listing.address}</p>
        <p className="groups-listing__neighborhood">{listing.neighborhood}</p>

        <ul className="groups-listing__meta">
          <li>{listing.bedrooms} quartos</li>
          <li>{listing.bathrooms} banheiros</li>
          <li>{listing.parkingSpots} vaga{listing.parkingSpots !== 1 ? "s" : ""}</li>
          <li>{listing.areaSqm} m²</li>
        </ul>

        <p className="groups-listing__description">{listing.description}</p>
        <p className="groups-listing__price">{listing.price}</p>
      </div>
    </article>
  );
}
