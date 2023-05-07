import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Rebalancing from './Components/Rebalancing/Rebalancing';
import ExemptionOrder from './Components/ExemptionOrder/ExemptionOrder';
import MonthlyExpenses from './Components/MonthlyExpenses/MonthlyExpenses';
import AccountUsage from './Components/AccountUsage/AccountUsage';
import PensionOverview from './Components/PensionOverview/PensionOverview';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <main>
    <div class="container vstack gap-5">
      <div class="row">
        <div class="col-12">
          <h1>Portfolio-Rechner</h1>
        </div>
      </div>
      <React.StrictMode>
        <PensionOverview />
        <Rebalancing />
        <ExemptionOrder />
        <MonthlyExpenses />
        <AccountUsage />
      </React.StrictMode>
    </div>
  </main>
);