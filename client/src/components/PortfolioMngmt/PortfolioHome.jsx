import axios from "axios";
import React, {useContext} from "react";
import { useEffect } from "react";
import styled from "styled-components";
import BasketContext from "../contexts/BasketContext";
import PortfolioBasket from "./PortfolioBasket";
import configOptions from '../../api/configOptions';
import _ from 'lodash';

export default function PortfolioHome() {

  const { baskets, setBaskets } = useContext(BasketContext);
  
  const auth =  localStorage.getItem("auth")
  const token = localStorage.getItem("token")
  const baseUrl = process.env.REACT_APP_BASE_URL;  

  useEffect( ()=>{
    fetchData();
    async function fetchData (){
      
        const response = await axios.get(`${baseUrl}/api/baskets/userBaskets`, { headers: { Authorization: "Bearer: " + token } });
        if(response.statusText === "OK"){
            // console.log(response.data);
            let temp = [];
            response.data.map(item =>{
                let obj = {
                    "id": item._id,
                    "author": item.author,
                    "basketName": item.basketName,
                    "risk": item.risk,
                    "volatility": item.volatility,
                    "subscriptionFee": item.subscriptionFee,
                    "overview": item.overview,
                    "details": item.details
                }
                temp.push(obj);             
            })
              setBaskets(temp);
              // console.log("temp: ", temp);
              // console.log("baskets: ", baskets);
         }
    }
  }, []);

  const handleRemoveBox = async (id) => {

    const headers = {
      "content-type": "application/json",
      "Authorization": "Bearer: " + token
    };

    const options = {
      json: true 
    };

    configOptions("DELETE", headers, options);

    const response = await fetch(`${baseUrl}/api/baskets/deleteBasket/${id}`, options);
    console.log(response);
    if(response.ok){
      response.json().then(() => {
        // console.log(response.statusText);
        setBaskets(baskets.filter((basket) => basket.id !== id));
      })
    }
    else{
      console.log(response.statusText);
    }  
  };

  return (
    <React.Fragment>
        <div className="flexList container" style={{minHeight: "70vh"}}>
             {!_.isEmpty(baskets) ? (
                baskets.map((basket)=>(
                    <PortfolioBasket key={basket.basketName} {...basket} handleRemoveBox={handleRemoveBox} />
                ))
             ) : (
                <p>Currently, there is no basket.</p>
             )}
        </div>
    </React.Fragment>
  )
}

