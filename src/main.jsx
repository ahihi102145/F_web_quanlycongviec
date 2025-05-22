import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme'

//cau hinh react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
//cau hinh MUI dialog
import { ConfirmProvider } from 'material-ui-confirm';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssVarsProvider theme={theme}> 
      <ConfirmProvider defaultOptions={{
        allowClose :false,
        dialogProps :{maxWidth: 'xs'},
        cancellationButtonProps :{color:'inherit'},
        confirmationButtonProps :{color :'secondary',variant:'outlined'},
        buttonOrder: ['confirm', 'cancel']
      }}> 
      <CssBaseline />
      <App />
      <ToastContainer position="bottom-left" theme="colored" />
        </ConfirmProvider>
    </CssVarsProvider>
  </StrictMode>
)
