import  { useEffect, useState } from 'react'
import { useSearchParams ,Navigate} from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerification()  {
    // Lay gia tri email va token tu URL
    let [searchParams] = useSearchParams()
    //cach 1
    // console.log(searchParams);
    // const email = searchParams.get('email')
    // const token = searchParams.get('token')
    const {email, token} =Object.fromEntries([...searchParams])

    //tao 1 bien state de biet duoc la da verify tai khoan thanh cong hay chua
    const [verified , setVerified] = useState(false)

    //goi api de verify tai khoan
    useEffect(() => {
        if(email && token){
            verifyUserAPI({email, token}).then(() => setVerified(true))
        }
    }, [email, token])
    
    // nếu url có vấn đề , k tồn tại 1 trong 2 giá trị email hoặc token thì đá ra 404 
    if(!email || !token){
        return <Navigate to ="/404" />
    }
    //neu chua verify xong thi hien loading
    if(!verified){
        return <PageLoadingSpinner caption="Verifying your account..." />
    }
    //cuoi cung k gap van de gi + verify thanh cong thi dieu huong ve trang login cung gia tri verifiedEmail
    return  <Navigate to = {`/login?verifiedEmail=${email}`}/>
}

export default AccountVerification
