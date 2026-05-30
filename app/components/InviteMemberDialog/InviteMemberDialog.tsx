"use client";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SelectField } from "@/components/ui/select";
import type { Role } from "@/lib/roles/types";
import { Send } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

export type InviteMemberPayload = {
  email: string;
  role: Role;
};

type InviteMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles?: Role[];
  onSubmit?: (payload: InviteMemberPayload) => void;
};

export function InviteMemberDialog({
  open,
  onOpenChange,
  roles = [],
  onSubmit,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");

  const roleOptions = useMemo(
    () => roles.map((role) => ({ value: role.id, label: role.name })),
    [roles],
  );

  const resetForm = () => {
    setEmail("");
    setRoleId("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const role = roles.find((item) => item.id === roleId);
    if (!trimmedEmail || !role) return;

    onSubmit?.({ email: trimmedEmail, role });
    resetForm();
    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const canSubmit = Boolean(email.trim() && roleId);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidando novo membro</DialogTitle>
          <DialogDescription>
            Ao enviar o convite o usuário deve interagir com o link que ele
            receberá no email em até 15 minutos.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <label className="keys-dialog-field">
              <span className="keys-dialog-label">E-mail</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@imobiliaria.com"
                autoComplete="email"
                required
                className="keys-dialog-input"
              />
            </label>

            <SelectField
              label="Cargo"
              name="role"
              value={roleId}
              onChange={(event) => setRoleId(event.target.value)}
              placeholder="Selecione um cargo"
              options={roleOptions}
              required
              fieldClassName="keys-dialog-field"
              labelClassName="keys-dialog-label"
            />

            <button
              type="submit"
              className="keys-dialog-submit"
              disabled={!canSubmit}
            >
              <Send size={16} aria-hidden />
              Enviar
            </button>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
