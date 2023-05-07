import portfolioData from '../data/data.json';

export default class FeatureProvider {
    accountUsage = 'accountUsage';
    exemptionOrder = 'exemptionOrder';
    monthlyExpenses = 'monthlyExpenses';
    pensionOverview = 'pensionOverview';
    rebalancing = 'rebalancing';


    isFeatureActive(featureName) {
        let features = portfolioData.featureActivation;

        switch(featureName){
            case this.accountUage:
                return features.accountUsage;
                
            case this.exemptionOrder:
                return features.exemptionOrder;
                
            case this.monthlyExpenses:
                return features.monthlyExpenses;
                
            case this.pensionOverview:
                return features.pensionOverview;
                
            case this.rebalancing:
                return features.rebalancing;

            default:
                return false;
        }
    }




}