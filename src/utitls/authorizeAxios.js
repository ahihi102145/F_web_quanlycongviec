import axios from "axios"
import { toast } from "react-toastify"
import { interceptorLoadingElements } from '~/utitls/formatters'
import {refreshTokenAPI} from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'


/*
*khong the import  {store } from '~/redux/store' theo cách thông thường ở đây
-giải pháp : Inject store :là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component 
như file authorizeAxios.js hiện tại 
-hiểu đơn giản : khi ứng dụng  bắt đầu chạy  lên , code sẽ đc chạy vào main.jsx đầu tiên , từ bên đó chúng ta gọi hàm InjectStore ngay lật tức
để gán biến mainStore vào biến axiosRequestStore cục bộ trg file này
https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
*/

let axiosReduxstore  // truyen xuong  axiosReduxstore.dispatch(logoutUserAPI(false))

export const injectStore = mainStore => { axiosReduxstore = mainStore }

// khởi tạo  1 đối tượng Axios(authorizeAxiosInstance) mục đích để custom và cấu hình chung cho dự án 
let authorizeAxiosInstance =  axios.create()
//thời gian chờ tối đa của 1 request : để 10 ph
authorizeAxiosInstance.defaults.timeout = 1000*60*10
//withCredebtials : sẽ cho phép axios tự động gửi cookie trg  mỗi request lên BE(phục vụ  việc chúng ta  sẽ lưu JWT token (refresh & access) trong một httpOnly Cookie của trình duyệt )
authorizeAxiosInstance.defaults.withCredentials =  true

// cấu hình  Interceptors(bộ đánh chặn vào giữa mọi request & repone)
// https://axios-http.com/docs/interceptors

//   interceptor request : can thiệp vào giữa những cái request API
authorizeAxiosInstance.interceptors.request.use( (config) => {
   // ky thuat chan spam click (mo ta o formaters chua func)
  interceptorLoadingElements(true)

    return config
  },  (error) => {
    // Do something with request error
    return Promise.reject(error)
  })

//khoi tao 1 promise  cho viec goi api refresh token (6/3/2025)
// muc dich tao promise de khi nao goi api refresh token thanh cong thi moi retry lai nhieu api bi loi truoc do
//https://www.thedutchlab.com/en/insights/using-axios-interceptors-for-refreshing-your-api-token
let refreshTokenPromise = null // xu ly vao phan loi

//   interceptor response : can thiệp vào giữa những cái response nhân về
authorizeAxiosInstance.interceptors.response.use( (response) => {
    // ky thuat chan spam click (mo ta o formaters chua func)
    // console.log('Interceptor response:', response.data)
  interceptorLoadingElements(false)

    return response
  },  (error) =>{
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // mọi mã http status code nằm ngoài 200-299 sẽ là error rơi vào đây

     // ky thuat chan spam click (mo ta o formaters chua func)
  interceptorLoadingElements(false)

    //quan trong : xu ly refresh token tu dong
    // TH1 : neu nhu nhan loi 401 tu BE  => goi api dang xuat
    if( error.response?.status === 401) {
       axiosReduxstore.dispatch(logoutUserAPI(false))
    }
    //th2 :neu nhan ma 410 tu BE (Gone) =>goi api token refresh de lam moi la access token
    //dau tien lay duoc cai request API dang bi loi thong qua error.config
    const originalRequests = error.config
    // console.log('originalRequests', originalRequests)
    if (error.response?.status === 410 && !originalRequests._retry) {
      //gán thêm 1 giá trị _retry = true trong khoảng thời gian chờ , đảm bảo việc refresh token chỉ được thực hiện một lần tại 1 thời điểm(nhìn lại điều kiện if trên)
      originalRequests._retry = true
      //kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc goi api refresh token đồng thời gán vào cho cái refreshTokenPromise
      if (!refreshTokenPromise) {
        //neu chua co promise refresh token thi tao moi
        refreshTokenPromise = refreshTokenAPI()
            .then((data) => {
              // dong thoi accessToken da nam trg httpOnly cookie cua trinh duyet (xu ly o BE)
             return data?.accessToken
            })
            .catch((err) => {
              //neu nhan bat ky loi nao tu api refresh token thi cu logout
              axiosReduxstore.dispatch(logoutUserAPI(false))
              return Promise.reject(err)
            })
            .finally(() => {
              //du api co thanh cong  hay loi thi luon gan lai cai refreshTokenPromise ve null nhu ban dau 
              refreshTokenPromise = null
            })
      }
      //can retrun truong hop refreshTokenPromise chay thanh cong va xu ly them o day:
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then( accessToken => {
       //buoc 1: doi voi TH nếu dự án cần lưu accessToken vào localStorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây
       //ví dụ : axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
       //hiện tại ko cần bước này vì chúng ta đưa accessToken vào  cookie của trình duyệt sau khi api refresh token gọi  thành công
       

        //buoc 2: bước quan trọng :return  lai aixios instance của chúng ta kết hợp với cái originalRequests gọi lại những api ban đầu bị lỗi
        return authorizeAxiosInstance(originalRequests)
      })
    }


    //xử lý tập trung phần hiển thị tb lỗi trả về từ mọi api (viết code 1 lần : clean code)
    // console.log erorr ra là sẽ thấy cấu trúc data dẫn tới messeage lỗi như dưới đây
    
    let errorMessage = error?.errorMessage
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }
    // dung  toastifly de hien thi bat ke moi loi len man hinh - ngoai tru ma 410 - GONE phuc vu viec tu dong refresh lai token
    if( error.response?.status !== 410){
      toast.error(errorMessage)
    }


    return Promise.reject(error)
  })

export default authorizeAxiosInstance