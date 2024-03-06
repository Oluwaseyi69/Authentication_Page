import React from 'react'
import {useRef, useState, useEffect, useContext } from "react";
import AuthContext from './Context/AuthProvider';
import axios from './api/axios';  
import { Link } from 'react-router-dom';


const login_url = 'http://localhost:8080/e-library/LoginUser'

const Login = () => {
  const {setAuth} = useContext(AuthContext );

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);


  useEffect (()=> {
    userRef.current.focus()
}, []) 

  useEffect (()=> {
    setErrMsg('')
  }, [username, password]);

  const handleSubmit = async (e) =>{
    e.preventDefault();

    try {
      const response = await axios.post(login_url, 
        JSON.stringify({username, password}),
        {
          headers: {'content-Type': 'application/json'},
          withCredentials: true
        }
      );
      console.log(JSON.stringify(response?.data));

      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;

      setAuth({username, password, roles, accessToken})
      setUsername('');
      setPassword('');
      setSuccess(true);
      
    } catch (error) {
      if(!error?.response){
        setErrMsg('No Server Response')
      } else if(error.response?.status === 400){
        setErrMsg('Missing Username or Password');
        setUsername('');
        setPassword('');
        setSuccess(true); 
      } else if(error.response?.status === 401){
        if(!error.response?.data?.message === 'Username'){
          setErrMsg('Invalid Credentials')
        }else{
          setErrMsg('Invalid Username or password')
        }
        
      } else{
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }

  
  }

  return (
    <>
        {success ? (
          <section>
            <h1>You are logged in!</h1>
            <br/>

            <p>
              <a href='#'>Go Home</a>
            </p>
          </section>
        ) :(
    

    <section>
      <p ref={errRef} className={errMsg ? "errmsg" :
       "offscreen"} aria-live='assertive'> {errMsg}</p>
       <h1>Sign In</h1>

       <form on onSubmit={handleSubmit}>
          <label htmlFor='username'>Username</label>
          <input
           type='text' 
           id='username'
           ref={userRef}
           autoComplete='off'
           onChange={(e) => setUsername(e.target.value)}
           value={username}
           required
           />

          <label htmlFor='password'>Password</label>
          <input
           type='password' 
           id='password'
           autoComplete='off'
           onChange={(e) => setPassword(e.target.value)}
           value={password}
           required
           />

           <button>Sign In</button>
       </form>
       <p>
        Need an Account? <br/>    
        <span className='line'>
          {/* <Link to='/register'>Sign Up</Link> */}
          <a href='#'>Sign Up</a>
        </span>
       </p>
    </section>
        )}
      </>
  )
}

export default Login