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

        portfolioData.portfolioItems.sort((a, b) => (a.priority > b.priority ? 1 : -1));
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

        portfolioData.portfolioItems.forEach((portfolioItem) => {
            portfolioItem.currentPercentage = (portfolioItem.currentValue / portfolioTotalAssets) * 100;
            portfolioItem.targetValue = portfolioTotalAssets * (portfolioItem.targetPercentage / 100);
            portfolioItem.changeValue = portfolioItem.targetValue - portfolioItem.currentValue;

            portfolioItem.changeValueText = `<span class="font-bold color--positive">Kauf: ${formatFloatingNumber(portfolioItem.changeValue)} €</span>`;

            if (portfolioItem.changeValue < 0) {
                portfolioItem.changeValueText = `<span class="font-bold color--negative">Verkauf: ${formatFloatingNumber(portfolioItem.changeValue * -1)} €</span>`;
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

        cell1.innerHTML = `<span class="font-bold">${portfolioItem.title}</span><br />(${portfolioItem.broker})`;
        cell2.innerText = `${formatFloatingNumber(portfolioItem.currentPercentage)} %`;
        cell3.innerText = `${formatFloatingNumber(portfolioItem.currentValue)} €`;
        cell4.innerText = `${formatFloatingNumber(portfolioItem.targetPercentage)} %`;
        cell5.innerText = `${formatFloatingNumber(portfolioItem.targetValue)} €`;
        cell6.innerHTML = `${portfolioItem.changeValueText}`;

        cell1.classList.add('text-left');
        cell2.classList.add('text-right');
        cell3.classList.add('text-right');
        cell4.classList.add('text-right');
        cell5.classList.add('text-right');
        cell6.classList.add('text-right');
    }


    const initMonthlySavings = () => {
        portfolioData.interestInitialAmount = 0;

        portfolioData.portfolioItems.forEach((portfolioItem) => {
            if (portfolioItem.relevantForSavings) {
                portfolioData.interestInitialAmount += portfolioItem.currentValue;
            }
        });

        document.getElementById('interest-initialamount').innerText = `${formatFloatingNumber(portfolioData.interestInitialAmount)} €`;
        document.getElementById('interest-monthlysaving').innerText = `${formatFloatingNumber(portfolioData.monthlySavingAmount)} €`;
        document.getElementById('interest-duration').innerText = `${portfolioData.monthlySavingDurationInYears} Jahre`;
        document.getElementById('interest-yearlyinterest').innerText = `${formatFloatingNumber(portfolioData.monthlySavingYearlyInterest)} %`;


        const tbodyElement = document.getElementById('interestoverview').querySelectorAll('tbody')[0];

        for (let i = 1; i <= portfolioData.monthlySavingDurationInYears; i++) {
            const row = tbodyElement.insertRow();

            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            const cell3 = row.insertCell();
            const cell4 = row.insertCell();
            const cell5 = row.insertCell();

            let totalSavedAmount = (portfolioData.monthlySavingAmount * 12) * i;

            const compoundInterest = calculateCompoundInterest(
                portfolioData.interestInitialAmount,
                i,
                portfolioData.monthlySavingYearlyInterest,
                12
            );

            cell1.innerText = `(${i}) ${new Date().getFullYear() + (i - 1)} (Alter: ${portfolioData.currentAge + i})`;
            cell2.innerText = `${formatFloatingNumber(portfolioData.monthlySavingAmount * 12)} €`;
            cell3.innerText = `${formatFloatingNumber(totalSavedAmount + portfolioData.interestInitialAmount)} €`;
            cell4.innerText = `${formatFloatingNumber(totalSavedAmount + compoundInterest + portfolioData.interestInitialAmount)} €`;
            cell5.innerText = `${formatFloatingNumber(compoundInterest)} €`;

            cell1.classList.add('text-center');
            cell2.classList.add('text-right');
            cell3.classList.add('text-right');
            cell4.classList.add('text-right');
            cell5.classList.add('text-right');
        }
    }

    const initExemptionOrders = () => {
        const tbodyElement = document.getElementById('exemptionordertable').querySelectorAll('tbody')[0];

        let totalAmount = 0;
        let alreadyUsed = 0;

        portfolioData.exemptionOrders.forEach((exemptionOrder) => {
            totalAmount += exemptionOrder.amount;
            alreadyUsed += exemptionOrder.alreadyUsed;

            const row = tbodyElement.insertRow();

            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            const cell3 = row.insertCell();
            const cell4 = row.insertCell();

            const available = exemptionOrder.amount - exemptionOrder.alreadyUsed;

            cell1.innerText = exemptionOrder.title;
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

        document.getElementById('exemptionorder-alreadyused').innerText = `${formatFloatingNumber(alreadyUsed)} €`;
        document.getElementById('exemptionorder-available').innerText = `${formatFloatingNumber(totalAmount - alreadyUsed)} €`;
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

        return (p * (Math.pow((1 + ((r / 100) / n)), (n * t))) - p);
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