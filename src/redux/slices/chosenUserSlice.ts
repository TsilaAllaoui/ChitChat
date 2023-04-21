import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInFirebase } from '../../components/Models';

const initialState = {
    chosenUser: {
        name: "",
        email: "",
        id: ""
    }
  }

export const chosenUserSlice = createSlice({
    name: 'chosenUser',
    initialState,
    reducers: {
        updateChosenUser: (state, action: PayloadAction<UserInFirebase>) => {
            state.chosenUser.name = action.payload.name,
            state.chosenUser.email = action.payload.email,
            state.chosenUser.id = action.payload.id
        }
    },
  })
  
  export const { updateChosenUser } = chosenUserSlice.actions
  
  export default chosenUserSlice.reducer