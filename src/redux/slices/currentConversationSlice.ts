import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    id: ""
  }

export const currentConversationSlice = createSlice({
    name: 'currentConversation',
    initialState,
    reducers: {
        setCurrentConvId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        }
    },
  })
  
  export const { setCurrentConvId } = currentConversationSlice.actions
  
  export default currentConversationSlice.reducer