import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import { updateBoardDetailsAPI,
        moveCardToDifferenceColumnAPI,
        updateColumnDetailsAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
//import { mockData } from '~/apis/moc-data'
import {fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard} from '~/redux/activeBoard/activeBoardSlice'
import {useDispatch, useSelector} from 'react-redux'
import {useParams} from 'react-router-dom' 
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

function Board() {
  const dispatch = useDispatch()
  // khong dùng state  của compoment  nữa mà chuyển  qua dùng state của redux
  // const [board,  setBoard] =useState(null)
  const board = useSelector (selectCurrentActiveBoard)
  const activeCard = useSelector (selectCurrentActiveCard)
  
  
  const {boardId}=useParams()
 
  useEffect(() => {
    // const boardId = '6831ca2593aa999984c9f125'
    //call api
    dispatch(fetchBoardDetailsAPI(boardId))

  }, [dispatch , boardId])
   

  //func co nhiem vu goi api va xu ly keo tha song suoi
  //chi can goi api de cap nhat mang columnOrderIds cua column chua no(thay doi vi tri trong mang)
  const moveColumns = (dndOrderedColumns) =>{
     //update cho phan du lieu state board
    const  dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id) // o day cap nhat columnOrderIds de cap nhat vi tri
    /*
    truong hop  dùng Spread Operator thì lại không sao bởi vì ở đây chúng ta không dùng push như ở trên làm thay đổi trực tiếp  kiểu mở rộng mảng,
    mà chỉ gán lại toàn bộ giá trị columns và columnOrderIds bằng  2 mảng mới.Tương tự như cách làm concat ở trường hợp createNewColumn thôi
    */
    const newBoard = {...board}
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds=dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    //goi api update board
     updateBoardDetailsAPI(newBoard._id , {columnOrderIds: newBoard.columnOrderIds })
  } 
  // khi  di chuyen card trong cung column
   //chi can goi api de cap nhat mang cardOrderIds cua column chua no(thay doi vi tri trong mang)
const moveCardInTheSameColumn = (dndOrderedCards,dndOrderedCardIds, columnId) =>{
      //update cho phan du lieu state board
      // const newBoard = {...board}
      /*
      -cannot assign to read only property 'card' of object
      -trường hợp imutability ở đây , đã đụng tới giá trị card đang được coi  là chỉ đọc read only - (nested)
      */
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    //tao o dau tim dung column do
    if(columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
   
    dispatch(updateCurrentActiveBoard(newBoard))
    
    //goi api update column
    updateColumnDetailsAPI(columnId, {cardOrderIds :dndOrderedCardIds })
}

  /**
 * Xử lý khi kéo thả Card sang một Column khác:
 * Bước 1: Cập nhật mảng cardOrderIds của Column gốc (Column chứa Card ban đầu)
 *         → Thực chất là xóa _id của Card ra khỏi mảng cardOrderIds của Column này.
 * Bước 2: Cập nhật mảng cardOrderIds của Column đích (Column được thả vào)
 *         → Thực chất là thêm _id của Card vào mảng cardOrderIds của Column này.
 * Bước 3: Cập nhật lại  columnId của  Card đã được kéo
 *         → Đảm bảo dữ liệu phản ánh đúng vị trí mới của Card trong Column mới.
 => xây dựng một API support riêng để hỗ trợ việc di chuyển Card này.
 */

  const  moveCardToDifferenceColumn = (currentCardId, prevColumnId , nextColumnId , dndOrderedColumns) => {
     //update cho phan du lieu state board
    const  dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
   // tương tự đoạn xử lý func moveColumns lên k ảnh hưởng Redux toolkit Imutability gì ở đây cả 
    const newBoard = {...board}
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds=dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))
    
    //goi api xu ly phia be

  //   let  prevCardOrderIds= dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
  //   // console.log("prevCardOrderIds1",prevCardOrderIds)
  // // xử lý vđ khi kéo card cuôi cùng ra khỏi column ,cloumn rỗng sẽ có  placeholder-card cần xóa nó đi trước khi gửi data lên BE (37.2)
  //   if(prevCardOrderIds[0]?.includes('placeholder-card')) prevCardOrderIds = []
  //   // console.log("prevCardOrderIds2",prevCardOrderIds)

      //let  nextCardOrderIds= dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
  //   console.log("nextCardOrderIds",nextCardOrderIds)
  // // xử lý vđ khi kéo card cuôi cùng ra khỏi column ,cloumn rỗng sẽ có  placeholder-card cần xóa nó đi trước khi gửi data lên BE (37.2)
  //   if(nextCardOrderIds[0]?.includes('placeholder-card')) prevCardOrderIds = []
  //   console.log("nextCardOrderIds",nextCardOrderIds)

   // muc dich la tìm column rồi lấy cardOrderIds , câp nhật lại giá trị của cardOrderIds của column cũ
     // Tìm đúng column từ dndOrderedColumns (vì nó là danh sách column đầy đủ) _chatgpt
  // const prevColumn = dndOrderedColumns.find(c => c._id === prevColumnId)
  // const nextColumn = dndOrderedColumns.find(c => c._id === nextColumnId)

  let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // **Thêm logic lọc placeholder card cho prevCardOrderIds**
    if (prevCardOrderIds && prevCardOrderIds[0]?.includes('placeholder-card')) {
      prevCardOrderIds = [] // Nếu chỉ có placeholder, gửi mảng rỗng
    } else if (prevCardOrderIds) {
      prevCardOrderIds = prevCardOrderIds.filter(id => !id.includes('placeholder-card'))
    }

    let nextCardOrderIds = dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    // **Thêm logic lọc placeholder card cho nextCardOrderIds**
    if (nextCardOrderIds && nextCardOrderIds[0]?.includes('placeholder-card')) {
      nextCardOrderIds = [] // Nếu chỉ có placeholder, gửi mảng rỗng
    } else if (nextCardOrderIds) {
      nextCardOrderIds = nextCardOrderIds.filter(id => !id.includes('placeholder-card'))
    }
    
    moveCardToDifferenceColumnAPI({
      currentCardId, 
      prevColumnId,
      prevCardOrderIds ,
      nextColumnId,
      nextCardOrderIds 
    })

  }
  
  
  if (!board){
    return <PageLoadingSpinner caption ="Loading Board..." />
    }
    return (
       
          <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
            {/* Modal acticecard ,check đóng mở dựa theo điều kiện tồn tai data activeCard lưu trong Redux hay k thì moiw render
            Mỗi thời điểm chỉ tồn tại 1 cái modal đang activeCard */}
           {activeCard && <ActiveCard/>}
           
            
            {/* các thành phần còn lại của board details */}
           <AppBar/>
            <BoardBar board ={board}/>
            <BoardContent 
            board ={board}

            moveColumns ={moveColumns}
            moveCardInTheSameColumn={moveCardInTheSameColumn}
            moveCardToDifferenceColumn ={moveCardToDifferenceColumn}
           
            />
          </Container>
      )
}

export default Board

