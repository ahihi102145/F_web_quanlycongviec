import { createSlice } from '@reduxjs/toolkit'

 //khởi tạo giá trị state của 1 cái slice trong redux
const initialState = {
  currentActiveCard: null
}

// //cac hanh dong goi api(bat dong bo) va cap nhat data vào redux . dùng middlleware createAsyncThunk di kèm với extraReducer 
// export const fetchCardDetailsAPI = createAsyncThunk(
//   'activeCard/fetchCardDetailsAPI'   ,  // dịnh danh middlleware riêng
//   async (boardId) => {
//     const reponse = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
//     // luu y :authorizeAxiosInstance tra ve result qua property cua no la data
//     return reponse.data
//   }
// )

//khởi tạo 1 slice trong kho lưu trữ - redux store 
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  //reducers : nơi xử lý dữ liệu đông bộ
  reducers: {
   clearCurrentActiveCard :(state) =>{
        state.currentActiveCard =null
    },


    updateCurrentActiveCard: (state, action) => {
      
     const fullCard = action.payload 
      //action.payload là chuẩn đặt tên nhận dữ liệu vào reducer , ở đây gán nó ra 1 biến có nghĩa hơn 
     //xử lý data nếu cần thiết

     //update lại  data cái currentActiveCard
     state.currentActiveCard = fullCard
    }
  },
  //ExtraReducers : noi xu ly data bat dong bo
  // eslint-disable-next-line no-unused-vars
  extraReducers : (builder) => {}

})
//Action creators are generated for each case reducer func
// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được 
// thằng redux tạo tự động theo tên của reducer nhé.
export const { clearCurrentActiveCard,updateCurrentActiveCard  } = activeCardSlice.actions

//selectors: la noi danh cho cac compoment ben duoi goi bang hook useSelector() de lay data tu trong kho redux store ra su dung
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

//cai file nay la activeCardSlice NHUNG chung ta se export 1 thu ten la Reducer 
// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer