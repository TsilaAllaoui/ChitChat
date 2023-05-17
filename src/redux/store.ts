import { configureStore, current } from '@reduxjs/toolkit'
import userReducer from "./slices/userSlice";
import popUpReducer from "./slices/popUpSlice";
import chosenUserReducer from "./slices/chosenUserSlice";
import currentConversationReducer from './slices/currentConversationSlice';
import filterReducer from './slices/filterSlice';
import replyMessageReducer from "./slices/replyMessageSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    popUp: popUpReducer,
    chosenUser: chosenUserReducer,
    currentConvId: currentConversationReducer,
    filter: filterReducer,
    reply: replyMessageReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch