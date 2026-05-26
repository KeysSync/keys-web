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
    foto: "https://i.pinimg.com/736x/2b/44/91/2b4491cd847fd56bb48aa4523d5021ee.jpg",
    perfil: "admin",
    status: "ativo",
    dataCriacao: "12/01/2024",
  },
  {
    id: "2",
    nome: "Carlos Mendes",
    email: "carlos.mendes@imobkeys.com",
    foto: "https://i.pinimg.com/736x/06/2f/cb/062fcb97c6e96a45f3aa17eee74d43af.jpg",
    perfil: "gerente",
    status: "ativo",
    dataCriacao: "18/02/2024",
  },
  {
    id: "3",
    nome: "Juliana Ribeiro",
    email: "juliana.ribeiro@imobkeys.com",
    foto: "https://i.pinimg.com/736x/d2/d5/b2/d2d5b2f4ef0e0c07c6e38ecde9739891.jpg",
    perfil: "corretor",
    status: "ativo",
    dataCriacao: "03/03/2024",
  },
  {
    id: "4",
    nome: "Roberto Lima",
    email: "roberto.lima@imobkeys.com",
    foto: "https://i.pinimg.com/736x/d5/78/c1/d578c17bd5ce4c0f69851c53ed7a813d.jpg",
    perfil: "financeiro",
    status: "ativo",
    dataCriacao: "22/04/2024",
  },
  {
    id: "5",
    nome: "Fernanda Costa",
    email: "fernanda.costa@imobkeys.com",
    foto: "https://i.pinimg.com/736x/e1/db/68/e1db68092b13d5a8e05b65a1ffda2c54.jpg",
    perfil: "corretor",
    status: "inativo",
    dataCriacao: "09/06/2024",
  },
  {
    id: "6",
    nome: "Marcos Oliveira",
    email: "marcos.oliveira@imobkeys.com",
    foto: "https://i.pinimg.com/736x/48/0b/9f/480b9faa0a0954ecc5352366e2902761.jpg",
    perfil: "corretor",
    status: "inativo",
    dataCriacao: "14/08/2023",
  },
];
