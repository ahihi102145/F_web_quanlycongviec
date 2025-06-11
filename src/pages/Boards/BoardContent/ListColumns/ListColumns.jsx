import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext ,horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { createNewColumnAPI} from '~/apis'
import { generatePlaceholderCard } from '~/utitls/formatters'
import {updateCurrentActiveBoard, selectCurrentActiveBoard} from '~/redux/activeBoard/activeBoardSlice'
import {useDispatch, useSelector} from 'react-redux'
import { cloneDeep } from 'lodash'

function ListColumns({columns}) {
  const board = useSelector (selectCurrentActiveBoard)
  const dispatch = useDispatch()


  const [openNewColumnForm , setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle , setNewColumnTitle] = useState('')

  const addNewColumn = async () =>{
    if(!newColumnTitle){
     toast.error('Please enter Column Title')
      return  
    }

    //tao data de goi api
  const newColumnData = {
      title :newColumnTitle
    }

  //func co nhiem vu goi api va lam lai data state board
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
        /**
     * Đoạn này sẽ dính lỗi "object is not extensible" bởi dù đã copy/clone ra giá trị newBoard 
     * nhưng bản chất của spread operator là Shallow Copy/Clone, nên dính phải rules Immutability trong Redux Toolkit 
     * không dùng được hàm PUSH (sửa giá trị mảng trực tiếp). 
     * Cách đơn giản nhanh gọn nhất ở trường hợp này của chúng ta là dùng tới Deep Copy/Clone toàn bộ cái Board 
     * cho dễ hiểu và code ngắn gọn.
     * https://redux-toolkit.js.org/usage/immer-reducers
     * Tài liệu thêm về Shallow và Deep Copy Object trong JS:
     * https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
     */
  
      // const newBoard = {...board}
      const newBoard = cloneDeep(board)
      newBoard.columns.push(createdColumn)
      newBoard.columnOrderIds.push(createdColumn._id)
  
      /**
     * Ngoài ra cách nữa là vẫn có thể dùng array.concat thay cho push như docs của Redux Toolkit 
     * vì push như đã nói nó sẽ thay đổi giá trị mảng trực tiếp, 
     * còn concat thì nó merge – ghép mảng lại và tạo ra một mảng mới 
     * để chúng ta gán lại giá trị nên không vấn đề gì.
     */
      // const newBoard = { ...board }
      // newBoard.columns = newBoard.columns.concat([createdColumn])
      // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn._id])
      
      // cập nhật data vào trong redux 
      dispatch(updateCurrentActiveBoard(newBoard))
    

    // dong lai trang thai them column moi & clear input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  return (
    <SortableContext items = {columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
        <Box
      sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column => <Column key ={column._id} column ={column} />)}
      
{/* {columns?.map((column, index) => column?._id ? (
    <Column key={column._id} column={column} createNewCard={createNewCard} />
  ) : (
    <div key={`fallback-${index}`}> Invalid column</div>
  )
)} */}
      {!openNewColumnForm
      ? <Box onClick ={toggleOpenNewColumnForm}
          sx={{
              minWidth: 250,
              maxWidth: 250,
              bgcolor: '#ffffff3d',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content'
          }}
        >
          <Button
            startIcon={<NoteAddIcon />}
            sx={{
              color: 'white',
              width:'100%',
              justifyContent:'flex-start',
              pl:2.5,
              py:1
            }}
          >
            Add new column
          </Button>
      </Box>
      : <Box sx ={{
        minWidth: 250,
        maxWidth: 250,
        p:1,
        bgcolor: '#ffffff3d',
        mx: 2,
        borderRadius: '6px',
        height: 'fit-content',
        display: 'flex', // Thêm display flex
        flexDirection: 'column',
        gap: 1,
        position: 'relative' // Để căn CloseIcon
      }}> 
      <TextField 
                label="Enter column title... " 
                type="text"  
                size='small' 
                variant= "outlined"
                autoFocus
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                sx={{
                    '& label':{color:'white'},
                    '& input':{color:'white'},
                    '& label.Mui-focused':{color:'white'},
                    '& .MuiOutlinedInput-root':{
                        '&fieldset':{ borderColor: 'white'},
                        '&:hover fieldset':{ borderColor: 'white'},
                        '&.Mui-focused fieldset':{ borderColor: 'white'},
                    },
                }}
            />   
            <Box sx= {{display:'flex' , alignItems:'center', gap :2}}>
              <Button 
              className="interceptor-loading"
              onClick={addNewColumn}
              variant="contained" color="success" size="small"
              sx={(theme) => ({
                boxShadow: 'none',
                border: '0.5px solid',
                borderColor: theme.palette.success.main,
                '&:hover': {
                  bgcolor: theme.palette.success.main
                }
              })}
              >Add Column</Button>
              <CloseIcon 
                  fontSize="small"
                  onClick={toggleOpenNewColumnForm}
                  sx={(theme) => ({
                    color: 'white',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: theme.palette.warning.light }
                  })}
                />

            </Box>        
      </Box>
      }
     
        </Box>
    </SortableContext>
    
  );
}

export default ListColumns;
