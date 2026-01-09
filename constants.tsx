
import { User, UserRole, CondoClient, Poll, Announcement, OperationalTask } from './types';

export const MOCK_CLIENTS: CondoClient[] = [
  { id: 'client-1', name: 'Residencial Solar das Palmeiras' },
  { id: 'client-2', name: 'Edifício Blue Sky' },
  { id: 'client-global', name: 'Fluxibi Master Admin' }
];

export const MOCK_USERS: User[] = [
  { id: 'admin-fluxibi', name: 'Admin Fluxibi', email: 'adm@fluxibi.com.br', unit: 'Gestão Central', role: UserRole.SINDICO, clientId: 'client-global' },
  { id: '1', name: 'Ricardo Silva', email: 'ricardo@exemplo.com', unit: '101A', role: UserRole.MORADOR, clientId: 'client-1' },
  { id: '2', name: 'Ana Oliveira', email: 'ana@exemplo.com', unit: 'ADM', role: UserRole.SINDICO, clientId: 'client-1' },
  { id: '3', name: 'Carlos Santos', email: 'carlos@exemplo.com', unit: 'Portaria Central', role: UserRole.PORTARIA, clientId: 'client-1' },
  { id: '4', name: 'Marcos Lima', email: 'marcos@exemplo.com', unit: 'Operacional', role: UserRole.MANUTENCAO, clientId: 'client-1' },
  { id: '5', name: 'Dono do Apartamento', email: 'dono@condo2.com', unit: '202B', role: UserRole.MORADOR, clientId: 'client-2' },
];

export const MOCK_POLLS: Poll[] = [
  {
    id: 'p1',
    clientId: 'client-1',
    title: 'Pintura da Fachada 2024',
    description: 'Escolha a paleta de cores para a nova fachada do condomínio.',
    options: [
      { id: 'o1', text: 'Bege e Marrom', votes: 12 },
      { id: 'o2', text: 'Cinza e Branco', votes: 25 },
      { id: 'o3', text: 'Azul Pastel', votes: 5 }
    ],
    votedUnits: ['101A'],
    endDate: new Date('2024-12-31'),
    active: true
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    clientId: 'client-1',
    title: 'Assembleia Geral Ordinária',
    content: 'Convocamos todos os moradores para a assembleia no dia 15/11 no salão de festas.',
    category: 'Assembleia',
    author: 'Síndico',
    authorId: '2',
    date: new Date(),
    likes: [],
    comments: []
  }
];

export const MOCK_TASKS: OperationalTask[] = [
  {
    id: 't1',
    clientId: 'client-1',
    type: 'Manutenção',
    priority: 'Alta',
    description: 'Lâmpada queimada no corredor do 3º andar Bloco B',
    status: 'Aberto',
    createdAt: new Date()
  }
];
