import React, {useContext} from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { ColorModeContext, tokens } from '../theme';
import InputBase from '@mui/material/InputBase';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';


function TopBar() {
  //use theme allows us to grab pallete from material ui and pass our custom theme using the tokens()
  const theme = useTheme();
  //tokens retrieves the color object 
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  return (
    <Box className="topbar-nav" display='flex' justifyContent='space-between' p={2}>
      {/* search bar */}
      <Box display='flex' backgroundColor={colors.primary[400]} borderRadius='3px'>
         <InputBase sx={{ml:2, flex: 1}} placeholder="Search"/>
         <IconButton type='button' sx={{p:1}}>
            <SearchIcon/>
         </IconButton>
      </Box>
      {/* icons section */}
      <Box display='flex'>
         <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode==='dark'?(
               <DarkModeOutlinedIcon/>
            ):(
               <LightModeOutlinedIcon/>
            )}
         </IconButton>
         <IconButton>
            <NotificationsOutlinedIcon/>
         </IconButton>
         <IconButton>
            <SettingsOutlinedIcon/>
         </IconButton>
         <IconButton>
            <PersonOutlinedIcon/>
         </IconButton>
      </Box>
      
    </Box>
  )
}

export default TopBar