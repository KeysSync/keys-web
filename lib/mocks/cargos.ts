export type Cargo = {
  id: string;
  nome: string;
  descricao: string;
  membros: number;
};

export const mockCargos: Cargo[] = [
  {
    id: "1",
    nome: "Administrador",
    descricao: "Acesso total à plataforma e configurações da imobiliária.",
    membros: 1,
  },
  {
    id: "2",
    nome: "Gerente",
    descricao: "Gerencia equipe, contratos e relatórios operacionais.",
    membros: 1,
  },
  {
    id: "3",
    nome: "Corretor",
    descricao: "Cadastros, contratos e atendimento a clientes.",
    membros: 3,
  },
  {
    id: "4",
    nome: "Financeiro",
    descricao: "Lançamentos, boletos e conciliação financeira.",
    membros: 1,
  },
];
