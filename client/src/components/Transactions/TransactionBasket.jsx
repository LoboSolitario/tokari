import React from "react";
import styled from "styled-components";

const TransactionBasket = ({
  transaction 
}) => {
  return (
    <Wrapper className="whiteBg radius8 shadow basket">
        <div className="wrapper-header flexSpaceCenter">
          <h3 className="font15 extraBold">
            {transaction.basketName}
          </h3>
          <p className='flexWrapper30 font13'>{transaction.investmentAmount}</p>
        </div>
        <div>
          <div className="container">
          {(transaction.cryptoAlloc) && transaction.cryptoAlloc.map(allocation => 
            <div className='flexSpaceCenter tableStripe'> 
                <p className='flexWrapper30 font13'>{allocation.orderId}</p>
                <p className='flexWrapper30 font13'>{allocation.cryptoCurrency}</p>                                                       
                <p className='flexWrapper60 font13'>{allocation.orderQty}</p>                                              
                <p className='flexWrapper30 font13'>{allocation.price}</p>
                <p className='flexWrapper30 font13'>{(allocation.price * allocation.orderQty).toFixed(3)}</p>
            </div>)}
          </div>
        </div>
    </Wrapper>

  );
}

const Wrapper = styled.div`
width: 100%;
text-align: left;
padding: 20px 30px;
margin-top: 30px;
`;

export default TransactionBasket;