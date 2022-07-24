import { FormatPriceValue } from '../../Helper/NumberHelper';
import PortfolioDataProvider from '../../Data/PortfolioDataProvider';



function ExemptionOrder() {
  let portfolioDataProvider = new PortfolioDataProvider();

  let exemptionOrderTotal = 0;
  let exemptionOrderUsed = 0;

  let exemptionOrders = [];

  portfolioDataProvider.getDepotsOrAccounts().forEach((depotOrAccount) => {
    if (depotOrAccount.exemptionOrder == null) {
      return;
    }

    exemptionOrders.push({
      'title': depotOrAccount.title,
      'amount': depotOrAccount.exemptionOrder.amount,
      'alreadyUsed': depotOrAccount.exemptionOrder.alreadyUsed
    });


    exemptionOrderTotal += depotOrAccount.exemptionOrder.amount;
    exemptionOrderUsed += depotOrAccount.exemptionOrder.alreadyUsed;
  });


  exemptionOrders.sort((a, b) => {
      return b.amount - a.amount;
  });

  return (
      <div class="row">
        <div class="col-12">
          <h3>Freistellungsaufträge:</h3>
          <div><span class="fw-bold">Gesamtfreistellungsauftrag:</span> {FormatPriceValue(exemptionOrderTotal)}</div>
          <div><span class="fw-bold">Bereits verwendet:</span> {FormatPriceValue(exemptionOrderUsed)}</div>
          <div><span class="fw-bold">Noch verfügbar:</span> {FormatPriceValue(exemptionOrderTotal - exemptionOrderUsed)}</div>
                    
          <table class="table table-striped table-responsive">
            <colgroup>
              <col width="250" />
              <col width="150" />
              <col width="150" />
              <col width="150" />
            </colgroup>
            <thead>
              <tr>
                <th class="text-start">Titel</th>
                <th class="text-end">Freistellung bis</th>
                <th class="text-end">Bereits verwendet</th>
                <th class="text-end">Noch verfügbar</th>
              </tr>
            </thead>
            <tbody>
              {exemptionOrders.map(item => {
                if (item.amount <= 0 && item.alreadyUsed <= 0) {
                  return; 
                }

                return (
                  <tr key={item.title}>
                    <td>{item.title}</td>
                    <td class="text-end">{FormatPriceValue(item.amount)}</td>
                    <td class="text-end">{FormatPriceValue(item.alreadyUsed)}</td>
                    <td class="text-end">{FormatPriceValue(item.amount - item.alreadyUsed)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default ExemptionOrder;
