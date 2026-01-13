
export enum UserRole {
  MORADOR = 'Morador',
  SINDICO = 'Síndico',
  PORTARIA = 'Portaria',
  MANUTENCAO = 'Manutenção'
}

export interface CondoClient {
  id: string; 
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  unit: string;
  role: UserRole;
  clientId: string;
}

export interface Visitor {
  id: string;
  name: string;
  entryDate: Date;
  exitDate: Date | null;
  vehiclePlate?: string;
  vehicleType?: string;
  unitVisited: string;
  authorizedBy: string;
  clientId: string;
}

export interface Notification {
  id: string;
  unitId: string;
  clientId: string;
  type: 'entrega' | 'visitante';
  description: string;
  timestamp: Date;
  photoUrl?: string;
  status: 'pendente' | 'recebido';
}

export interface Poll {
  id: string;
  clientId: string;
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
  clientId: string;
  title: string;
  content: string;
  category: 'Assembleia' | 'Comunicado' | 'Evento' | 'Brechó' | 'Social';
  author: string;
  authorId: string;
  date: Date;
  likes: string[];
  comments: Comment[];
  attachments?: string[];
}

export interface OperationalTask {
  id: string;
  clientId: string;
  type: 'Compra' | 'Manutenção';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  description: string;
  status: 'Aberto' | 'Em Andamento' | 'Resolvido';
  assignedTo?: string;
  createdAt: Date;
}
