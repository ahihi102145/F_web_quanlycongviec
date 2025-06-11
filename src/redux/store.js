import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { activeCardReducer } from './activeCard/activeCardSlice'
/*
cấu hn hình redux-persist
yarn add redux-persist@^6.0.0
https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
*/
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

// Cấu hình persist cho 
const rootPersistConfig = {
  key : 'root', // key cua cai persist do chung ta chi dinh  de mac dinh la root
  storage : storage,  //bien  storage nay se luu tru du lieu vao localStorage
  // whilelist: ['user'] // dinh nghia cac slide data DUOC PHEP duy tri qua moi lan f5 trinh duyet 
  whitelist: ['user'] 

  // blacklist: ['user'] // dinh nghia cac slide data KHONG DUOC PHEP duy tri qua moi lan f5 trinh duyet
}

//combine cac reducers trong du an lai voi nhau
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard:activeCardReducer
})

//thuc hien persistReducer
const persistedReducer = persistReducer(rootPersistConfig, reducers)



export const store = configureStore({
  reducer: persistedReducer
})