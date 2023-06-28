import ChatRoom from "./component/Messenger";
import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import SideBar from "./global/SideBar";
import TopBar from "./global/TopBar";
import NameProvider from "./context/Context";

function App() {
  const [theme, colorMode] = useMode()
  return (
      <ColorModeContext.Provider value ={colorMode}>
        <ThemeProvider theme={theme}>
          <NameProvider>
          <CssBaseline>
            <div className="App">
              <SideBar/>
              <main className="content" >
                <TopBar/>
                <Routes>
                  <Route path="/" element={<ChatRoom/>}/>
                </Routes>
              </main>
            </div>
          </CssBaseline>
          </NameProvider>
        </ThemeProvider>
    </ColorModeContext.Provider>

  );
}

export default App;
