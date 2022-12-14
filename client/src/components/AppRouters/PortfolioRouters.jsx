import React,  { useState }  from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import TopNavbar from '../Nav/TopNavbar';
import PortfolioHome from '../PortfolioMngmt/PortfolioHome';
import PortfolioHeader from '../PortfolioMngmt/PortfolioHeader';
import PortfolioCreate from '../PortfolioMngmt/PortfolioCreate'
import BasketContext from '../contexts/BasketContext';
import Footer from '../../components/Sections/Footer';
import PortfolioEdit from '../PortfolioMngmt/PortfolioEdit';


// Screens
function PortfolioRouters() {
  const [baskets, setBaskets] = useState([]);
  return (
    <div>
      <TopNavbar/>
      <PortfolioHeader/>
      <BasketContext.Provider value={{baskets, setBaskets}}>
        
        <Routes>
          <Route element={<PortfolioHome/>} path="/"/>   
          <Route element={ <PortfolioCreate/>} path="/createBasket"/>
          <Route element={ <PortfolioEdit/>} path="/editBasket/:id"/>
        </Routes> 
        <Routes>
        </Routes>   

      </BasketContext.Provider>
      <Footer/>
    </div>
  
  )
}
export default PortfolioRouters