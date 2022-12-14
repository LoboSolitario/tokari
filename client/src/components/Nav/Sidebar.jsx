import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
// Assets
import CloseIcon from "../../assets/svg/CloseIcon";
import LogoIcon from "../../assets/svg/Logo";

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  return (
    <Wrapper className="animate darkBg" sidebarOpen={sidebarOpen}>
      <SidebarHeader className="flexSpaceCenter">
        <div className="flexNullCenter">
          <LogoIcon />
          <h1 className="whiteColor font20" style={{ marginLeft: "15px" }}>
            Tokari
          </h1>
        </div>
        <CloseBtn onClick={() => toggleSidebar(!sidebarOpen)} className="animate pointer">
          <CloseIcon />
        </CloseBtn>
      </SidebarHeader>

      <UlStyle className="flexNullCenter flexColumn">
        <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeclass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            to="/"
            offset={-60}
          >
            Home
          </Link>
        </li>
        
        {localStorage.getItem("role") === "manager"?
          (<Link
            to="/portfoliomain"
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeclass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            offset={-60}
          > 
          <li className="semiBold font15 pointer">
              Management
          </li>
          </Link>):
          localStorage.getItem("role") === "investor"?
          (<Link
           to="/investormain/subscriptions"
           onClick={() => toggleSidebar(!sidebarOpen)}
            activeclass="active"
            className="whiteColor"
            style={{ padding: "10px 15px" }}
            offset={-60}
          >
          <li className="semiBold font15 pointer">
            Investments
          </li>
          </Link>)
         :
         (<Link to="/login">
         </Link>
          )}
        <li className="semiBold font15 pointer">
          <Link
            onClick={() => toggleSidebar(!sidebarOpen)}
            activeclass="active"
            className="semiBold font15 pointer radius8 lightBg"
            style={{ padding: "10px 15px" }}
            to="/discover"
            offset={-60}
          >
            Discover
          </Link>
        </li>
        <li className="semiBold font15 pointer">
          {localStorage.getItem("token")?(
            <Link onClick={()=>{
              localStorage.clear();
            }}
              to="/login"
              activeclass="active"
              className="whiteColor"
              style={{ padding: "10px 15px" }}
              offset={-60}
              >
                Logout
            </Link>
          ):( 
            <Link
              onClick={() => toggleSidebar(!sidebarOpen)}
              activeclass="active"
              className="whiteColor"
              style={{ padding: "10px 15px" }}
              to="/login"
              offset={-60}
            >
              Login
            </Link>
          )}
        </li>

        
  
      </UlStyle>
      {/* <UlStyle className="flexSpaceCenter">
        <li className="semiBold font15 pointer">
          <a href="/" style={{ padding: "10px 30px 10px 0" }} className="whiteColor">
            Log in
          </a>
        </li>
        <li className="semiBold font15 pointer flexCenter">
          <a href="/" className="radius8 lightBg" style={{ padding: "10px 15px" }}>
            Get Started
          </a>
        </li>
      </UlStyle> */}
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  width: 400px;
  height: 100vh;
  position: fixed;
  top: 0;
  padding: 0 30px;
  right: ${(props) => (props.sidebarOpen ? "0px" : "-400px")};
  z-index: 9999;
  @media (max-width: 400px) {
    width: 100%;
  }
`;
const SidebarHeader = styled.div`
  padding: 20px 0;
`;
const CloseBtn = styled.button`
  border: 0px;
  outline: none;
  background-color: transparent;
  padding: 10px;
`;
const UlStyle = styled.ul`
  padding: 40px;
  li {
    margin: 20px 0;
  }
`;
