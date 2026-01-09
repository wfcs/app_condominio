
export enum UserRole {
  MORADOR = 'Morador',
  SINDICO = 'Síndico',
  PORTARIA = 'Portaria',
  MANUTENCAO = 'Manutenção'
}

export interface User {
  id: string;
  name: string;
  unit: string;
  role: UserRole;
}

export interface Notification {
  id: string;
  unitId: string;
  type: 'entrega' | 'visitante';
  description: string;
  timestamp: Date;
  photoUrl?: string;
  status: 'pendente' | 'recebido';
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: { id: string; text: string; votes: number }[];
  votedUnits: string[];
  endDate: Date;
  active: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Assembleia' | 'Comunicado' | 'Evento' | 'Brechó' | 'Social';
  author: string;
  authorId: string;
  date: Date;
  likes: string[]; // Array of User IDs
  comments: Comment[];
  attachments?: string[];
}

export interface OperationalTask {
  id: string;
  type: 'Compra' | 'Manutenção';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  description: string;
  status: 'Aberto' | 'Em Andamento' | 'Resolvido';
  assignedTo?: string;
  createdAt: Date;
}
