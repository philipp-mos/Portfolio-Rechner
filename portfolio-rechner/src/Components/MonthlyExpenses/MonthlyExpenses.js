import { FormatFloatValue, FormatPriceValue } from '../../Helper/NumberHelper';
import PortfolioDataProvider from '../../Data/PortfolioDataProvider';



function MonthlyExpenses() {
  let portfolioDataProvider = new PortfolioDataProvider();

  let expensesTotal = 0;

  let expenses = portfolioDataProvider.getExpenses();

  expenses.forEach((expense) => {
    expensesTotal += expense.amount;
  });

  let percentageToIncome = (expensesTotal / portfolioDataProvider.getMonthlyIncome()) * 100;

  expenses.sort((a, b) => {
    return b.amount - a.amount;
  });


  return (
      <div class="row">
        <div class="col-12">
          <h3>Monatliche Ausgaben:</h3>
          <div><span class="fw-bold">Gesamtausgaben:</span> {FormatPriceValue(expensesTotal)}</div>
          <div><span class="fw-bold">Anteil am Einkommen:</span> {FormatFloatValue(percentageToIncome)} %</div>
                    
          <table class="table table-striped table-responsive">
            <colgroup>
              <col width="250" />
              <col width="150" />
            </colgroup>
            <thead>
              <tr>
                <th class="text-start">Titel</th>
                <th class="text-end">Betrag</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => {
                return (
                  <tr key={expense.title}>
                    <td>{expense.title}</td>
                    <td class="text-end">{FormatPriceValue(expense.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default MonthlyExpenses;
