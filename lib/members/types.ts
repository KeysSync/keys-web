export type MemberRole = 'admin' | 'manager' | 'broker' | 'finance'

export type MemberStatus = 'active' | 'inactive'

export type Member = {
  id: string
  name: string
  email: string
  photo: string
  role: MemberRole
  status: MemberStatus
  createdAt: string
}

export const roleLabel: Record<MemberRole, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  broker: 'Corretor',
  finance: 'Financeiro',
}

export const statusLabel: Record<MemberStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
}
