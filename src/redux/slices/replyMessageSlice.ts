import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInFirebase } from '../../components/Models';

interface Reply {
    message: string,
    senderName: string
};

const initialState = {
    replyMessage: {
        message: "",
        senderName: "",
    }
  }

export const replyMessageSlice = createSlice({
    name: 'replyMessage',
    initialState,
    reducers: {
        updateReplyMessage: (state, action: PayloadAction<Reply>) => {
            state.replyMessage.message = action.payload.message,
            state.replyMessage.senderName = action.payload.senderName
        }
    },
  })
  
export type { Reply }

  export const { updateReplyMessage } = replyMessageSlice.actions
  
  export default replyMessageSlice.reducer