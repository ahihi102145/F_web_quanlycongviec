import { Card as MuiCard, Typography, CardMedia, CardContent, CardActions, Button } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import ModeCommentIcon from '@mui/icons-material/ModeComment'
import AttachmentIcon from '@mui/icons-material/Attachment'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import {useDispatch} from 'react-redux'
import { updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

function Card ( {card}){
    const dispatch = useDispatch()

    if (!card) return null
    const { attributes, listeners, setNodeRef, transform, transition ,isDragging} = useSortable({
        id: card._id,
        data: { ...card }
    })
    const dndKitCardStyle = {
        //nếu sd Tranfrom như docs sẽ lỗi kiểu strech
        transform: CSS.Translate.toString(transform),transition,
        opacity: isDragging ? 0.5 :undefined,
        border: isDragging ? '1px solid #2ecc71' :undefined
      }     
    const shouldShowCardAction = ()=>{
            return !!card?.memberIds?.length || !!card?.comments?.length ||!!card?.attachments?.length
    }

   
    const setActiveCard = () => {
         //cap nhat data cho activeCard trong Redux
        dispatch(updateCurrentActiveCard(card))
        
    }


        return (
            <MuiCard
                onClick ={setActiveCard}
                ref={setNodeRef}style={dndKitCardStyle}{...attributes} {...listeners}
                sx={(theme) => ({
                    cursor: 'pointer',
                    boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
                    overflow: 'unset',
                    display: card?.FE_PlaceholerCard ? 'none' : 'block',
                    border: '1px solid transparent',
                    bgcolor: theme.palette.mode === 'dark' ? '#333643' : 'white', // Nền giữ nguyên
                    transition: 'border 0.2s ease', // Tạo hiệu ứng mượt khi đổi viền
                    '&:hover': {
                      border: `1px solid ${theme.palette.primary.main}`, // Hover thì đổi màu VIỀN thôi
                      bgcolor: theme.palette.mode === 'dark' ? '#333643' : 'white' // Nền vẫn giữ nguyên
                    }
                  })}
                  
            >
                {card?.cover && (
                    <CardMedia sx={{ height: 140 }} image={card.cover} />
                )}
                <CardContent sx={{ p: 1.5 }}>
                    <Typography> {card.title} </Typography>
                </CardContent>
                {shouldShowCardAction() && (
                    <CardActions sx={{ p: '0 4px 8px 4px' }}>
                        {!!card?.memberIds?.length && (
                            <Button size="small" startIcon={<GroupIcon />}>
                                {card.memberIds.length}
                            </Button>
                        )}
                        {!!card?.comments?.length && (
                            <Button size="small" startIcon={<ModeCommentIcon />}>
                                {card.comments.length}
                            </Button>
                        )}
                        {!!card?.attachments?.length && (
                            <Button size="small" startIcon={<AttachmentIcon />}>
                                {card.attachments.length}
                            </Button>
                        )}
                    </CardActions>
                )}
            </MuiCard>
    );
}

export default Card;
