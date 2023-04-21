import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    name: string
    id: string
  }

const initialState: UserState = {
    name: "",
    id: ""
  }

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        update: (state, action: PayloadAction<UserState>) => {
            state.id = action.payload.id,
            state.name = action.payload.name
        }
    },
  })
  
  export const { update } = userSlice.actions
  
  export default userSlice.reducer