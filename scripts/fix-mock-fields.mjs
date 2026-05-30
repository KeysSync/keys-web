#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const FIELD_MAP = [
  ['codigo:', 'code:'],
  ['logradouro:', 'street:'],
  ['titulo:', 'title:'],
  ['bairro:', 'neighborhood:'],
  ['cidade:', 'city:'],
  ['proprietarioNome:', 'ownerName:'],
  ['nome:', 'name:'],
  ['documento:', 'document:'],
  ['telefone:', 'phone:'],
  ['tipo:', 'type:'],
  ['contratoId:', 'contractId:'],
  ['inquilino:', 'tenant:'],
  ['proprietario:', 'owner:'],
  ['descricao:', 'description:'],
  ['valor:', 'amount:'],
  ['vencimento:', 'dueDate:'],
  ['pagoEm:', 'paidAt:'],
  ['  tipo: PropertyType', '  type: PropertyType'],
  ["OwnerListRow['tipo']", "OwnerListRow['type']"],
  ['const tipo:', 'const type:'],
  ['    tipo,', '    type,'],
  ['telefone: firstPhone', 'phone: firstPhone'],
]

const LABEL_MAP = [
  ['ENTRY_TIPO_LABEL', 'ENTRY_TYPE_LABEL'],
  ['  aluguel:', "  rent:"],
  ['  condominio:', "  condo:"],
  ['  agua:', "  water:"],
  ['  energia:', "  power:"],
  ['  taxa_adm:', "  admin_fee:"],
  ['  outro:', "  other:"],
  ['  pendente:', "  pending:"],
  ['  pago:', "  paid:"],
  ['  atrasado:', "  overdue:"],
  ['  cancelado:', "  cancelled:"],
]

const files = [
  'lib/mocks/properties.ts',
  'lib/mocks/owners.ts',
  'lib/mocks/renters.ts',
  'lib/mocks/entries.ts',
  'lib/owners/api.ts',
  'lib/tenants/api.ts',
]

for (const rel of files) {
  const file = path.join(ROOT, rel)
  let c = fs.readFileSync(file, 'utf8')
  for (const [a, b] of [...FIELD_MAP, ...LABEL_MAP]) {
    c = c.split(a).join(b)
  }
  fs.writeFileSync(file, c)
  console.log('fixed', rel)
}
