let cmpCidade = document.getElementById("cidade");
let eltMensagem = document.getElementById("mensagem");
let eltCidades = document.getElementById("cidades");
let eltPrevisao = document.getElementById("previsao");

cmpCidade.addEventListener("keydown", function(chave) {
    if(chave.key == "Enter") {
        buscarCidades();
    }
});

async function buscarCidades() {
    let nmCidade = cmpCidade.value;
    eltMensagem.textContent = "Buscando cidades...";
    let valor = await fetch(`https://brasilapi.com.br/api/cptec/v1/cidade/${nmCidade}`);
    let dados = await valor.json();
    if(valor.ok) {
        eltCidades.innerHTML = "";
        for(let i = 0; i < dados.length; i++) {
            let eltCidade = document.createElement("p");
            eltCidade.textContent = `${dados[i].nome} - ${dados[i].estado}`;
            eltCidade.addEventListener("click", function() {
                buscarPrevisao(dados[i].id);
            });
            eltCidade.classList.add("cidade");
            eltCidades.appendChild(eltCidade);
        }
        eltMensagem.textContent = "";
    }else {
        eltMensagem.textContent = dados.message;
    }
}

async function buscarPrevisao(previsoes) {
    eltPrevisao.textContent = "Buscando previsão do tempo...";
    let valor = await fetch(`https://brasilapi.com.br/api/cptec/v1/clima/previsao/${previsoes}`);
    let dados = await valor.json();
    if(valor.ok) {
        eltPrevisao.innerHTML = `
            <h2>${dados.cidade} - ${dados.estado}</h2>
            <div class="dia">
                <p>Data: ${fmtData(dados.clima[0].data)}</p>
                <p>Condição: ${dados.clima[0].condicao_desc}</p>
                <p>Temperatura mínima: ${dados.clima[0].min}°C</p>
                <p>Temperatura máxima: ${dados.clima[0].max}°C</p>
                <p>Indice UV: ${dados.clima[0].indice_uv}</p>
            </div>
        `;
    }else {
        eltPrevisao.textContent = dados.message;
    }
}

function fmtData(data) {

    let nros = data.split("-");
    return `${nros[2]}/${nros[1]}/${nros[0]}`;

}
