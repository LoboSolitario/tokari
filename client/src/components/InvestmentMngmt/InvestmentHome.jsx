import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import InvestmentBasket from "./InvestmentBasket";
import configOptions from '../../api/configOptions';
import _ from 'lodash';
import { useNavigate } from "react-router-dom";

export default function InvestmentHome() {

  const [ baskets, setBaskets ] = useState();

  const auth = localStorage.getItem("auth")
  const token = localStorage.getItem("token")
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();


  useEffect(() => {
    fetchData();
    async function fetchData() {

      const response = await axios.get(`${baseUrl}/api/baskets/userInvestedBaskets`, { headers: { Authorization: "Bearer: " + token } });
      if (response.statusText === "OK") {
        let temp = [];
        response.data.map(item => {
          let obj = {
            "id": item._id,
            "owner": item.owner,
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
      }
      else{
        console.log("Error", response.statusText)
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
    if (response.ok) {
      response.json().then(() => {
        setBaskets(baskets.filter((basket) => basket.id !== id));
      })
    }
    else {
      console.log(response.statusText);
    }
  };

  const handleDetailBox = async (id) => {

    const headers = {
      "content-type": "application/json",
      "Authorization": "Bearer: " + token
    };

    const options = {
      json: true
    };

    configOptions("GET", headers, options);
    const response = await fetch(`${baseUrl}/api/baskets/basket/${id}`, options);
    if (response.ok) {
      response.json().then((data) => {
        navigate(`/basket/${id}`, { state: data });
      })
    }
    else {
      console.log(response.statusText);
    }
  };



  return (
    <React.Fragment>
      {/* <div className="flexColumn container" style={{ minHeight: "72vh" }}>
        <div className="font25">
          It sure is quiet here
        </div>
        <div className="greyColor">
          Discover and invest in a basket to start tracking
        </div>


      </div> */}

      <div className="flexListDiscover container" style={{minHeight: "72vh"}}>
        {!_.isEmpty(baskets) ? (
          baskets.map((basket)=>(
              <InvestmentBasket key={basket.id} basket={basket} handleRemoveBox={handleRemoveBox} handleDetailBox={handleDetailBox} />
          ))
        ) : (
          <p>You have not yet subscribed to a basket</p>
        )}
      </div>
    </React.Fragment>
  )
}

