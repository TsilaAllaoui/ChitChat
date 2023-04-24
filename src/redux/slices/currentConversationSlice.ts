import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Conversation {
  id: string,
  guestName: string,
  hostId: string
}

const initialState = {
    id: "",
    guestName: "",
    hostId: ""
  }

export const currentConversationSlice = createSlice({
    name: 'currentConversation',
    initialState,
    reducers: {
        setCurrentConv: (state, action: PayloadAction<Conversation>) => {
            state.id = action.payload.id,
            state.guestName = action.payload.guestName,
            state.hostId = action.payload.hostId
        }
    },
  })
  
  export const { setCurrentConv } = currentConversationSlice.actions
  
  export default currentConversationSlice.reducer