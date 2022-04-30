import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExemptionOrder from './components/exemptionorder/ExemptionOrder';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <main>
    <div class="container vstack gap-5">
      <React.StrictMode>
        <ExemptionOrder />
      </React.StrictMode>
    </div>
  </main>
);