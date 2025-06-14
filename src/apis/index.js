import { toast } from 'react-toastify'
import authorizeAxiosInstance from '~/utitls/authorizeAxios'
import { API_ROOT } from '~/utitls/constants'

/**
 * các function bên dưới chỉ thực hiện request và lấy dữ liệu, không có phần try-catch để xử lý lỗi.
 * Nguyên nhân là ở phía Front-end, không cần thiết phải catch lỗi trong mọi request vì có thể dẫn đến dư thừa mã.
 * Giải pháp: Thay vì xử lý lỗi rải rác, chúng ta sẽ tập trung bắt lỗi tại một nơi duy nhất bằng cách sử dụng Interceptors – 
 * một tính năng rất mạnh của authorizeAxiosInstance.
 * Interceptors giúp chặn giữa request hoặc response để xử lý logic theo cách chúng ta mong muốn.
 * (Trong khóa học MERN Stack Advance, mình sẽ hướng dẫn chi tiết cách sử dụng và áp dụng Interceptors một cách chuẩn chỉnh.)
 */
//Board
// da move vao reduxe
// export const fetchBoardDetailsAPI = async (boardId) =>{
//     const reponse = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
//     // luu y :authorizeAxiosInstance tra ve result qua property cua no la data
//     return reponse.data
// } 

export const updateBoardDetailsAPI = async (boardId, updateData) =>{
  const reponse = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}` ,updateData)
  return reponse.data
} 

export const moveCardToDifferenceColumnAPI = async ( updateData) =>{
  const reponse = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card` ,updateData)
  return reponse.data
} 
//column
export const createNewColumnAPI = async (newColumnData) => {  
 
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
    return response.data.createdColumn 
  }
export const updateColumnDetailsAPI = async (columnId, updateData) =>{
    const reponse = await authorizeAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}` ,updateData)
    return reponse.data
  } 
export const deleteColumnDetailsAPI = async (columnId, updateData) =>{
    const reponse = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}` ,updateData)
    return reponse.data
  }   

//card
export const createNewCardAPI = async (newCardData) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
    return response.data.createdCard 
  }

//users
export const registerUserAPI = async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
     toast.success('Account created succesfully ! Please check and verify your account before loggin in !', {theme :'colored'})
    return response.data 
}  

export const verifyUserAPI = async (data) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
    toast.success('Account verified succesfully ! Now you can loggin to enjoy our services !', {theme :'colored'})
    return response.data 
}  

export const refreshTokenAPI = async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
    return response.data 
} 

export const fetchBoardsAPI = async (searchPath) =>{
    const reponse = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${searchPath}`)
    return reponse.data
} 

export const createNewBoardsAPI = async (data) =>{
    const reponse = await authorizeAxiosInstance.post(`${API_ROOT}/v1/boards`,data)
    toast.success('Boards created succesfully')
    return reponse.data
}

//10/6
export const updateCardDetailsAPI = async (cardId, updateData) =>{
    const reponse = await authorizeAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}` ,updateData)
    return reponse.data
} 
//11/6
export const inviteUserToBoardAPI = async (data) =>{
  const reponse = await authorizeAxiosInstance.post(`${API_ROOT}/v1/invitations/board/` ,data)
  toast.success('User invited to board succesfully')
  return reponse.data
} 
