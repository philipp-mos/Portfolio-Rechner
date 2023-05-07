import PortfolioDataProvider from '../../Provider/PortfolioDataProvider';
import FeatureProvider from '../../Provider/FeatureProvider';


function AccountUsage() {
  let featureProvider = new FeatureProvider();

  if (!featureProvider.isFeatureActive(featureProvider.accountUsage)) {
    return null;
  }

  let portfolioDataProvider = new PortfolioDataProvider();


  let data = portfolioDataProvider.getPortfolioItemsOrderedByCurrentValue();
  
  return (
      <div class="row">
        <div class="col-12">
          <h3>Kontenverwendung:</h3>
          <table class="table table-striped table-responsive">
            <colgroup>
                <col width="100" />
                <col width="300" />
            </colgroup>
            <thead>
                <tr>
                    <th class="text-start">Name</th>
                    <th class="text-start">Beschreibung</th>
                </tr>
            </thead>
            <tbody>
              {data.map(item => {

              return (
              <tr key={item.title}>
                <td class="text-start"><span class="fw-bold">{item.title}</span><br />{portfolioDataProvider.getDepotOrAccountById(item.depotOrAccountId)}</td>
                <td class="text-start">{item.description}</td>
              </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default AccountUsage;
