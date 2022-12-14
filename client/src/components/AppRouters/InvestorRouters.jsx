import { Routes, Route } from 'react-router-dom'
import TopNavbar from '../Nav/TopNavbar';
import InvestmentHeader from '../InvestmentMngmt/InvestmentHeader';
import Footer from '../../components/Sections/Footer';
import React from 'react';
import SubscriptionHome from '../InvestmentMngmt/SubscriptionHome'
import InvestmentHome from '../InvestmentMngmt/InvestmentHome';
import InvestorNavbar from '../Nav/InvestorNavbar';
import TransactionHome from '../Transactions/TransactionHome';

function InvestorRouters() {

  return (
    <div>
      <TopNavbar/>
      <InvestmentHeader />
      <InvestorNavbar/>
        <Routes>
          <Route element={<SubscriptionHome />} path="/subscriptions" />
        </Routes>
        <Routes>
        </Routes>
        <Routes>
          <Route element={<InvestmentHome />} path="/investments" />
        </Routes>
        <Routes>
        </Routes>
        <Routes>
          <Route element={<TransactionHome />} path="/transactions" />
        </Routes>
        <Routes>
        </Routes>
      <Footer />
    </div>
  )
}

export default InvestorRouters