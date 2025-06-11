import { createSlice , createAsyncThunk } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utitls/authorizeAxios'
import { API_ROOT } from '~/utitls/constants'
import { mapOrder } from '~/utitls/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utitls/formatters'


 //khởi tạo giá trị state của 1 cái slice trong redux
const initialState = {
  currentActiveBoard: null
}

//cac hanh dong goi api(bat dong bo) va cap nhat data vào redux . dùng middlleware createAsyncThunk di kèm với extraReducer 
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI'   ,  // dịnh danh middlleware riêng
  async (boardId) => {
    const reponse = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    // luu y :authorizeAxiosInstance tra ve result qua property cua no la data
    return reponse.data
  }
)

//khởi tạo 1 slice trong kho lưu trữ - redux store 
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  //reducers : nơi xử lý dữ liệu đông bộ
  reducers: {
    // lưu ý luôn cần cặp {} cho func trong reducer cho code bên trg chỉ có 1 dòng , đây là rule của Redux
    updateCurrentActiveBoard: (state, action) => {
       //action.payload là chuẩn đặt tên nhận dữ liệu vào reducer , ở đây gán nó ra 1 biến có nghĩa hơn 
     let board = action.payload

     //xử lý data nếu cần thiết
    

     //update lại  data cái currentActiveBoard
     state.currentActiveBoard = board
    },

    updateCardInBoard : (state, action) => {
      //update nested data : https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const incomingCard = action.payload

      //find tu board > column >card
      const column =  state.currentActiveBoard.columns.find(i => i._id === incomingCard.columnId) 
      if (column) {
        const card = column.cards .find(i => i._id === incomingCard._id)
        if (card) {
          /*
            -dungf Object.keys để lấy toàn bộ properties (keys) của incomingCard về 1 array rồi forEach nó ra
            -sau đó tùy vào trường hợp cần thì kiểm tra thêm còn ko thì cập nhật ngược lại giá trị vào card luôn như bên dưới
          */
          Object.keys(incomingCard).forEach(key  =>{
            card[key]=incomingCard[key]
          })

        }
      }

    }

  },
  //ExtraReducers : noi xu ly data bat dong bo
  extraReducers : (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      //action.payload o day chinh la cai reponse.data tra ve o tren 
       let board = action.payload.board

       //thành viên trong cái board sẽ là gộp lại của 2 mảng owners và members >gán vào FE_allUsers
      board.FE_allUsers =board.owners.concat(board.members) 
      
       //xắp sếp dữ liệu từ các column luôn ở đây trước khi đưa data xuống bên dưới các compoment con (vd 71)
            board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
           //
             board.columns.forEach(column => {
               //khi f5 web thì cần xử lý vấn đề kéo thả vào  1 column rỗng (37.2 & 69)
               if (isEmpty(column.cards)) {
                 column.cards = [generatePlaceholderCard(column)]
                 column.cardOrderIds = [generatePlaceholderCard(column)._id] 
       
                 // const placeholder = generatePlaceholderCard(column)
                 // column.cards = [placeholder]
                 // column.cardOrderIds = [placeholder._id]
       
               }else{
                  //xắp sếp dữ thứ tự các card  luôn ở đây trước khi đưa data xuống bên dưới các compoment con ( 71_bug quan trọng )
                 column.cards = mapOrder(column.cards,column.cardOrderIds,'_id')  
               }
             })
    

     //update lại  data cái currentActiveBoard
     state.currentActiveBoard = board
    })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được 
// thằng redux tạo tự động theo tên của reducer nhé.
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions

//selectors: la noi danh cho cac compoment ben duoi goi bang hook useSelector() de lay data tu trong kho redux store ra su dung
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

//cai file nay la activeBoardSlice NHUNG chung ta se export 1 thu ten la Reducer 
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer