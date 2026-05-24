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
import { mockCargos, type Cargo } from "@/lib/mocks/cargos";
import { Send } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

export type InviteMembroPayload = {
  email: string;
  cargo: Cargo;
};

type InviteMembroDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cargos?: Cargo[];
  onSubmit?: (payload: InviteMembroPayload) => void;
};

export function InviteMembroDialog({
  open,
  onOpenChange,
  cargos = mockCargos,
  onSubmit,
}: InviteMembroDialogProps) {
  const [email, setEmail] = useState("");
  const [cargoId, setCargoId] = useState("");

  const cargoOptions = useMemo(
    () => cargos.map((cargo) => ({ value: cargo.id, label: cargo.nome })),
    [cargos],
  );

  const resetForm = () => {
    setEmail("");
    setCargoId("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const cargo = cargos.find((item) => item.id === cargoId);
    if (!trimmedEmail || !cargo) return;

    onSubmit?.({ email: trimmedEmail, cargo });
    resetForm();
    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const canSubmit = Boolean(email.trim() && cargoId);

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
              name="cargo"
              value={cargoId}
              onChange={(event) => setCargoId(event.target.value)}
              placeholder="Selecione um cargo"
              options={cargoOptions}
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
