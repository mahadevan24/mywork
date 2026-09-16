export type Priority = 'urgent' | 'high' | 'normal' | 'low';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  priority?: Priority;
  subtasks?: SubTask[];
  tags?: string[];
  notes?: string;
  createdAt: number;
  completedAt?: number;
}

export interface SectionTopic {
  id: string;
  title: string;
  order: number;
  color?: string;
  description?: string;
  tasks: TaskItem[];
  notes?: string;
  isCollapsed?: boolean;
  isPinned?: boolean;
  createdAt: number;
}

export interface WorkpadState {
  quickTodos: TaskItem[];
  sections: SectionTopic[];
  lastUpdated: number;
}

export interface FirebaseSettings {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}
