import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import Tooltip from '@mui/material/Tooltip'
import { useSelector , useDispatch } from 'react-redux' 
import { selectCurrentUser, logoutUserAPI } from '~/redux/user/userSlice'
import { useConfirm } from 'material-ui-confirm'
import { Link } from 'react-router-dom'



function Profiles() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }
    const dispatch = useDispatch()
    const currentUser = useSelector(selectCurrentUser)

    const confirm = useConfirm()

    const handleLogout = () => {
      confirm({
        title: 'Are you sure you want to logout?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel',
    }).then(() => {
      // thuc hien goi api logout
      dispatch(logoutUserAPI())
    }).catch(() => {})
  }
    return (
        <>
            <Box >
                <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ padding: 0 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar 
                    sx={{ width: 34, height: 34 }}
                    alt="Ftel"
                    src={currentUser?.avatar}
                    />
          </IconButton>
        </Tooltip>
            </Box>
            <Menu
            
                id="basic-menu-profiles"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button-profiles',
                }}>
        <Link to ="/settings/account" style={{ textDecoration: 'none', color: 'inherit' }}>        
          <MenuItem sx= {{ '&:hover': {  color: 'success.light'} }}>
            <Avatar 
            src={currentUser?.avatar}
            sx={{width:28,height:28,mr:2}}/> Profile
          </MenuItem>
        </Link>   

        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} sx= {{
              '&:hover': {  color: 'warning.dark', '& .logout-icon' : { color: 'warning.dark' } }
             }}>
          <ListItemIcon>
            <Logout className='logout-icon' fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
            </Menu>
        </>
    );
}

export default Profiles;
