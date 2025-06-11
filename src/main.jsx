
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { GlobalStyles } from '@mui/material'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import App from './App'
import theme from '~/theme'

//cau hinh react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
//cau hinh MUI dialog
import { ConfirmProvider } from 'material-ui-confirm'

// cau hinh redux store
import { Provider } from 'react-redux'
import { store } from'~/redux/store' 

//cấu hình react-router-dom với BrowserRouter
import { BrowserRouter } from 'react-router-dom'

//cau hinh redux-persist
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
const persistor = persistStore(store)

//ky thuat InjectStore : à kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios.js hiện tại 
import { injectStore } from '~/utitls/authorizeAxios'
injectStore(store) // inject store vào authorizeAxiosInstance để sử dụng trong các file khác

createRoot(document.getElementById('root')).render(
  // code pk chạy qua basename rồi mới tới các router tiếp theo 
  <BrowserRouter basename='/'> 
    <Provider store={store}>
      <PersistGate persistor={persistor}> 
        <CssVarsProvider theme={theme}> 
          <ConfirmProvider defaultOptions={{
            allowClose :false,
            dialogProps :{maxWidth: 'xs'},
            cancellationButtonProps :{color:'inherit'},
            confirmationButtonProps :{color :'secondary',variant:'outlined'},
            buttonOrder: ['confirm', 'cancel']
          }}> 
          <GlobalStyles styles={{a:{textDecoration :'none'}}} />
          <CssBaseline />
          <App />
          <ToastContainer position="bottom-left" theme="colored" />
            </ConfirmProvider>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter> 
)
