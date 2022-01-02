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

        portfolioData.sort((a, b) => (a.priority > b.priority ? 1 : -1));
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

        portfolioData.forEach((portfolioItem) => {
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

        portfolioData.forEach((portfolioItem) => {
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

        cell2.classList.add('text-left');
        cell2.classList.add('text-right');
        cell3.classList.add('text-right');
        cell4.classList.add('text-right');
        cell5.classList.add('text-right');
        cell6.classList.add('text-right');
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
}