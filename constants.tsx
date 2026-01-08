
import { User, UserRole, Poll, Announcement, OperationalTask } from './types';

export const MOCK_USERS: User[] = [
  { id: 'admin-fluxibi', name: 'Admin Fluxibi', unit: 'Gestão Central', role: UserRole.SINDICO },
  { id: '1', name: 'Ricardo Silva', unit: '101A', role: UserRole.MORADOR },
  { id: '2', name: 'Ana Oliveira', unit: 'ADM', role: UserRole.SINDICO },
  { id: '3', name: 'Carlos Santos', unit: 'Portaria Central', role: UserRole.PORTARIA },
  { id: '4', name: 'Marcos Lima', unit: 'Operacional', role: UserRole.MANUTENCAO },
];

export const MOCK_POLLS: Poll[] = [
  {
    id: 'p1',
    title: 'Pintura da Fachada 2024',
    description: 'Escolha a paleta de cores para a nova fachada do condomínio.',
    options: [
      { id: 'o1', text: 'Bege e Marrom', votes: 12 },
      { id: 'o2', text: 'Cinza e Branco', votes: 25 },
      { id: 'o3', text: 'Azul Pastel', votes: 5 }
    ],
    votedUnits: ['101A', '202B'],
    endDate: new Date('2024-12-31'),
    active: true
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Assembleia Geral Ordinária',
    content: 'Convocamos todos os moradores para a assembleia no dia 15/11 no salão de festas.',
    category: 'Assembleia',
    author: 'Síndico',
    date: new Date()
  },
  {
    id: 'a2',
    title: 'Venda de Bicicleta Aro 29',
    content: 'Estou vendendo minha bike semi-nova. Interessados tratar no apt 304.',
    category: 'Brechó',
    author: 'Morador Apt 304',
    date: new Date()
  }
];

export const MOCK_TASKS: OperationalTask[] = [
  {
    id: 't1',
    type: 'Manutenção',
    priority: 'Alta',
    description: 'Lâmpada queimada no corredor do 3º andar Bloco B',
    status: 'Aberto',
    createdAt: new Date()
  }
];
