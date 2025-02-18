const GV_botaomostrarnotificacao = document.querySelector("button.GV_vernotificacao");
const GV_botaofecharnot = document.querySelector('.GV_caixadacaixadanotificacao > button');
const url1 = "http://localhost:3000/evento";
const url2 = "http://localhost:3000/listadeusuarios";
const GV_novousuarioteste = {
    username: "Gustavo",
    senha: "123456",
    email: "gggggggg@gmail.com",
    ID: 1719666789117,
    precoMedio: "564",
    gostos: ["1", "5", "7"],
    moeda: "R$",
    favoritos: [1718186424176],
    visualizou: [],
    foto_perfil: "https://fernandapessoa.com.br/wp-content/uploads/2021/11/jovem-na-escada-curso-fernanda-pessoa-um-novo-tempo-1536x1024.jpg"
};


function salvardadosevento(dados){
    localStorage.setItem('bd_ShowTimeSeeker', JSON.stringify(dados));
}

function GV_idindexevento(GV_id, GV_dadosdoeventobuscarid)
{
    //let GV_dadosdoeventobuscarid = lerdadosevento().evento;------------------------------------------------------------
    let GV_indexpararetornar = -1;
    let GV_contador = 1;
    do
    {
        if(GV_dadosdoeventobuscarid[GV_contador].id == GV_id)
        {
            GV_indexpararetornar = GV_contador;
        }
        GV_contador = GV_contador + 1;
    }
    while(GV_contador < GV_dadosdoeventobuscarid.length && GV_indexpararetornar == -1);
    return(GV_indexpararetornar);
}

function GV_conversaoparareal(GV_valoremoutramoeda, GV_tipodamoeda){
    let valoremreal = 0;
    let cotacaodolar = 5.11;
    let cotacaoeuro = 5.55;

    if(GV_tipodamoeda == '$'){
        valoremreal = GV_valoremoutramoeda * cotacaodolar;
    }else if(GV_tipodamoeda == '€'){
        valoremreal = GV_valoremoutramoeda * cotacaoeuro;
    }else{
        valoremreal = GV_valoremoutramoeda;
    }
    return(valoremreal);
}

function GV_verificargostos(GV_arraygostosevento = [], GV_arraygostosfiltro = []){
    let GV_arrayresposta = [];
    let GV_resultadogostos = false;
    GV_arrayresposta = GV_arraygostosfiltro.filter(GV_testegosto => !GV_arraygostosevento.includes(GV_testegosto));
    //console.log(GV_arrayresposta);
    if(GV_arrayresposta.length == 0){GV_resultadogostos = true;}
    return(GV_resultadogostos);
}

function GV_converterdata(data){
    let convertida = data.split("T");
    convertida[0] = convertida[0].split("-");
    convertida[0] = convertida[0].reverse();
    convertida[0] = convertida[0].join("/")
    return convertida
}

