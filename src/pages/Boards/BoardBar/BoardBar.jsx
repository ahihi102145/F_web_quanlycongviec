import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utitls/formatters'


const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  ' .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({board}) {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trelloCustom.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        bgcolor:(theme) => (theme.palette.mode === 'dark'?'#34495e':'#1976d2'), 
        
      }}>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Tooltip title={board?.description}>
          <Chip sx={MENU_STYLES} icon={<DashboardIcon />} label={board?.title} clickable />
        </Tooltip>    
          <Chip sx={MENU_STYLES} icon={<VpnLockIcon />} label={capitalizeFirstLetter(board?.type)} clickable />
          <Chip sx={MENU_STYLES} icon={<AddToDriveIcon />} label="AddToGoogleDrive" clickable />
          <Chip sx={MENU_STYLES} icon={<BoltIcon />} label="Automation" clickable />
          <Chip sx={MENU_STYLES} icon={<FilterListIcon />} label="Filters" clickable />
      
      </Box>
 

      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button 
        variant="outlined" 
        startIcon={<PersonAddIcon/>} 
        sx={{
          color:'white',
          borderColor:'white',
          '&:hover':{borderColor:'white'}
        }}
        >
            Invite</Button>
      <AvatarGroup max={7}
      sx={{
        gap:'10px',
        '& .MuiAvatar-root': {
          width: 34,
          height: 34,
          fontSize: 16, 
          border:'none',
          color:'white',
          cursor:'pointer',
          '&:first-of-style':{bgcolor:'#a4b0b9'}
        }
      }}
      >
      <Tooltip title="Ttel">
          <Avatar alt="Ttel"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA2FBMVEX////ycigksksV..."
          />
        </Tooltip>
      </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
