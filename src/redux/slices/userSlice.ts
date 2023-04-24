import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    name: string,
    id: string,
    initials: string
  }

const initialState: UserState = {
    name: "",
    id: "",
    initials: ""
  }

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        update: (state, action: PayloadAction<UserState>) => {
            state.id = action.payload.id,
            state.name = action.payload.name
            state.initials = action.payload.initials == undefined ? "" : action.payload.initials
        }
    },
  })
  
  export const { update } = userSlice.actions
  
  export default userSlice.reducer