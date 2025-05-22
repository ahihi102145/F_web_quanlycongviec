import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI 
        ,createNewColumnAPI
        , createNewCardAPI 
        ,updateBoardDetailsAPI,
        moveCardToDifferenceColumnAPI,
        deleteColumnDetailsAPI
} from '~/apis'
import { mapOrder } from '~/utitls/sorts'
import { generatePlaceholderCard } from '~/utitls/formatters'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
//import { mockData } from '~/apis/moc-data'

function Board() {
  const [board,  setBoard] =useState(null)

  useEffect(() => {
    const boardId = '6826ea8c05cc9cd3ed4412aa'
    fetchBoardDetailsAPI(boardId).then(response => {
      const board = response.board
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
      console.log( 'full board:',board);
      setBoard(response.board)
    })
  }, [])
  
  //func co nhiem vu goi api va lam lai data state board
  const createNewColumn = async (newColumnData) => {

    if (!board) return
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    //khi tao moi column khi do se chua co card  cần xử lý vấn đề kéo thả vào 1 column rỗng(vd 37.2 &69)
    const placeholderCard = generatePlaceholderCard(createdColumn)
    createdColumn.cards = [placeholderCard]
    createdColumn.cardOrderIds = [placeholderCard._id]
    
    // Cập nhật lại state để hiện ra UI
    // phia FE pk tự làm đúng lại state data board  thay vi goi lai api fetchBoardDetailsAPI
    // cách này phụ thuộc vào tùy lựa chọn và đặc thù dự án , có nơi thi BE sẽ hỗ trợ trả về luôn toàn bộ board dù đây có là api tạp column hay card
    const newBoard = {...board}
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }
  
  //func co nhiem vu goi api va lam lai data state board
  const  createNewCard = async (newCardData) =>{
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId : board._id
    })
   
    //cap nhat lai state board
    //phia FE phai tu lam dung lai board thay vi goi lai api fetchBoardDetailsAPI
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
   if(columnToUpdate){
      // nếu column rỗng : chứa 1 cái placeholder-card 
     if(columnToUpdate.cards.some(card =>card.FE_PlaceholerCard)){
        columnToUpdate.cards= [createdCard]
        columnToUpdate.cardOrderIds= [createdCard._id]

      }else{
        // nguoc lai column da co data thi push vao cuoi mang
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
   console.log('columnToUpdate:',columnToUpdate);
    setBoard(newBoard)
 
  }

  //func co nhiem vu goi api va xu ly keo tha song suoi
  //chi can goi api de cap nhat mang columnOrderIds cua column chua no(thay doi vi tri trong mang)
  const moveColumns = (dndOrderedColumns) =>{
    const  dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id) // o day cap nhat columnOrderIds de cap nhat vi tri
    //update cho phan du lieu state board
    const newBoard = {...board}
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds=dndOrderedColumnsIds
    setBoard(newBoard)

    //goi api update board
     updateBoardDetailsAPI(newBoard._id , {columnOrderIds: newBoard.columnOrderIds })
  } 
  // khi  di chuyen card trong cung column
   //chi can goi api de cap nhat mang cardOrderIds cua column chua no(thay doi vi tri trong mang)
  const moveCardInTheSameColumn = (dndOrderedCards,dndOrderedCardIds, columnId) =>{
      //update cho phan du lieu state board
      const newBoard = {...board}
      const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    //tao o dau tim dung column do
    if(columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
   
    setBoard(newBoard)
    
    //goi api update column
    moveCardToDifferenceColumnAPI(columnId, {cardOrderIds :dndOrderedCardIds })
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
    
    const  dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    //update cho phan du lieu state board
    const newBoard = {...board}
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds=dndOrderedColumnsIds
    setBoard(newBoard)
    
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
  
  // xử lý xóa 1 column và card bên trong nó 
  const  deteleColumnDetails = (columnId) => {
   //update cho chuan du lieu state board
     const newBoard = {...board}
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId ) // dieu kien loc la loai bo cac co column co id duoc xoa
    newBoard.columnOrderIds=newBoard.columnOrderIds.filter(_id =>_id !== columnId )
    setBoard(newBoard)

   //goi api xu ly BE 
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.result?.deleteResult)
    })
  }

  if (!board){
    return (
      <Box sx={{ 
        display: 'flex',
        alignItems:'center',
        justifyContent:'center',
        gap:2,
        width:'100vw',
        height:'100vh'
      }}>
      <CircularProgress />
      <Typography>Loading...</Typography>
    </Box>
    )
  }
    return (
       
          <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
           <AppBar/>
            <BoardBar board ={board}/>
            <BoardContent 
            board ={board}
             
            createNewColumn ={createNewColumn}
            createNewCard = {createNewCard}
            moveColumns ={moveColumns}
            moveCardInTheSameColumn={moveCardInTheSameColumn}
            moveCardToDifferenceColumn ={moveCardToDifferenceColumn}
            deteleColumnDetails ={deteleColumnDetails}
            />
          </Container>
      )
}

export default Board

