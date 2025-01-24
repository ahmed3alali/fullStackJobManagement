import { Link, Form, redirect, useNavigate, useNavigation } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo, SubmitBtn } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';





export const action = async({request}) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post('/auth/login', data);
    toast.success('Login successfully completed');
    return redirect('/dashboard');  // Use redirect here
  } catch (error) {
    toast.error('Login failed');
    return error;
  }
}



const Login = () => {

const navigation = useNavigation();
const isSubmitting = navigation.state ==='submitting';


  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo />
        <h4>login</h4>
        <FormRow type='email' name='email' />
        <FormRow type='password' name='password' />
        
        <button type='submit' className='btn btn-block' disabled={isSubmitting}>


        {isSubmitting ? 'Submitting...' : 'Submit'}


        </button>




        <button type='button' className='btn btn-block' >
          explore the app
        </button>
        <p>
          Not a member yet?
          <Link to='/register' className='member-btn'>
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Login;
