'use client'

import { CriarProprietarioWizard } from '@/app/components/CriarProprietarioWizard/CriarProprietarioWizard'
import { mockProprietarios } from '@/lib/mocks/proprietarios'
import {
  createBankAccount,
  createTelefone,
} from '@/lib/proprietarios/form'
import type { ProprietarioFormData } from '@/lib/proprietarios/types'
import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'

function mapToFormData(
  p: (typeof mockProprietarios)[number],
): ProprietarioFormData {
  return {
    type: p.tipo === 'pf' ? 'person' : 'enterprise',
    name: p.nome,
    email: p.email,
    document: p.documento,
    rg: '',
    rg_origin: '',
    birthdate: '',
    nationality: '',
    place_of_birth: '',
    civil_status: '',
    marriage_regime: '',
    occupation: '',
    partner: '',
    telefones: [{ ...createTelefone(), number: p.telefone }],
    postal_code: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    bank_account: [createBankAccount(p.nome)],
  }
}

export default function EditarProprietarioPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const proprietario = useMemo(
    () => mockProprietarios.find((p) => p.id === params.id),
    [params.id],
  )

  if (!proprietario) {
    router.push('/imoveis/proprietarios')
    return null
  }

  const initialData = mapToFormData(proprietario)

  return (
    <CriarProprietarioWizard
      mode="edit"
      initialData={initialData}
      proprietarioId={proprietario.id}
    />
  )
}
