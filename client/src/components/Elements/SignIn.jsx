import React from 'react'
import styled from 'styled-components';
import FullButton from "../Buttons/FullButton";
import { useRef, useState, useEffect } from "react";
import {useNavigate, NavLink}  from "react-router-dom";
import configOptions from '../../api/configOptions';
import axios from 'axios';
// handle Sign In here and save the auth token/user role

export default function SignIn(){
    const errRef = useRef();
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const baseUrl = process.env.REACT_APP_BASE_URL;  
  
    useEffect(() => {
      setErrMsg('');
    }, [pwd]);

    let navigate = useNavigate();

    async function hasUserCreated (token){
        const options = {
            withCredentials: true,
            json: true 
            };
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        };
        configOptions("GET", headers, options);
        const response = await axios.get(`${baseUrl}/api/users/userDetails`, { headers: { Authorization: "Bearer: " + token } });

        if(response.statusText === "OK"){
            localStorage.setItem("role", response.data.role);
        }
        window.location.reload();
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const options = {
          body: JSON.stringify({
              "email": email,
              "password": pwd
          })
        };
        const headers = {
          "Content-Type": "application/json"
        };

        configOptions("POST", headers, options);  

        const response = await fetch(`${baseUrl}/api/users/login`, options);
        if(response.ok){
          response.json().then(data => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("auth", "true");
            hasUserCreated(data.token);
          })

          setPwd('');
          setEmail('');
          
          options.body = JSON.stringify({});
        }
        else{
          setErrMsg("The email or password is incorrect");
        }  
    }
    return (
      <WrapperLogin className="whiteBg radius8 shadow container">
        {localStorage.getItem("token")?( //Get token, log in successfully
          <Wrapper className="container flexSpaceCenter flexColumn">
                <div style={{marginBottom: "20px"}} className="p">You have been successfully logged in!</div>
              <BtnWrapper onClick={ ()=>{navigate("/");}}>
                <FullButton title="visit home page" to="/"/>
              </BtnWrapper>
            </Wrapper>
        ):( // set data, do post request
          <Wrapper className="container flexSpaceCenter">
            <form onSubmit={handleSubmit} style={{maxWidth: "200px"}}>
              <h3 className='semiBold textCenter'>Sign In</h3>
              <br />
              <div className="mb-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control font13"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control font13"
                  placeholder="Enter password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                />
              </div>
              <div className="d-grid">
              <p style={{color:"red", width: "350px", padding: "0 0 8px 0"}} ref={errRef} className={errMsg ? "font11 errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <BtnWrapper>
                  <FullButton title="Login" />
                </BtnWrapper>
              </div>
              
              <div style={{marginTop: "20px",fontSize: "12px"}} className="flexSpaceCenter">New to Tokari?
                <NavLink  //navigate to sign up page
                  style={{marginLeft: "10px", color: "#7620FF"}}
                  to="/signup"
                  className={"active"}
                >
                  <div className="flexSpaceCenter semiBold font13 pointer">
                    Sign Up
                  </div>
                </NavLink>
              </div>
            </form>
      </Wrapper>
    )
  }
  </WrapperLogin>
  )
}

const WrapperLogin = styled.div`
  width: max-content;
  text-align: left;
  padding: 20px 30px;
  margin-top: 30px;
`;

const Wrapper = styled.section`
    padding-top: 25px;
    width: max-content;
    @media (max-width: 960px) {
    padding-bottom: 40px;
    }
`;

const BtnWrapper = styled.div`
  max-width: 200px;
  @media (max-width: 960px) {
    margin: 0 auto;
  }
`;