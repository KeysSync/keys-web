export interface MockUser {
  id: string
  nome: string
  email: string
  password: string
}

/** Usuários fake só para desenvolvimento (login mock). */
export const mockUsers: MockUser[] = [
  {
    id: 'u1',
    nome: 'Gestor Demo',
    email: 'gestor@imobkeys.app',
    password: '123456',
  },
  {
    id: 'u2',
    nome: 'Financeiro Demo',
    email: 'financeiro@keys.app',
    password: '123456',
  },
  {
    id: 'u3',
    nome: 'Corretor Demo',
    email: 'corretor@keys.app',
    password: '123456',
  },
]

export function findMockUser(email: string, password: string): MockUser | null {
  const normalized = email.trim().toLowerCase()
  return (
    mockUsers.find(
      (u) => u.email.toLowerCase() === normalized && u.password === password,
    ) ?? null
  )
}
