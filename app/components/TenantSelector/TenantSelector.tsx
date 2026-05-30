"use client";

import type { OrganizationTenant } from "@/lib/tenants/org-types";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./style.css";

type TenantSelectorProps = {
  tenants?: OrganizationTenant[];
  defaultTenantId?: string;
  onTenantChange?: (tenant: OrganizationTenant) => void;
};

function TenantBrand({ tenant }: { tenant: OrganizationTenant }) {
  if (tenant.imageUrl) {
    return (
      <span className="tenant-selector__brand tenant-selector__brand--image" aria-hidden>
        <img src={tenant.imageUrl} alt="" />
      </span>
    );
  }

  return (
    <span
      className="tenant-selector__brand"
      style={{ backgroundColor: tenant.brandColor }}
      aria-hidden
    >
      {tenant.initials}
    </span>
  );
}

export function TenantSelector({
  tenants = [],
  defaultTenantId,
  onTenantChange,
}: TenantSelectorProps) {
  const [activeTenantId, setActiveTenantId] = useState(
    defaultTenantId ?? tenants[0]?.id ?? "",
  );
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const activeTenant =
    tenants.find((tenant) => tenant.id === activeTenantId) ?? tenants[0];
  const hasMultipleTenants = tenants.length > 1;
  const otherTenants = tenants.filter((tenant) => tenant.id !== activeTenant?.id);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const selectTenant = (tenant: OrganizationTenant) => {
    setActiveTenantId(tenant.id);
    setOpen(false);
    onTenantChange?.(tenant);
  };

  if (!activeTenant) return null;

  if (!hasMultipleTenants) {
    return (
      <div className="tenant-selector tenant-selector--static">
        <div className="tenant-selector__trigger tenant-selector__trigger--static">
          <TenantBrand tenant={activeTenant} />
          <span className="tenant-selector__name">{activeTenant.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`tenant-selector${open ? " tenant-selector--open" : ""}`}
    >
      <button
        type="button"
        className="tenant-selector__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Tenant ativo: ${activeTenant.name}. Trocar tenant.`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <TenantBrand tenant={activeTenant} />
        <span className="tenant-selector__name">{activeTenant.name}</span>
        <ChevronDown
          size={16}
          className="tenant-selector__caret"
          aria-hidden
        />
      </button>

      {open ? (
        <div className="tenant-selector__menu" role="listbox" aria-label="Tenants">
          <ul className="tenant-selector__list">
            {otherTenants.map((tenant) => (
              <li key={tenant.id}>
                <button
                  type="button"
                  className="tenant-selector__option"
                  role="option"
                  onClick={() => selectTenant(tenant)}
                >
                  <TenantBrand tenant={tenant} />
                  <span className="tenant-selector__name">{tenant.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
