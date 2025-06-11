import { useForm } from "react-hook-form"
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom' // tính năng zoom lên của form 
import Alert from '@mui/material/Alert'
import {EMAIL_RULE ,PASSWORD_RULE , FIELD_REQUIRED_MESSAGE , PASSWORD_CONFIRMATION_MESSAGE,EMAIL_RULE_MESSAGE } from '~/utitls/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'


function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {register, handleSubmit , formState: {errors}} = useForm()
  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')
  

  const submitLogIn = (data) => {
    const {email , password} = data
        toast.promise( dispatch(loginUserAPI({email , password}) ), { pending :'Logging in...'})
        .then(res => {
          //  console.log(res)
           //doan nay pk kiem tra neu khong co loi(login thanh cong )  thi moi  redirect  ve route /
          if(!res.error) navigate('/')   
        })
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
    {/* <form> */}
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
          <Box sx={{
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
            gap: 1
          }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}><LockIcon /></Avatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}><TrelloIcon /></Avatar>
          </Box>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', color: theme => theme.palette.grey[500] }}>
            Contact : huonghoang789hp@gmail.com 
          </Box>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 1em' }}>
          {verifiedEmail &&
             <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
              Your email&nbsp;
              <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>huonghoang789hp@gmail.com </Typography>
              &nbsp;has been verified.<br />Now you can login to enjoy our services! Have a good day!
            </Alert>
            }

            {registeredEmail && 
              <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                An email has been sent to&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>huonghoang789hp@gmail.com </Typography>
                <br />Please check and verify your account before logging in!
              </Alert>
            }
            
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                // autoComplete="nope"
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                error = {!! errors['email']} // neu ton tai loi cua email 
                // register lay duoc tu react-hook-form o tren
                {...register('email',{
                  required: FIELD_REQUIRED_MESSAGE ,
                  pattern : {
                    value: EMAIL_RULE ,
                    message :EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert  errors={errors} fieldName={'email'}/>
              {/*{errors} la formState: {errors}} */}
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password..."
                type="password"
                variant="outlined"
                error = {!! errors['password']}
                {...register('password',{
                  required: FIELD_REQUIRED_MESSAGE ,
                  pattern : {
                    value: PASSWORD_RULE ,
                    message :PASSWORD_CONFIRMATION_MESSAGE
                  }
                })} 
              />
              <FieldErrorAlert  errors={errors} fieldName={'password'}/>
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Login
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>FPT Telecom Thuy Nguyen </Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Create account!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm
