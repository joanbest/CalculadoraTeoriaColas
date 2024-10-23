document.addEventListener('DOMContentLoaded', () => {
    const situationSelect = document.getElementById('situationType');
    const serversGroup = document.getElementById('serversGroup');
    const populationGroup = document.getElementById('populationGroup');
    const sigma = document.getElementById('desviacion');
    const Grouplambda = document.getElementById('inputLambda');
    const GroupMu= document.getElementById('inputMu');

    situationSelect.addEventListener('change', () => {
        const situation = situationSelect.value;
        Grouplambda.style.display = ['1','2','3','4','5'].includes(situation)? 'block' : 'none';
        GroupMu.style.display = ['1','2','3','4','5'].includes(situation)? 'block' : 'none';
        serversGroup.style.display = ['2', '4'].includes(situation) ? 'block' : 'none';
        sigma.style.display = situation === '3' ? 'block' : 'none';
        populationGroup.style.display = situation === '5' ? 'block' : 'none';
    });
});

function calculateQueue() {
    const situation = document.getElementById('situationType').value;
    const lambda = parseFloat(document.getElementById('lambda').value);
    const mu = parseFloat(document.getElementById('mu').value);
    const resultContent = document.getElementById('resultContent');

    try {
        let results;
        switch (situation) {
            case '1':
                results = QueueCalculator.calcularMM1(lambda, mu);
                break;
            case '2':
                const servers = parseInt(document.getElementById('servers').value);
                results = QueueCalculator.calcularMMs(lambda, mu, servers);
                break;
            case '3':
                // Asumimos una varianza para el tiempo de servicio
                //const sigma = 1 / Math.pow(mu, 2); // Ejemplo simple
                const sigma = parseFloat(document.getElementById('sigma').value);
                results = QueueCalculator.calcularMG1(lambda, mu, sigma);
                break;
            case '4':
                const s = parseInt(document.getElementById('servers').value);
                const sigmaMulti = 1 / Math.pow(mu, 2);
                results = QueueCalculator.calcularMGs(lambda, mu, s, sigmaMulti);
                break;
            case '5':
                const K = parseInt(document.getElementById('population').value);
                results = QueueCalculator.calcularMM1K(lambda, mu, K);
                break;
        }

        displayResults(results, situation);
    } catch (error) {
        resultContent.innerHTML = `<p class="error">${error.message}</p>`;
    }
}



function displayResults(results, situation) {
    const resultContent = document.getElementById('resultContent');
    let html = '';

    const addResultItem = (label, value, icon) => {
        return `
            <div class="result-item">
                <div class="result-label">
                    <i class="fas ${icon}"></i>
                    ${label}
                </div>
                <div class="result-value">${value}</div>
            </div>
        `;
    };
    
    // Resultados comunes para todas las situaciones
    const commonResults = () => {
        let commonHtml = '';
        
        
        commonHtml += addResultItem(
            'Utilización del sistema (ρ)',
            results.rho.toFixed(4),
            'fa-percentage'
        );
    
        commonHtml += addResultItem(
            'Número promedio en el sistema (L)',
            results.L.toFixed(4),
            'fa-users'
        );
    
        commonHtml += addResultItem(
            'Tiempo promedio en el sistema (W)',
            results.W.toFixed(4),
            'fa-clock'
        );
    
        commonHtml += addResultItem(
            'Número promedio en cola (Lq)',
            results.Lq.toFixed(4),
            'fa-people-arrows'
        );
    
        return commonHtml;
    };
    
    // Resultados adicionales según la situación
    const specificResults = (situation) => {
        let specificHtml = '';
        if(situation !== '4'){
            specificHtml += addResultItem(
                'Probabilidad del sistema sin unidades(P0)',
                results.p0.toFixed(4),
                'fa-percentage'
            );
        }
        if (situation === '1') {
            specificHtml += addResultItem(
                'Probabilidad de encontrar n unidades en el sistema (Pn)',
                results.Pn.toFixed(4),
                'fa-hourglass-half'
            );
            
            specificHtml += addResultItem(
                'Tiempo promedio en cola (Wq)',
                results.Wq.toFixed(4),
                'fa-hourglass-half'
            );
    
        } else if (situation === '2' || situation === '3' || situation === '4') {
            specificHtml += addResultItem(
                'Tiempo promedio en cola (Wq)',
                results.Wq.toFixed(4),
                'fa-hourglass-half'
            );
    
        } else {
            specificHtml += addResultItem(
                'Tasa efectiva de llegadas (λ_eff)',
                results.lambdaEff.toFixed(4),
                'fa-stream'
            );
    
            specificHtml += addResultItem(
                'Probabilidad de sistema lleno (P_K)',
                results.PK.toFixed(4),
                'fa-chart-line'
            );
        }
    
        return specificHtml;
    };
    
    // Generar el HTML final
    html = commonResults() + specificResults(situation);
    resultContent.innerHTML = html;
}