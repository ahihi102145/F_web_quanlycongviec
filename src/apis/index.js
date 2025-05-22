import axios from 'axios'
import { API_ROOT } from '~/utitls/constants'

/**
 * các function bên dưới chỉ thực hiện request và lấy dữ liệu, không có phần try-catch để xử lý lỗi.
 * Nguyên nhân là ở phía Front-end, không cần thiết phải catch lỗi trong mọi request vì có thể dẫn đến dư thừa mã.
 * Giải pháp: Thay vì xử lý lỗi rải rác, chúng ta sẽ tập trung bắt lỗi tại một nơi duy nhất bằng cách sử dụng Interceptors – 
 * một tính năng rất mạnh của axios.
 * Interceptors giúp chặn giữa request hoặc response để xử lý logic theo cách chúng ta mong muốn.
 * (Trong khóa học MERN Stack Advance, mình sẽ hướng dẫn chi tiết cách sử dụng và áp dụng Interceptors một cách chuẩn chỉnh.)
 */
//Board
export const fetchBoardDetailsAPI = async (boardId) =>{
    const reponse = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    // luu y :axios tra ve result qua property cua no la data
    return reponse.data
} 

export const updateBoardDetailsAPI = async (boardId, updateData) =>{
  const reponse = await axios.put(`${API_ROOT}/v1/boards/${boardId}` ,updateData)
  return reponse.data
} 

export const moveCardToDifferenceColumnAPI = async ( updateData) =>{
  const reponse = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card` ,updateData)
  return reponse.data
} 
//column
export const createNewColumnAPI = async (newColumnData) => {  
 
    const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
    return response.data.createdColumn 
  }
export const updateColumnDetailsAPI = async (columnId, updateData) =>{
    const reponse = await axios.put(`${API_ROOT}/v1/columns/${columnId}` ,updateData)
    return reponse.data
  } 
export const deleteColumnDetailsAPI = async (columnId, updateData) =>{
    const reponse = await axios.delete(`${API_ROOT}/v1/columns/${columnId}` ,updateData)
    return reponse.data
  }   

//card
export const createNewCardAPI = async (newCardData) => {
    const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
    return response.data.createdCard 
  }
  