function GV_mostrareventos(GV_arrayeventos, GV_arrayfiltros, GV_gastosmediofiltro) {
    const GV_cardgrande = document.getElementById('card-container');
    const GV_cardsmenores = document.getElementById('GV_cardsmenorescontainer');
    const GV_dadosdabarradepesquisa = document.getElementById('GV_barradepesquisa').value;
    const GV_datafiltro = document.getElementById('GV_data');
    let GV_stringcards = '';
    let GV_stringcardgrande = '';
    let GV_primeiroevento = 0;
    let GV_iddoprimeiro = 0;
    let GV_strlink = ''

    
    for(let GV_imevento = 1; GV_imevento < GV_arrayeventos.length; GV_imevento = GV_imevento + 1)
        {
            let GV_objevento = GV_arrayeventos[GV_imevento];
            if(isUserLoggedIn()){
                GV_strlink = `eventopage.html?id=${GV_objevento.id}`;
            }else{
                GV_strlink = 'cadastrar.html';
            }
            //if(GV_gastosmediofiltro == "NaN"){console.log('cv')}
            if((GV_gastosmediofiltro == undefined || GV_gastosmediofiltro == "NaN" || GV_conversaoparareal(GV_objevento.preco.valor, GV_objevento.preco.moeda) <= GV_gastosmediofiltro) && GV_verificargostos(GV_objevento.estilodoevento, GV_arrayfiltros) && (GV_dadosdabarradepesquisa == "" || GV_objevento.nome_do_evento.toLowerCase().includes(GV_dadosdabarradepesquisa)) && (GV_datafiltro.value == "" || GV_datafiltro.value == GV_objevento.data)){
                let GV_dataehoraeventotelaprincipal = GV_converterdata(GV_objevento.data)
                if(!GV_primeiroevento){
                    GV_stringcardgrande = `
                    <a href="${GV_strlink}" class="nenhumadecoracao">
                    <img src="${GV_objevento.fotos[0]}" id="card-imagem" class="card-img" alt="foto">
                    <div class="card-img-overlay">
                    <h5 class="card-title GV_titulocardgrande">${GV_objevento.nome_do_evento}</h5>
                    <p class="card-text GV_card-text">${GV_objevento.descricao.replaceAll('\n', '<br>')}</p>
                    <p class="card-text"><small>Data: ${GV_dataehoraeventotelaprincipal[0]} Hora: ${GV_dataehoraeventotelaprincipal[1]} </small></p>
                    </div>
                    </a>`;
                    GV_primeiroevento = 1;
                    GV_iddoprimeiro = GV_objevento.id;
                } 
                else
                {
                    GV_stringcards = GV_stringcards + `
                    <div class="col" id="card-menor">
                        <a href="${GV_strlink}" class="col GV_card_menor nenhumadecoracao">
                        <div class="card h-100 GV_corpocard text-bg-dark">
                            <img src="${GV_objevento.fotos[0]}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${GV_objevento.nome_do_evento}</h5>
                                <p class="card-text">${GV_objevento.descricao.replaceAll('\n', '<br>')}</p>
                                <p class="card-text"><small>Data: ${GV_dataehoraeventotelaprincipal[0]} Hora: ${GV_dataehoraeventotelaprincipal[1]} </small></p>
                            </div>
                        </div>
                        </a>
                    </div>`;
                    
                }
            }
        }
        GV_cardsmenores.innerHTML = GV_stringcards;
        GV_cardgrande.innerHTML = GV_stringcardgrande;
        GV_cardgrande.setAttribute("data-index", GV_iddoprimeiro);
}

function isUserLoggedIn() {
    // Exemplo: verificar um cookie, localStorage ou sessão
    // Aqui, usamos localStorage como exemplo
    return sessionStorage.getItem('logado') === 'true';
}

GV_botaofecharnot.addEventListener('click', ()=>{
    const GV_caixadacaixanot = document.getElementById
    ('GV_caixadacaixadanotificacao');
    GV_botaomostrarnotificacao.classList.remove('hidden');
    GV_caixadacaixanot.classList.add('hidden');
})

GV_botaomostrarnotificacao.addEventListener('click', ()=>{
    GV_botaomostrarnotificacao.classList.add('hidden');
    const GV_caixadacaixanot = document.getElementById('GV_caixadacaixadanotificacao');
    GV_caixadacaixanot.classList.remove('hidden');
})




