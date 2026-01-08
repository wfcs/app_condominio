
export enum UserRole {
  MORADOR = 'Morador',
  SINDICO = 'Síndico',
  PORTARIA = 'Portaria',
  MANUTENCAO = 'Manutenção'
}

export interface User {
  id: string;
  name: string;
  unit: string; // e.g., "Apt 101"
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
  votedUnits: string[]; // List of unit IDs that already voted
  endDate: Date;
  active: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Assembleia' | 'Comunicado' | 'Evento' | 'Brechó' | 'Social';
  author: string;
  date: Date;
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
