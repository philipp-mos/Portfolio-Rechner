import { FormatPriceValue } from '../../Helper/NumberHelper';
import PortfolioDataProvider from '../../Provider/PortfolioDataProvider';
import FeatureProvider from '../../Provider/FeatureProvider';


function PensionOverview() {
  let featureProvider = new FeatureProvider();

  if (!featureProvider.isFeatureActive(featureProvider.pensionOverview)) {
    return null;
  }

  let portfolioDataProvider = new PortfolioDataProvider();


  let pensionConfig = portfolioDataProvider.getPensionConfig();
  let currentAge = new Date().getFullYear() - pensionConfig.birthYear - 1;
  let remainingYears = pensionConfig.finalAge - currentAge;


  let portfolioItems = portfolioDataProvider.getRelevantPortfolioItemsOrdered();

  let totalAssets = 0;

  portfolioItems.forEach((item) => {
    totalAssets += item.currentValue;
  });


  let totalPensionAmount = pensionConfig.monthlyPension + pensionConfig.legalPension + pensionConfig.privateInsurance;


  return (
      <div class="row">
        <div class="col-12">
          <h3>Rentenrechner:</h3>
          <div><span class="fw-bold">Monatlicher Nettobetrag:</span> {FormatPriceValue(pensionConfig.monthlyPension)}</div>
          <div><span class="fw-bold">Eintrittsalter:</span> {pensionConfig.finalAge} Jahre</div>
          <div><span class="fw-bold">Jahre bis Rente:</span> {remainingYears} Jahre</div>
          
          <div><span class="fw-bold">Aktuell verfügbar:</span> {FormatPriceValue(totalAssets)}</div>
          <div><span class="fw-bold">Zusätzlich benötigtes Kapital:</span> {FormatPriceValue(pensionConfig.requiredBalance - totalAssets)}</div>
          <div><span class="fw-bold">Monatliche Sparrate:</span> {FormatPriceValue(pensionConfig.monthlySavingRate)}</div>
          <br />
          <div><span class="fw-bold">Rente gesetzlich:</span> {FormatPriceValue(pensionConfig.legalPension)}</div>
          <div><span class="fw-bold">Priv. Rentenversicherung:</span> {FormatPriceValue(pensionConfig.privateInsurance)}</div>
          <br />
          <div><span class="fw-bold">Monatliche Rente gesamt:</span> {FormatPriceValue(totalPensionAmount)}</div>
        </div>
      </div>
  );
}

export default PensionOverview;
