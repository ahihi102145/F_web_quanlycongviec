import { SortableContext ,verticalListSortingStrategy } from '@dnd-kit/sortable'
import Box from '@mui/material/Box'
import Card from './Card/Card'

function ListCards ({cards})  {
    
    return (
        <SortableContext items = {cards?.map(c => c._id)} strategy={verticalListSortingStrategy}>
            <Box sx={{
                p:'0 5px 5px 5px ',
                m:'0 5px',
                gap: 1,
                display: 'flex',
                flexDirection: 'column', 
                overflowY: 'auto', 
                overflowX: 'hidden',
                maxHeight: (theme) => `calc(${theme.trelloCustom.boardContentHeight} - 
                ${theme.spacing(5)} - ${theme.trelloCustom.columnFooterHeight} - ${theme.trelloCustom.columnHeaderHeight})`,

                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#ced0da',
                    borderRadius: '8px'
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#bfc2cf', 
                }
            }}
        >
            {cards?.map(card =><Card key={card._id} card ={card} />)} <Card/>

        </Box>
        </SortableContext>
    );
}

export default ListCards;
