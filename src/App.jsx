import Board from "~/pages/Boards/_id"
import {Route, Routes ,Navigate, Outlet} from 'react-router-dom' 
import NotFound from "~/pages/404/NotFound"
import Auth from "~/pages/Auth/Auth"
import AccountVerification from  "~/pages/Auth/AccountVerification"
import { useSelector } from 'react-redux'
import {selectCurrentUser} from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
import Boards from '~/pages/Boards'

/*
- giải pháp cho việc cleancode  trong việc xác định  route nào cần đăng nhập tài khoản mới truy cập được
-sử dụng Outlet để hiển thị các child route bên trong
https://www.robinwieruch.de/react-router-private-routes/
*/
const ProtectedRoute = ({user}) => {
  if (!user) {
    return <Navigate to='/login' replace={true} />
  }
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return ( 
    <Routes>
      {/*Redirect router */}
       <Route path='/' element={
      // ở đây cần replace giá trị true  để nó thay thế route /  , có thể  hiểu là route / sẽ không còn nằm trong history của Browser
      // thực hành dễ hiểu hơn bằng cách nhấn go home từ trang 404 song thử quay lại bằng nút back  của trình duyệt giữa 2 trường hợp replace hoặc  không có 
        <Navigate to ='/boards' replace={true}/>
       }/>
      {/*ProtectedRoute (hieu don gian trong du an nay la nhung route chi  chi cho truy cap sau khi da login*/}
     <Route element ={<ProtectedRoute user={currentUser} />}> 
        {/*outlet se chay vao trong cac childe route trong nay*/}
      

        {/*Board Details*/}
        <Route path='/boards/:boardId' element={ <Board/> }/>
        <Route path='/boards' element={ <Boards/> }/>

        {/*User settings*/}
        <Route path='/settings/account' element={ <Settings />}/>
        <Route path='/settings/security' element={<Settings />}/>
        {/* <Route path='/settings/account' element={ }/> */}

      </Route>

      {/*Authentication*/}
      <Route path='/login' element={ <Auth/> }/>
      <Route path='/register' element={ <Auth/> }/>
      <Route path='/account/verification' element={ <AccountVerification/>}/>

       {/*{404 not found page }*/}
        <Route path='*' element={ <NotFound/> }/>
    </Routes>
  )
}

export default App;