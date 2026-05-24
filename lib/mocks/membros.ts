export type MembroPerfil = "admin" | "gerente" | "corretor" | "financeiro";

export type MembroStatus = "ativo" | "inativo";

export type Membro = {
  id: string;
  nome: string;
  email: string;
  foto: string;
  perfil: MembroPerfil;
  status: MembroStatus;
  dataCriacao: string;
};

export const perfilLabel: Record<MembroPerfil, string> = {
  admin: "Administrador",
  gerente: "Gerente",
  corretor: "Corretor",
  financeiro: "Financeiro",
};

export const statusLabel: Record<MembroStatus, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
};

export const mockMembros: Membro[] = [
  {
    id: "1",
    nome: "Ana Paula Souza",
    email: "ana.souza@imobkeys.com",
    foto: "https://i.pravatar.cc/150?img=5",
    perfil: "admin",
    status: "ativo",
    dataCriacao: "12/01/2024",
  },
  {
    id: "2",
    nome: "Carlos Mendes",
    email: "carlos.mendes@imobkeys.com",
    foto: "https://i.pravatar.cc/150?img=12",
    perfil: "gerente",
    status: "ativo",
    dataCriacao: "18/02/2024",
  },
  {
    id: "3",
    nome: "Juliana Ribeiro",
    email: "juliana.ribeiro@imobkeys.com",
    foto: "https://i.pravatar.cc/150?img=32",
    perfil: "corretor",
    status: "ativo",
    dataCriacao: "03/03/2024",
  },
  {
    id: "4",
    nome: "Roberto Lima",
    email: "roberto.lima@imobkeys.com",
    foto: "https://i.pravatar.cc/150?img=15",
    perfil: "financeiro",
    status: "ativo",
    dataCriacao: "22/04/2024",
  },
  {
    id: "5",
    nome: "Fernanda Costa",
    email: "fernanda.costa@imobkeys.com",
    foto: "https://i.pravatar.cc/150?img=47",
    perfil: "corretor",
    status: "inativo",
    dataCriacao: "09/06/2024",
  },
  {
    id: "6",
    nome: "Marcos Oliveira",
    email: "marcos.oliveira@imobkeys.com",
    foto: "https://i.pravatar.cc/150?img=68",
    perfil: "corretor",
    status: "inativo",
    dataCriacao: "14/08/2023",
  },
];
