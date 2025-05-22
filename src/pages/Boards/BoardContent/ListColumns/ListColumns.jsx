import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext ,horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'


function ListColumns({columns , createNewColumn , createNewCard, deteleColumnDetails}) {
  const [openNewColumnForm , setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle , setNewColumnTitle] = useState('')

  const addNewColumn =  () =>{
    if(!newColumnTitle){
     toast.error('Please enter Column Title')
      return  
    }

    //tao data de goi api
    const newColumnData = {
      title :newColumnTitle
    }
    // // goi api
     createNewColumn(newColumnData) 
    
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
        {columns?.map(column => <Column 
        key ={column._id}
        column ={column} 
        createNewCard={createNewCard}
        deteleColumnDetails={deteleColumnDetails}
        />)}
      
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
