'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function ContratoCriarError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="contract-create-error">
      <h2 className="contract-create-error__title">Não foi possível carregar o assistente</h2>
      <p className="contract-create-error__desc">
        Ocorreu um erro inesperado. Você pode tentar novamente ou voltar para a lista de
        contratos.
      </p>
      <div className="contract-create-error__actions">
        <button type="button" className="contract-create-error__btn" onClick={reset}>
          Tentar novamente
        </button>
        <Link href="/locacao/contratos" className="contract-create-error__link">
          Voltar para contratos
        </Link>
      </div>
    </div>
  )
}
