import {useRef, useState, useEffect } from "react";
import {faCheck, faTimes, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import React from 'react'
import axios from './api/axios';
// import {useHistory} from "react-router-dom"



const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%]),{8,24}$/;
// const PWD_REGEX = /^(.{8,}$)/;
const PWD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:`.,/'|"<>?])(?=.*[0-9]).{8,}$/;
const Register_url = 'http://localhost:8080/e-library/registerUser';



const Register = () => {
    const userRef = useRef();
    const errRef = useRef();
    // const history = useHistory();
    


    const [username, setUsername] = useState ('');
    const [validName, setValidName] = useState (false);
    const [usernameFocus, setUsernameFocus] = useState (false);

    const [password, setPassword] = useState ('');
    const [validPassword, setValidPassword] = useState (false);
    const [passwordFocus, setPasswordFocus] = useState (false);

    const [matchPassword, setMatchPassword] = useState ('');
    const [validMatch, setValidMatch] = useState (false);
    const [matchFocus, setMatchFocus] = useState (false);

    const [errMsg, setErrMsg] = useState ('');
    const [success, setSuccess] = useState (false);

    useEffect (()=> {
        userRef.current.focus()
    }, []) 

    useEffect (()=> {
        const result = USER_REGEX.test(username);
        console.log(result);
        console.log(username);
        setValidName(result);
    }, [username]);

    useEffect (()=> {
        const result = PWD_REGEX.test(password);
        console.log(result);
        console.log(password);
        setValidPassword(result);
        const match = password === matchPassword;
        setValidMatch(match);
    }, [password, matchPassword]);

    useEffect (() => {
        setErrMsg('')
    }, [username, password, matchPassword]);
    
    const handleSubmit = async (e) =>{
        e.preventDefault();

        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
       try{
        const response = await axios.post(Register_url,
             JSON.stringify({username, password}),
             {
                headers: {'content-Type': 'application/json'},
                withCredentials: true
             }
             );
             console.log(response.data);
             console.log(response.accessToken);
             console.log(JSON.stringify(response))
            //  history.push("/Login")
             setSuccess(true)
       }catch(err){
            if(!err?.response){
                setErrMsg('No Server Response');
            }else if(err.response?.status === 409){
                setErrMsg('Username Taken');
            }else{
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
       }

    }

  return (
    <>
    { success ? (
        <a href="./Login.js">
             
        </a>
        // <section>
        //     <h1>Success!</h1>
        //     <p>
        //         <a href="./Login.js"> Sign In</a>
        //     </p>
        // </section>
    ) : (


        <section>
            <p ref={errRef} className={errMsg ? "errmsg" :
            "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
            <label htmlFor="usernmae">
                Username:
                <span className={validName ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck}/>
                </span>
                <span className={validName || !username ? "hide" :
                "invalid"}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
                </label>
            <input
                type="text"
                id="username"
                ref={userRef}   
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-invalid={validName ? "false": "true"}
                aria-describedby="uidnote"
                onFocus={() => setUsernameFocus(true)}
                onBlur={() => setUsernameFocus(false)}
            />
            <p id="uidnote" className={usernameFocus && username && !validName ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                4 to 24 characters. <br/>
                Must beging with a letter. <br/>
                Letters, numbers, underscores, hyphens allowed.
            </p>
            <label htmlFor="password">
                Password:
                <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
            </label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(()=>{ 

                        return e.target.value
                    })}
                    value={password}
                    required
                    aria-invalid={validPassword ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                />
            <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.<br />
                Must include uppercase and lowercase letters, a number and a special character.<br />
                Allowed special characters: <span aria-label="exclamation mark">!</span>
                <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>
                <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>
            <label htmlFor="confirm_pwd">
                    Confirm Password:
                    <FontAwesomeIcon icon={faCheck} className={validMatch &&
                        matchPassword ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validMatch ||
                        !matchPassword ? "hide" : "invalid"} />
                </label> 
                <input
                    type="password"
                    id="confirm_pwd"
                    onChange={(e) => setMatchPassword(e.target.value)}
                    value={matchPassword}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                />
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                </p>

                <button disabled={!validName || !validPassword || !validMatch ? true : false}>Sign Up</button>


            </form>
            <p>
                Already registered?<br />
                <span className="line">
                    {/*put router link here*/}
                    {/* <a href="#">Sign In</a> */}
                    <button>Sign In</button>
                </span>
            </p>
            </section>
        )}
    </>
  )
}

export default Register


