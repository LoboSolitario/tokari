import React from 'react'
import { useNavigate } from 'react-router';


export default function InvestmentHeader() {
  let navigate = useNavigate();
  const handleOnClick = () => {
    navigate('createBasket')
  }

  return (
    <div className="container" 
         style={{
            display: "in-block",
            marginTop: "100px", 
            marginBottom: "0px"}}
            >
      <div className="semiBold font30 pointer">
              Investment Management

      </div>
    </div>
  )
}
