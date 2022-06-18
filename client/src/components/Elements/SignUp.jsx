import React from 'react'
import styled from 'styled-components';
import FullButton from "../Buttons/FullButton";
import { useRef, useState } from "react";
import Form from 'react-bootstrap/Form'
import {useNavigate}  from "react-router-dom";

const SignUp = () => {

  const errRef = useRef();
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [role, setRole] = useState('');  
  const [matchPwd, setMatchPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  let navigate = useNavigate();
  const handleSubmit = async (e) => {
      e.preventDefault();

      if (!((pwd).length > 5)) {
          setErrMsg("Password must be at least 5 characters long!");
          return;
      }
      else if (pwd !== matchPwd) {
        setErrMsg("Passwords don't match!");
        return;
      }
      else{
        try {
          options.body = JSON.stringify({
                "name": user,
                "email": email,
                "password": pwd,
                "role": role
              });
          const configOptions = (method, headers) => {
            options.headers = headers == null ? new Headers() : headers;
            options.method = method
          };
          
          const baseUrl = "http://localhost:4600/api/users/register";  
          configOptions("POST", headers)
          const response = await fetch(`${baseUrl}`, options);
          
          console.log(response);
         
          navigate("/");
          setSuccess(true);
          setUser('');
          setPwd('');
          setMatchPwd('');
          setRole("");
          options.body = JSON.stringify({});
        }
         catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
      }
  }

    return (
    <Wrapper className="container flexSpaceCenter">
      <form onSubmit={handleSubmit}> 
        <h3 className='semiBold'>Sign Up</h3>
        <br/>
        <div className="mb-3">
          <label htmlFor="username">Full name</label>
          <input
            type="text"
            className="form-control font13"
            onChange={(e) => setUser(e.target.value)}
            placeholder="Full name"
            required
          />
        </div>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control font13"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            value={email}
            required
          />
        </div>
        
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            id="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="form-control font13"
            placeholder="Enter password"
            reqired
          />
        </div>
        <div className="mb-3">
          <label>Confirm password</label>
          <input
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            className="form-control font13"
            placeholder="Confirm password"
            required
          />
        </div>
        <div className="d-grid">
        
        <label>Role: </label>
        <Form>
          {['radio'].map((type) => (
            <div key={`inline-${type}`} 
                 className="mb-3" 
                 onChange={(e)=> setRole(e.target.value)}>
              <Form.Check 
                style={{marginLeft: "30px"}}
                label="I'm an investor"
                name="group1"
                value="investor"
                type={type}
                defaultChecked
                id={`inline-${type}-1`}
              />
              <Form.Check
                style={{marginLeft: "30px"}}
                label="I'm a fund manager"
                value="manager"
                name="group1"
                type={type}
                id={`inline-${type}-2`}
              />
            </div>
          ))}
        </Form>
        <p style={{color:"red", width: "150px"}} ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <BtnWrapper>
            <FullButton title="Register" />
          </BtnWrapper>
        </div>
      </form>
    </Wrapper>
    )
}

const Wrapper = styled.section`
    padding-top: 50px;
    width: max-content;
    @media (max-width: 960px) {
        padding-bottom: 40px;
    }
`;

const BtnWrapper = styled.div`
  max-width: 190px;
  @media (max-width: 960px) {
    margin: 0 auto;
  }
`;

const headers = {
  "Content-Type": "application/json"
};

let options = {
  method: "POST" 
};

export default SignUp