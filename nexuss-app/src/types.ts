export type AssistantMode =
  | 'balanced'
  | 'casual'
  | 'teen'
  | 'professional'
  | 'tutor'
  | 'creative';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  pinned: boolean;
  mode: AssistantMode;
  messages: ChatMessage[];
  updatedAt: string;
}

export const MODE_DESCRIPTIONS: Record<
  AssistantMode,
  { label: string; summary: string }
> = {
  balanced: {
    label: 'Balanced',
    summary: 'Clear, grounded, and adaptable for everyday tasks.',
  },
  casual: {
    label: 'Casual',
    summary: 'Warm, conversational, and easygoing.',
  },
  teen: {
    label: 'Teen-style',
    summary: 'Relaxed, natural, and direct without forced slang.',
  },
  professional: {
    label: 'Professional',
    summary: 'Structured, polished, and concise.',
  },
  tutor: {
    label: 'Tutor',
    summary: 'Step-by-step explanations that help you learn.',
  },
  creative: {
    label: 'Creative',
    summary: 'Expressive brainstorming and original angles.',
  },
};