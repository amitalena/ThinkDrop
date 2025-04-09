import React from "react";
import MainRouter from "./router/MainRouter";
import { ThemeProvider } from "@mui/material";
import AppTheme from "./theme/AppTheme";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const App = () => {
  return (
    <ThemeProvider theme={AppTheme}>
      <ToastContainer position="top-right" autoClose={3000} />
      <MainRouter />
    </ThemeProvider>
  );
};

export default App;
