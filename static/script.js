{
    let portfolioData = {};


    /**
     * Load Portfolio Configuration from Json and save in variable
     */
    const getPortfolioData = () => {
        const request = new XMLHttpRequest();
        request.open('GET', `data.json?v=${new Date().toLocaleString()}`, false);
        request.send(null);

        portfolioData = JSON.parse(request.responseText);

        portfolioData.portfolioItems.sort((a, b) => (a.targetPercentage < b.targetPercentage ? 1 : -1));
    }


    /**
     * Initialize PortfolioResults and trigger Building the Entries
     * @returns
     */
    const initPortfolioResults = () => {
        const portfolioResults = document.getElementById('portfolioresults');

        if (portfolioResults === null) {
            return;
        }

        buildPortfolioResults(portfolioResults);
    }


    /**
     * Calculate some general Values and trigger individual calculations
     * @param {HTMLElement} portfolioResultsTable
     * @returns
     */
    const buildPortfolioResults = (portfolioResultsTable) => {
        let portfolioTotalAssets = 0;
        let portfolioTotalPercentage = 0;

        portfolioData.portfolioItems.forEach((portfolioItem) => {
            portfolioTotalAssets += Number.parseFloat(portfolioItem.currentValue);
            portfolioTotalPercentage += Number.parseFloat(portfolioItem.targetPercentage);
        });

        const totalAssetsInfo = document.getElementById('portfoliototalassets');
        totalAssetsInfo.innerText = `${formatFloatingNumber(portfolioTotalAssets)} €`;

        const totalPercentageInfo = document.getElementById('portfoliototalpercentage');
        totalPercentageInfo.innerText = `${formatFloatingNumber(portfolioTotalPercentage)} %`;

        if (portfolioTotalAssets === 0) {
            return;
        }

        if (portfolioTotalPercentage > 100) {
            const percentageError = document.getElementById('portfoliopercentageerror');
            percentageError.innerText = `Gesamtprozentzahl reduzieren (${formatFloatingNumber(portfolioTotalPercentage)} %)`;
            percentageError.classList.add('color--negative');
        }

        calculateValuesAndTriggerBuildingRows(portfolioResultsTable, portfolioTotalAssets);
    }


    /**
     * Individual Calculation and saving Values in global array
     * Starts building single Table Rows
     * @param {HTMLElement} portfolioResultsTable
     * @param {number} portfolioTotalAssets
     */
    const calculateValuesAndTriggerBuildingRows = (portfolioResultsTable, portfolioTotalAssets) => {
        const tbodyElement = portfolioResultsTable.querySelectorAll('tbody')[0];

        portfolioData.monthlySavings = 0;
        portfolioData.interestInitialAmount = 0;

        portfolioData.portfolioItems.forEach((portfolioItem) => {
            portfolioItem.currentPercentage = (portfolioItem.currentValue / portfolioTotalAssets) * 100;
            portfolioItem.targetValue = portfolioTotalAssets * (portfolioItem.targetPercentage / 100);
            portfolioItem.changeValue = portfolioItem.targetValue - portfolioItem.currentValue;


            if (portfolioItem.changeValue > 0) {
                portfolioItem.changeValueText = `<span class="font-bold color--positive">Buy: ${formatFloatingNumber(portfolioItem.changeValue)} €</span>`;
            }
            else if (portfolioItem.changeValue < 0 && portfolioItem.changeValue > portfolioData.rebalancingNegativeHoldDelay) {
                portfolioItem.changeValueText = `<span class="font-bold color--neutral">Hold: (${formatFloatingNumber(portfolioItem.changeValue)} €)</span>`;
            }
            else if (portfolioItem.changeValue < 0) {
                portfolioItem.changeValueText = `<span class="font-bold color--negative">Sell: ${formatFloatingNumber(portfolioItem.changeValue * -1)} €</span>`;
            }
            else {
                portfolioItem.changeValueText = '-';
            }

            buildTableRow(tbodyElement, portfolioItem);
        });
    }


    /**
     * Build a Table Row for a single Portfolio-Item
     * @param {HTMLElement} tbodyElement
     * @param {object} portfolioItem
     */
    const buildTableRow = (tbodyElement, portfolioItem) => {
        const row = tbodyElement.insertRow();

        const cell1 = row.insertCell();
        const cell2 = row.insertCell();
        const cell3 = row.insertCell();
        const cell4 = row.insertCell();
        const cell5 = row.insertCell();
        const cell6 = row.insertCell();
        const cell7 = row.insertCell();
        const cell8 = row.insertCell();
        const cell9 = row.insertCell();

        cell1.innerHTML = `<span class="font-bold">${portfolioItem.title}</span><br />(${getDepotOrAccountTitleById(portfolioItem.depotOrAccountId)})`;
        cell2.innerText = `${formatFloatingNumber(portfolioItem.currentPercentage)} %`;
        cell3.innerText = `${formatFloatingNumber(portfolioItem.currentValue)} €`;
        cell4.innerText = `${formatFloatingNumber(portfolioItem.targetPercentage)} %`;
        cell5.innerText = `${formatFloatingNumber(portfolioItem.targetValue)} €`;
        cell6.innerHTML = `${portfolioItem.changeValueText}`;

        if (portfolioItem.monthlySavings !== null && portfolioItem.monthlySavings !== undefined) {
            portfolioData.monthlySavings += portfolioItem.monthlySavings;
            cell7.innerText = `${formatFloatingNumber(portfolioItem.monthlySavings)} €`;
        }
        else {
            cell7.innerText = `${formatFloatingNumber(0)} €`;
        }

        if (portfolioItem.relevantForSavings !== null && portfolioItem.relevantForSavings !== undefined) {
            if (portfolioItem.relevantForSavings) {
                portfolioData.interestInitialAmount += portfolioItem.currentValue;
                cell8.innerHTML = '&#10003;';
                cell8.classList.add('color--positive');
            }
            else {
                cell8.innerHTML = '&#10005;';
                cell8.classList.add('color--negative');
            }
        }
        

        if (portfolioItem.descriptionItems !== null && portfolioItem.descriptionItems !== undefined) {
            cell9.innerHTML = '<ul>';

            portfolioItem.descriptionItems.forEach((descriptionItem) => {
                cell9.innerHTML += `<li>${descriptionItem}</li>`;
            });

            cell9.innerHTML += '<ul>';
        }

        cell1.classList.add('text-left');
        cell2.classList.add('text-right');
        cell3.classList.add('text-right');
        cell4.classList.add('text-right');
        cell5.classList.add('text-right');
        cell6.classList.add('text-right');
        cell7.classList.add('text-right');
        cell8.classList.add('text-center');
    }

    
    /**
     * Find a DepotOrAccount and return Title
     * @param {object} depotOrAccountId 
     * @returns 
     */
    const getDepotOrAccountTitleById = (depotOrAccountId) => {

        const depotOrAccount =  portfolioData.depotsOrAccounts.find(
            ({ id }) => id === depotOrAccountId
        );

        if (depotOrAccount === null) {
            return '-';
        }

        return depotOrAccount.title;
    }


    const initMonthlySavings = () => {
        calculateRemainingSavingTimeInYears();

        document.getElementById('interest-initialamount').innerText = `${formatFloatingNumber(portfolioData.interestInitialAmount)} €`;
        document.getElementById('interest-monthlysaving').innerText = `${formatFloatingNumber(portfolioData.monthlySavings)} €`;
        document.getElementById('interest-duration').innerText = `${portfolioData.monthlySavingDurationInYears} Jahre`;
        document.getElementById('interest-yearlyinterest').innerText = `${formatFloatingNumber(portfolioData.monthlySavingYearlyInterest)} %`;


        const tbodyElement = document.getElementById('interestoverview').querySelectorAll('tbody')[0];
        let totalCompoudInterest = 0;
        let finalValue = 0;

        for (let i = 1; i <= (portfolioData.monthlySavingDurationInYears + 1); i++) {
            let totalSavedAmount = portfolioData.interestInitialAmount + ((portfolioData.monthlySavings * 12) * (i - 1));
            const totalBaseValue = totalSavedAmount + totalCompoudInterest;

            const compoundInterest = calculateCompoundInterest(
                totalBaseValue,
                1,
                portfolioData.monthlySavingYearlyInterest,
                12
            );

            totalCompoudInterest += compoundInterest;

            finalValue = totalBaseValue;

            if (portfolioData.monthlySavingDurationInYears < i) {
                continue;
            }

            const row = tbodyElement.insertRow();

            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            const cell3 = row.insertCell();
            const cell4 = row.insertCell();
            const cell5 = row.insertCell();

            cell1.innerHTML = `(${i}) <strong>${new Date().getFullYear() + (i - 1)}</strong> (Alter: ${portfolioData.currentAge + i})`;
            cell2.innerText = `${formatFloatingNumber(portfolioData.monthlySavings * 12)} €`;
            cell3.innerText = `${formatFloatingNumber(totalSavedAmount)} €`;
            cell4.innerText = `${formatFloatingNumber(totalBaseValue)} €`;
            cell5.innerText = `${formatFloatingNumber(compoundInterest)} €`;

            cell1.classList.add('text-center');
            cell2.classList.add('text-right');
            cell3.classList.add('text-right');
            cell4.classList.add('text-right');
            cell5.classList.add('text-right');
        }

        document.getElementById('interest-finalvalue').innerText = `${formatFloatingNumber(finalValue)} €`;
        document.getElementById('interest-totalsaved').innerText = `${formatFloatingNumber(portfolioData.interestInitialAmount + (portfolioData.monthlySavings * 12) * portfolioData.monthlySavingDurationInYears)} €`;
        document.getElementById('interest-totalinterests').innerText = `${formatFloatingNumber(totalCompoudInterest)} €`;

    }


    const initExemptionOrders = () => {
        const tbodyElement = document.getElementById('exemptionordertable').querySelectorAll('tbody')[0];

        let totalAmount = 0;
        let alreadyUsed = 0;

        portfolioData.depotsOrAccounts.forEach((depotOrAccount) => {
            const exemptionOrder = depotOrAccount.exemptionOrder;

            if (exemptionOrder === null || exemptionOrder === undefined) {
                return;
            }

            totalAmount += exemptionOrder.amount;
            alreadyUsed += exemptionOrder.alreadyUsed;

            const row = tbodyElement.insertRow();

            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            const cell3 = row.insertCell();
            const cell4 = row.insertCell();

            const available = exemptionOrder.amount - exemptionOrder.alreadyUsed;

            cell1.innerText = depotOrAccount.title;
            cell2.innerText = `${formatFloatingNumber(exemptionOrder.amount)} €`;
            cell3.innerText = `${formatFloatingNumber(exemptionOrder.alreadyUsed)} €`;
            cell4.innerText = `${formatFloatingNumber(available)} €`;

            cell2.classList.add('text-right');
            cell3.classList.add('text-right');
            cell4.classList.add('text-right');

            if (available < 0) {
                cell4.classList.add('color--negative');
            }
            else if (available > 0 && available < 25) {
                cell4.classList.add('color--neutral');
            }
        });

        const totalAmountElement = document.getElementById('exemptionorder-totalamount');
        totalAmountElement.innerText = `${formatFloatingNumber(totalAmount)} €`;

        if (totalAmount > portfolioData.exemptionOrderMaxValue) {
            totalAmountElement.classList.add('color--negative');
        }

        const alreadyUsedElement = document.getElementById('exemptionorder-alreadyused');
        alreadyUsedElement.innerText = `${formatFloatingNumber(alreadyUsed)} €`;

        if (alreadyUsed > portfolioData.exemptionOrderMaxValue) {
            alreadyUsedElement.classList.add('color--negative');
        }
        
        const availableElement = document.getElementById('exemptionorder-available');
        availableElement.innerText = `${formatFloatingNumber(totalAmount - alreadyUsed)} €`;

        if ((totalAmount - alreadyUsed) < 0) {
            availableElement.classList.add('color--negative');
        }
    }


    const calculateRemainingSavingTimeInYears = () => {
        portfolioData.currentAge = new Date().getFullYear() - portfolioData.birthYear - 1
        portfolioData.monthlySavingDurationInYears = portfolioData.finalAge - portfolioData.currentAge;
    }


    /**
     *
     * @param {number} p Principal Amount
     * @param {number} t Time
     * @param {number} r Annual Interest Rate
     * @param {number} n Number of times compounded
     * @returns
     */
    const calculateCompoundInterest = (p, t, r, n) => {
        p = Number.parseFloat(p);
        t = Number.parseFloat(t);
        r = Number.parseFloat(r);
        n = Number.parseFloat(n);

        return (p * (Math.pow((1 + ((r / 100) / n)), (n * t)))) - p;
    }


    /**
     * Format a floating Number with decimals and return as localized string
     * @param {number} value
     * @returns
     */
    const formatFloatingNumber = (value) => {
        value = Number.parseFloat(value);

        return value.toLocaleString(
            'de-DE',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    }


    getPortfolioData();
    initPortfolioResults();
    initExemptionOrders();
    initMonthlySavings();
}