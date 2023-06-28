import React, { useContext, useState } from 'react';
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import {Box, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from '../theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { MenuOutlined } from '@mui/icons-material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import NameContext from '../context/NameContext';




const Item = ({ title, to, icon, selected, setSelected }) => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);


   return (
     <MenuItem
       active={selected === title}
       style={{
         color: colors.grey[100],
       }}
       onClick={() => setSelected(title)}
       icon={icon}
     >
       <Typography>{title}</Typography>
       <Link to={to} />
     </MenuItem>
   );
 };
 
 const SideBar = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [selected, setSelected] = useState("Dashboard");
   const { toggleSidebar, collapseSidebar, broken, collapsed } = useProSidebar();
   const {name} = useContext(NameContext);


   return (
     <Box className="sidebar-nav" sx={{
      display:'flex',
      height: '100vh',

     }}>
          <Sidebar 
            backgroundColor={colors.primary[400]}
            rootStyles={{
               border:"none"
            }}
            > 
            <Menu iconShape="square">
               <MenuItem
                  icon={<MenuOutlined/>}
                  onClick={()=>collapseSidebar()}
               >
                  <Typography variant="h3" color={colors.grey[100]}>MENU</Typography>
               </MenuItem>

               {/* PROFILE */}
               {!collapsed && (
                  <Box mb="50px" mt="30px">
                     <Box display="flex" justifyContent="center" alignItems="center">
                        <img
                           alt="profile-user"
                           width="100px"
                           height="100px"
                           src={`../../assets/user.png`}
                           style={{ cursor: "pointer", borderRadius: "50%" }}
                        />
                     </Box>
                     <Box textAlign="center">
                     <Typography
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                        sx={{ m: "10px 0 0 0" }}
                     >
                        {name}
                     </Typography>
                     </Box>
                  </Box>
               )}

               <MenuItem component={<Link to="/"/>} icon={<ChatOutlinedIcon/>}>
                  <Typography variant="h5" color={colors.grey[100]}>Messager</Typography>
               </MenuItem>
            </Menu>
          </Sidebar>

      </Box>
   );
}

export default SideBar;