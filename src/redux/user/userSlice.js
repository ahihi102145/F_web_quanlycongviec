import { createSlice , createAsyncThunk } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utitls/authorizeAxios'
import { API_ROOT } from '~/utitls/constants'
import { toast } from 'react-toastify'


const initialState = {
  currentUser: null
}
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI'   ,  // dịnh danh middlleware riêng
  async (data) => {
    const reponse = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    // luu y :authorizeAxiosInstance tra ve result qua property cua no la data
    // console.log(' Login API response:', reponse.data)

    return reponse.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI'   ,  // dịnh danh middlleware riêng
  async (showSuccessMessage = true) => {
    const reponse = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logout successfully !', { theme: 'colored' })
    }
    return reponse.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI'   ,  // dịnh danh middlleware riêng
  async (data) => {
    const reponse = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
    return reponse.data
  }
)
// khoi tao slice  trong kho luu tru redux
export const userSlice = createSlice({
  name: 'user',
  initialState,
  //reducers : nơi xử lý dữ liệu đông bộ
  reducers: {},
  //ExtraReducers : noi xu ly data bat dong bo
  extraReducers : (builder) => {

    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      //action.payload o day chinh la cai reponse.data tra ve o tren 
      const user = action.payload 
      //update lai data currentUser trong state
      state.currentUser = user
    })

    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      /*
      api logout  sau khi goi thanh cong se clear  thong tin currentUser ve null o day
      ket hop ProtectedRoute.js lam o App.js =>  redirect ve trang login
      */
      state.currentUser = null
    })
    
     builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      //action.payload o day chinh la cai reponse.data tra ve o tren 
        const user = action.payload
      state.currentUser = user
 
    })
  }
})

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer