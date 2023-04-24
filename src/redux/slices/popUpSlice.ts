import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
    popUpShown: false
  }

export const popUpSlice = createSlice({
    name: 'popUp',
    initialState,
    reducers: {
        set: (state, action: PayloadAction<boolean>) => {
            state.popUpShown = action.payload
        }
    },
  })
  
  export const { set } = popUpSlice.actions
  
  export default popUpSlice.reducer