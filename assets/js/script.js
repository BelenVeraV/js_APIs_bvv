async function getCoin (){

    const res = await fetch ('https://mindicador.cl/api/');
    const data = await res.json();
    
    return data;
}

let id_btn = document.getElementById('id_btn');
id_btn.addEventListener('click', async function(){

    try{
        let id_coins = document.getElementById('id_coin');
        let classCoins = id_coins.value;
        
        let coins = await getCoin();
        let valueCoins = coins[classCoins].valor;

        let valuePesosclp = document.getElementById('id_pesosclp').value;
        let valueCambio = parseFloat(valuePesosclp / valueCoins).toFixed(2);

        let id_result = document.getElementById('id_result');
        id_result.innerHTML = 'Resultado: '+ valueCambio;

        getGraficar(classCoins);

    } catch(e){
        let id_error = document.getElementById('id_error');
        id_error.innerHTML = `<div class=alert alert-danger" role="alert">Error en la carga de monedas</div>`;
    }
});

async function grafico(tipo){

    const res = await fetch ("https://mindicador.cl/api/"+tipo);
    const listPrice =await res.json();

    let keyValue = Object.keys(listPrice['serie']);
    let contarkey = keyValue.length;

    let data = [];
    let labels = [];

    for (let k=0; k<=contarkey; k++){

        let dateCoin = listPrice['serie'][k].fecha;
        let dateNewA = dateCoin.split('T');
        data.push(listPrice['serie'][k].valor);
        labels.push(dateNewA[0]);

        if (k>=9)
        break;
    }

    const datasets = [
        {
            label: "Historial últimos 10 días - "+tipo,
            borderColor: "rgb(255, 99, 132)",
            data
        }
    ];

    return {labels, datasets};
}

let graficar;

async function getGraficar(tipo){

    try{
        const data = await grafico(tipo);
        const config = {
            type: "line",
            data: {
                labels: data.labels,
                datasets: data.datasets
                }
        };

        let myChart = document.getElementById("myChart");

        if (graficar)
            graficar.destroy();

            myChart.style.backgroundColor = "white";
            graficar= new Chart(myChart, config);
    }   catch(e){
        let id_error = document.getElementById('id_error');
        id_error.innerHTML = `<div class="alert alert-danger" role="alert">Error en el gráfico</div>`;
    }
}










