export interface Message {
  id: string;
  text: string;
  sender: string;
}

export type SendResult =
  { ok: true; id: string } | { ok: false; error: string };

export interface ServerEvents {
  history: (messages: Message[]) => void;
  message: (message: Message) => void;
  presence: (count: number) => void;
}

export interface ClientEvents {
  'chat:send': (
    text: string,
    acknowledge: (result: SendResult) => void,
  ) => void;
}