/*Para utilizar dois JSONs diferentes com a função fetch em JavaScript, você pode realizar duas requisições separadas e trabalhar com as respostas uma vez que ambas tenham sido concluídas. Uma abordagem comum para isso é usar Promise.all, que permite aguardar até que todas as promessas sejam resolvidas antes de continuar o processamento.

Aqui está um exemplo básico de como você pode fazer isso:

javascript
Copiar código
// URLs dos dois JSONs
const url1 = 'https://api.exemplo.com/dados1.json';
const url2 = 'https://api.exemplo.com/dados2.json';

// Função para buscar dados dos URLs
function fetchData(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
}

// Usar Promise.all para buscar ambos os JSONs
Promise.all([fetchData(url1), fetchData(url2)])
  .then(([dados1, dados2]) => {
    // Trabalhar com os dados aqui
    console.log('Dados do primeiro JSON:', dados1);
    console.log('Dados do segundo JSON:', dados2);
    
    // Exemplo: combinando os dados
    const combinados = { ...dados1, ...dados2 };
    console.log('Dados combinados:', combinados);
  })
  .catch(error => {
    console.error('Houve um problema com a requisição:', error);
  });
Neste exemplo:

Definimos as URLs dos dois JSONs que queremos buscar.
Criamos uma função fetchData que recebe uma URL, faz a requisição com fetch, verifica se a resposta foi bem-sucedida e retorna os dados em formato JSON.
Utilizamos Promise.all para fazer ambas as requisições simultaneamente. Promise.all recebe um array de promessas e retorna uma nova promessa que é resolvida quando todas as promessas no array são resolvidas.
No bloco .then, recebemos um array com os dados dos dois JSONs, que podemos manipular conforme necessário.
No bloco .catch, lidamos com qualquer erro que possa ocorrer durante as requisições.
Essa abordagem garante que você possa trabalhar com ambos os conjuntos de dados assim que ambos estiverem disponíveis.*/

async function fetchurls(url){
    return await fetch(url).then(response =>{
        return response.json();
    }).catch(err =>{

        throw new Error('Network response was not ok');
        return response.json();
    })
}

async function fetchpost(url, dadosusuario){
    await fetch(url, {
        method: 'POST',
        headers: {'Content-type':'application/json',},
        body: JSON.stringify(dadosusuario),
    }).then(response=>response.json()).then(data=>{console.log(`Sucesso: ${data}`)}).catch(err=>{alert('Erro no novo perfil')})
}





function lerdadosusuario(){
    let strdados = localStorage.getItem('bd_ShowTimeSeeker');
    let objdados = {}
    if(strdados){
//Caso existam ler e retornar os dados anteriores
        objdados = JSON.parse(strdados);
    } else
    {
//Dados iniciais caso nao existam dados anteriores
        objdados = {
            usuario:{},
        }
    }
    return(objdados);
}



async function GV_codigo(){

    

//Ler dados do banco de dados e salvar no localstorage
    //salvardadosevento(lerdadosevento());

    const GV_botaodofiltro = document.getElementById("GV_botaodofiltro");
    const GV_gastomedio = document.getElementById('GV_preco');
    const GV_menufiltro = document.getElementById('GV_Menufiltro');
    const GV_filtroformulario = document.getElementById('GV_filtroformulario');
    const GV_barradepesquisa = document.getElementById('GV_barradepesquisa');
    const GV_caixabarrapesq = document.querySelector('div.GV_caixabarradepesquisa')
    const GV_caixaentrarcriar = document.querySelector('div.entrarcriar');
    const GV_linkparaoperfil = document.querySelector('a.GV_linkperfil')
    const GV_caixabarraefiltro = document.querySelector('div.GV_barrafiltro');

    var GV_preco;
    var GV_keysfiltro;
    var GV_moedafiltro;


    try{
        const GV_bd_STS = {
            evento: await fetchurls(url1)
        }
        console.log(GV_bd_STS)

        if (isUserLoggedIn()) {
            // Se o usuario estiver logado
            // Alterar o tamanho da barra de pesquisa
        
                GV_caixabarraefiltro.style.width = '100%';
                GV_caixabarraefiltro.style.marginRight = '10px';
        
            // Esconder os botões de "Entrar" e "Criar"
        
                document.querySelectorAll('#botao').forEach(function(button) {
                    button.style.display = 'none';
                });
                GV_caixaentrarcriar.style.display = 'none';
        
            // Alterar o href do link de perfil
        
                GV_linkparaoperfil.setAttribute('href', './Perfil.html')
        
            // Mostrar as notificacoes
                
                GV_notificacaoevento(GV_bd_STS);
            }else{
            // Se nao
            //Manter o botao mostrar notificacao escondido
        
                GV_botaomostrarnotificacao.classList.add('hidden');
        
            }
            
            
        
            GV_gastomedio.addEventListener('change', function(){
            //Manter o filtro de gasto medio com duas casas decimais
        
                GV_gastomedio.value = parseFloat(GV_gastomedio.value).toFixed(2);
        
            });
        
        
            GV_botaodofiltro.addEventListener('click', () =>{
                //Ao clicar no botao de filtro
                if(GV_menufiltro.style.display == 'flex'){
                //Se o filtro ja estiver exibido
                //Esconder
        
                    GV_menufiltro.style.display = 'none';
        
                }else {
                //Se nao
                //Mostrar
        
                    GV_menufiltro.style.display = 'flex';
        
                }
            });
        
            GV_filtroformulario.addEventListener('submit', GV_fazerfiltragem =>{
                //Ao fazer a filtragem:
                GV_fazerfiltragem.preventDefault();
                const GV_filformdata = new FormData(GV_filtroformulario);
                var GV_dadosdosformulariosfil = Object.fromEntries(GV_filformdata);
                var GV_valoresdedadosfil = Object.values(GV_dadosdosformulariosfil);
                GV_keysfiltro = Object.keys(GV_dadosdosformulariosfil);
                GV_moedafiltro = GV_valoresdedadosfil.pop();
                GV_preco = GV_valoresdedadosfil.pop();
                GV_keysfiltro.pop();
                GV_keysfiltro.pop();
                GV_keysfiltro.pop();
                GV_preco = GV_conversaoparareal(parseFloat(GV_preco), GV_moedafiltro).toFixed(2);
                GV_mostrareventos(GV_bd_STS.evento, GV_keysfiltro, GV_preco);
            })
            
            GV_barradepesquisa.addEventListener('input', () =>{GV_mostrareventos(GV_bd_STS.evento, GV_keysfiltro, GV_preco)})
        
            GV_mostrareventos(GV_bd_STS.evento, GV_keysfiltro, GV_preco);

    }catch(err){
        alert(`Houve problemas de requisição: ${err}`)
    };


}


