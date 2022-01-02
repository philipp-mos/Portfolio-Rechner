{
    const currentDateTime = new Date();

    let portfolioData = {};


    const getPortfolioData = () => {
        const request = new XMLHttpRequest();
        request.open('GET', `data.json?v=${currentDateTime.toLocaleString()}`, false);
        request.send(null);

        portfolioData = JSON.parse(request.responseText);
    }


    const initPortfolioResults = () => {
        const portfolioResults = document.getElementById('portfolioresults');

        if (portfolioResults === null) {
            return;
        }

        buildPortfolioResults(portfolioResults);
    }


    const buildPortfolioResults = (portfolioResultsTable) => {
        const tbody = document.getElementsByTagName('tbody')[0];
        let portfolioTotalAssets = 0;
        let portfolioTotalPercentage = 0;

        portfolioData.forEach((portfolioItem) => {
            portfolioTotalAssets += Number.parseFloat(portfolioItem.currentValue);
            portfolioTotalPercentage += Number.parseFloat(portfolioItem.targetDivision);            
        });

        const totalAssetsInfo = document.getElementById('portfoliototalassets');
        totalAssetsInfo.innerText = `Total Assets: ${formatFloatingNumber(portfolioTotalAssets)} €`;

        const totalPercentageInfo = document.getElementById('portfoliototalpercentage');
        totalPercentageInfo.innerText = `Total Percentage: ${formatFloatingNumber(portfolioTotalPercentage)} %`;

        if (portfolioTotalAssets === 0) {
            return;
        }

        if (portfolioTotalPercentage > 100) {
            const percentageError = document.getElementById('portfoliopercentageerror');
            percentageError.innerText = `Gesamtprozentzahl reduzieren (${formatFloatingNumber(portfolioTotalPercentage)} %)`;
            percentageError.classList.add('color--negative');
        }


        portfolioData.forEach((portfolioItem) => {
            const currentPercentage = (portfolioItem.currentValue / portfolioTotalAssets) * 100;
            const targetDivision = Number.parseFloat(portfolioItem.targetDivision);

            const currentValue = Number.parseFloat(portfolioItem.currentValue);
            const targetValue = portfolioTotalAssets * (targetDivision / 100);

            const changeValue = targetValue - currentValue;

            let changeValueText = `<span class="font-bold color--positive">Kauf: ${formatFloatingNumber(changeValue)} €</span>`;

            if (changeValue < 0) {
                changeValueText = `<span class="font-bold color--negative">Verkauf: ${formatFloatingNumber(changeValue * -1)} €</span>`;
            }

            const row = tbody.insertRow();

            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            const cell3 = row.insertCell();
            const cell4 = row.insertCell();
            const cell5 = row.insertCell();
            const cell6 = row.insertCell();

            cell1.innerHTML = `<span class="font-bold">${portfolioItem.title}</span><br />(${portfolioItem.broker})`;
            cell2.innerText = `${formatFloatingNumber(currentPercentage)} %`;
            cell3.innerText = `${formatFloatingNumber(currentValue)} €`;
            cell4.innerText = `${formatFloatingNumber(targetDivision)} %`;
            cell5.innerText = `${formatFloatingNumber(targetValue)} €`;
            cell6.innerHTML = `${changeValueText}`;

            cell2.classList.add('text-right');
            cell3.classList.add('text-right');
            cell4.classList.add('text-right');
            cell5.classList.add('text-right');
            cell6.classList.add('text-right');
        });
    }
    
    
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