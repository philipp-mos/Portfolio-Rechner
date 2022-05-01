import portfolioData from '../data.json';

export default class PortfolioDataProvider {
    getAll = () => {
        return portfolioData;
    }


    getPortfolioItemsOrderedByCurrentValue = () => {
        return portfolioData.portfolioItems
                .sort((a, b) => {
                    return b.currentValue - a.currentValue;
                });
    }


    getDepotOrAccountById(depotOrAccountId) {
        const depotOrAccount =  portfolioData.depotsOrAccounts.find(
            ({ id }) => id === depotOrAccountId
        );

        if (depotOrAccount === null) {
            return '-';
        }

        return depotOrAccount.title;
    }


    getDepotsOrAccounts() {
        return portfolioData.depotsOrAccounts;
    }
}