import {
  configureStore,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { Message } from './events.js';

const chat = createSlice({
  name: 'chat',
  initialState: { messages: [] as Message[], online: 0 },
  reducers: {
    historyReceived(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    messageReceived(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
      if (state.messages.length > 100) state.messages.shift();
    },
    presenceReceived(state, action: PayloadAction<number>) {
      state.online = action.payload;
    },
  },
});

export const { historyReceived, messageReceived, presenceReceived } =
  chat.actions;
export const createDemoStore = () =>
  configureStore({ reducer: { chat: chat.reducer } });
export type DemoState = ReturnType<
  ReturnType<typeof createDemoStore>['getState']
>;
