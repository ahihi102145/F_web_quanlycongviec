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



function Profiles() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                    src="data:image/png;base64,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"

                    />
          </IconButton>
        </Tooltip>
            </Box>
            <Menu
            
                id="basic-menu-profiles"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button-profiles',
                }}
            >
             <MenuItem onClick={handleClose}>
          <Avatar sx={{width:28,height:28,mr:2}}/> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar sx={{width:28,height:28,mr:2}}/> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
            </Menu>
        </>
    );
}

export default Profiles;
