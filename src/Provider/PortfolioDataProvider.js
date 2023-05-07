import portfolioData from '../data/data.json';

export default class PortfolioDataProvider {
    getAll = () => portfolioData;

    getRelevantPortfolioItemsOrdered = () => {
        return portfolioData.portfolioItems
        .filter((x) => { return x.isRelevant })
        .sort((a, b) => {
            return b.currentValue - a.currentValue;
        });
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


    getExpenses() {
        return portfolioData.expenses;
    }

    getExpensesTotalAmount() {
        var amount = 0;

        portfolioData.expenses.forEach((expense) => {
            amount += expense.amount;
        });

        return amount;
    }

    getMonthlyIncome() {
        return portfolioData.monthlyIncome;
    }

    getPensionConfig() {
        return portfolioData.pension;
    }
}