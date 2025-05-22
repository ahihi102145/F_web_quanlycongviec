import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ContentCut from '@mui/icons-material/ContentCut'
import CloudIcon from '@mui/icons-material/Cloud'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Tooltip from '@mui/material/Tooltip'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import ListCards from './ListCards/ListCards'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { useConfirm } from "material-ui-confirm"

function Column ({column , createNewCard ,deteleColumnDetails }) {
    const {
        attributes,listeners,setNodeRef,transform,transition , isDragging} = useSortable({
        id: column._id,
        data:{ ...column}    
    });
        
      const dndKitColumnStyle = {
        //nếu sd Tranfrom như docs sẽ lỗi kiểu strech
        transform: CSS.Translate.toString(transform),transition,
        //chiều cao này luôn max 100% vì nếu k sẽ lỗi lúc kéo column ngắn qua 1 column dài thì rất khó chịu.Lưu ý lúc này kết  hợp với {...listeners} nằm ở box chứ k phải ở div ngoài cùng để tránh trường hợp kéo vào vungd xanh

        height:'100%',
        opacity: isDragging ? 0.5 :undefined
      }


    const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);
        const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
        const handleClose = () => {setAnchorEl(null);}
        // card đã đc sx ở compoment cha cao nhất(71)
        const orderedCards =(column.cards)  

        const [openNewCardForm , setOpenNewColumnForm] = useState(false)
        const toggleOpenNewCardForm = () => setOpenNewColumnForm(!openNewCardForm)
      
        const [newCardTitle , setNewCardTitle] = useState('')
      
        const addNewCard=   () =>{
          if(!newCardTitle){
            toast.error('Please enter Card Title', {position: "bottom-right"})
            return  
          }
          
        //tao data de goi api
        const newCardData = {
            title :newCardTitle,
            columnId :column._id
        }  
          // goi api
         createNewCard(newCardData)
          // dong lai trang thai them column moi & clear input
          toggleOpenNewCardForm()
          setNewCardTitle('')
        }
//xu ly xoa 1 column va cards ben trong no
const confirmDeleteColumn = useConfirm()
const handleDeleteColumn = () =>{
    confirmDeleteColumn({
        //Locally
        title:' Delete Column ?',
        description:'This action will permanently delete your Column and its Cards ! Are you sure ?',
        confirmationText:'Confirm',
        cancellationText:'Cancel',

        // allowClose :false,
        // dialogProps :{maxWidth: 'xs'},
        // cancellationButtonProps :{color:'inherit'},
        // confirmationButtonProps :{color :'success',variant:'outlined'},
        // description:'phai nhap chu vector moi duoc confirm',
        // confirmationKeyword:'vector'
    }).then(() => {
        deteleColumnDetails(column._id)
    }).catch(()=>{})
   
   
}

// bọc div ở đây để chiều cao của column khi kéo thả sẽ có bug flickering
    return (
        <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes} >
            <Box 
             {...listeners}
                sx={{
                    minWidth: 300,
                    maxWidth: 300,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
                    ml: 2,
                    borderRadius: 2,
                    height: 'fit-content',
                    maxHeight: (theme) => `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(5)})`,
                    boxShadow: 1
            }}>
                {/* box Column  header*/}
                <Box sx={{
                        height: (theme) => theme.trelloCustom.columnHeaderHeight,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Typography variant="h6" sx={{
                            fontSize:'1rem',
                            fontWeight:'bold',
                            cursor:'pointer'
                        }}>
                        {column?.title}
                        </Typography>
                        <Box>
            <Tooltip title='More options'>       
                <ExpandMoreIcon
                sx={{color:'text.primary',cursor:'pointer'}}
                id="basic-column-dropdown"
                    aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                />
            </Tooltip>    
        <Menu
            id="basic-menu-column-dropdown"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown',
            }}>
            <MenuItem sx ={{
            '&:hover' :{ color:'success.light','& .add-card-icon': { color:'success.light'}}
        }}>
                <ListItemIcon><AddCardIcon className="add-card-icon" fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
            </MenuItem>   
            <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
            </MenuItem>
            <MenuItem >
                <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem>
                <ListItemIcon><ContentPasteIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Pates</ListItemText>
            </MenuItem>
            <Divider />

        <MenuItem 
        onClick = {handleDeleteColumn}
        sx ={{
            '&:hover' :{ color:'warning.dark','& .delete-forever-icon': { color:'warning.dark'}}
        }}>
            <ListItemIcon> <DeleteForeverIcon className="delete-forever-icon" fontSize='small' /> </ListItemIcon>
            <ListItemText> Delete this column</ListItemText>
        </MenuItem>
        <MenuItem>
            <ListItemIcon> <CloudIcon fontSize='small' /> </ListItemIcon>
            <ListItemText> Archive this column</ListItemText>
        </MenuItem>
        </Menu>
        </Box>
    </Box>
                    
                {/* box list card*/}
                <ListCards cards={orderedCards}/>
                {/*box column footer*/}
                    <Box sx={{
                        height: (theme) => theme.trelloCustom.columnFooterHeight,
                        p: 2,   
                    }}>
                        {!openNewCardForm
                        ? <Box sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}> 
                            <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add new card</Button>
                            <Tooltip title="Drag to move">
                                <DragHandleIcon sx={{ cursor: 'pointer' }} />
                            </Tooltip>
                        </Box>
                        : <Box sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                           gap :2
                        }}>
                <TextField 
                label="Enter card title... " 
                type="text"  
                size='small' 
                variant= "outlined"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={(theme) => ({
                    '& label': { color: theme.palette.text.primary }, // <- sửa thành theme
                    '& input': {
                      color: theme.palette.primary.main,
                      bgcolor: theme.palette.mode === 'dark' ? '#333643' : 'white'
                    },
                    '& label.Mui-focused': { color: theme.palette.primary.main },
                    '.MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: theme.palette.primary.main },
                      '&:hover fieldset': { borderColor: theme.palette.primary.main },
                      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
                    },
                    '.MuiOutlinedInput-input': {
                      borderRadius: 1
                    }
                  })}
                  
            />   
            <Box sx= {{display:'flex' , alignItems:'center', gap :2}}>
              <Button 
              onClick={addNewCard}
              variant="contained" color="success" size="small"
              sx={(theme) => ({
                boxShadow: 'none',
                border: '0.5px solid',
                borderColor: theme.palette.success.main,
                '&:hover': {
                  bgcolor: theme.palette.success.main
                }
              })}
              >Add</Button>
             <CloseIcon 
                fontSize="small"
               
                sx={(theme) => ({
                    color: theme.palette.warning.light,
                    cursor: 'pointer',
                    
                })}
                onClick={toggleOpenNewCardForm}
                />

                            </Box>    
                        </Box>
                        } 
                    </Box>
                </Box>
        </div>
    );
}

export default Column;
