import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SuccessButton from "../Buttons/SuccessButton";
import FullButton from "../Buttons/FullButton"
import {useNavigate}  from "react-router-dom";


const SuccessDisplay = ({ sessionId }) => {
  let navigate = useNavigate();
  return (
    <WrapperLogin className="whiteBg radius8 shadow container">
      <Wrapper className="container flexSpaceCenter flexColumn">
        <div style={{ marginBottom: "20px" }} className="p">Congratuations!! You have sucessfully subscribed to the basket.</div>
        <BtnWrapper onClick={ ()=>{navigate("/investormain/subscriptions");}}>
          <SuccessButton title="Manage Investments" to="/investormain/subscriptions" />
        </BtnWrapper>
      </Wrapper>
      
    </WrapperLogin>

  );
};

const FailureDisplay = () => {
  let navigate = useNavigate();
  return (
    <WrapperLogin className="whiteBg radius8 shadow container">
      <Wrapper className="container flexSpaceCenter flexColumn">
        <div style={{ marginBottom: "20px" }} className="p">Subscription unsuccessful. Checkout the baskets we offer.</div>
        <BtnWrapper onClick={ ()=>{navigate("/discover");}} >
          <FullButton title="Discover More" to="/discover" />
        </BtnWrapper>
      </Wrapper>
      
    </WrapperLogin>

  );
};



export default function StripeContainer() {
  let [success, setSuccess] = useState(false);
  let [sessionId, setSessionId] = useState('');
  
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    
    if (query.get('success')) {
      setSuccess(true);
      setSessionId(query.get('session_id'));
    }

    if (query.get('canceled')) {
      setSuccess(false);
    }
  }, [sessionId]);

  if (success && sessionId !== '') {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <FailureDisplay  />;
  }
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
  max-width: 150px;
  @media (max-width: 960px) {
    margin: 0 auto;
  }
  font-size: 15px;
  font-weight: bold;
`;