function GV_notificacaoevento(GV_objeventonot){

    const GV_caixadanotificacao = document.getElementById("GV_caixanotificacao");
    const GV_caixadacaixanot = document.getElementById('GV_caixadacaixadanotificacao');
    let favoritedEvents = lerdadosusuario().usuario.favoritos;
    let GV_notstr = '';
    let GV_dataehoraatualnotific = new Date();
    let GV_umdia = 24 * 60 * 60 * 1000;
    let GV_doisdias = 48 * 60 * 60 * 1000;

    

    // Mostrar notificacao
    function showNotification(message) {
        GV_caixadanotificacao.innerHTML = message;
        GV_caixadacaixanot.classList.remove('hidden');
        setTimeout(() => {
            GV_caixadacaixanot.classList.add('hidden');
        }, 5000); // Hide notification after 5 seconds
    }
    // Para cada evento favoritado
    favoritedEvents.forEach(event => {
        let GV_event = GV_idindexevento(event, GV_objeventonot.evento) 
        let GV_dataeventnotific = new Date(GV_objeventonot.evento[GV_event].data);
    // Verificar se o id do evento é maior que 0 e igual ao id do evento favoritado
        if(GV_event > 0 && GV_objeventonot.evento[GV_event].id == event)
        {
        // Se faltarem 24 horas para o evento
            if (GV_dataehoraatualnotific <= GV_dataeventnotific && GV_dataehoraatualnotific >= new Date(GV_dataeventnotific.getTime() - GV_umdia)) {
                GV_notstr = GV_notstr + `<div id="notification" class="">Lembrete: ${GV_objeventonot.evento[GV_event].nome_do_evento} ocorrerá hoje!</div>`
                
                showNotification(GV_notstr);
            } else if (GV_dataehoraatualnotific <= GV_dataeventnotific && GV_dataehoraatualnotific >= new Date(GV_dataeventnotific.getTime() - GV_doisdias)) {
            //Se faltarem 48 horas para o evento
                GV_notstr = GV_notstr + `<div id="notification" class="">Lembrete: ${GV_objeventonot.evento[GV_event].nome_do_evento} ocorrerá em 48 horas!</div>`
                showNotification(GV_notstr);
            }
        } 
            
    });
};





