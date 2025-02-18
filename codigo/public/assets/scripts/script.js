const GV_botaomostrarformcriarevento = document.getElementById('GV_botaomostrarformcriarevento');
const GV_cancelar = document.getElementById('GV_cancelar');
const botaocriarevento = document.getElementById('botaocriarevento');
const GV_areadoseventosfavoritos = document.querySelector('div.GV_abameusfavoritos');
const GV_areadoseventosparaedicao = document.getElementById('GV_visualizarmodificareventos');
var GV_verificacaodemodificacao = 0;
var GV_objetoeventoindex;
const avisoavancar = document.querySelector('div#aviso');
const url1 = "http://localhost:3000/evento";
const url2 = "http://localhost:3000/listadeusuarios";
var ED_gostospaginacadastro = [];
var GV_bd_STS = {};

async function fetchurlsget(url){
    return fetch(url).then(response =>{
        return response.json();
    }).catch(err =>{

        throw new Error('Network response was not ok');
        return response.json();
    })
}

function fetchpost(url, dadosinseridos, redirecionamento = "0", callback = "0"){
    fetch(url, {
        method: 'POST',
        headers: {'Content-type':'application/json',},
        body: JSON.stringify(dadosinseridos),
    }).then(response=>response.json()).then(data=>{
        console.log(`Sucesso: ${data}`);
        if(callback != "0"){callback()};
        if(redirecionamento != "0"){location.href = redirecionamento};
    }).catch(err=>{alert('Erro no novo dado')})
}

function fetchput(url, dadosinseridos, redirecionamento = "0", callback = "0"){
    fetch(url, {
        method: 'PUT',
        headers: {'Content-type':'application/json',},
        body: JSON.stringify(dadosinseridos),
    }).then(response=>response.json()).then(data=>{
        console.log(`Sucesso: ${data}`);
        if(callback != "0"){callback()};
        if(redirecionamento != "0"){location.href = redirecionamento};
    }).catch(err=>{alert(`Erro na alteracao do dado: ${err}`)})
}

function fetchdelete(url, redirecionamento = "0", callback = "0"){
    fetch(url, {
        method: 'DELETE',
        headers: {'Content-type':'application/json',},
    }).then(response=>response.json()).then(data=>{
        console.log(`Sucesso: ${data}`);
        if(callback != "0"){callback()};
        if(redirecionamento != "0"){location.href = redirecionamento};
    }).catch(err=>{alert(`Erro na alteracao do dado: ${err}`)})
}
/*
Promise.all([fetchurlsget(url1), fetchurlsget(url2)]).then(([evento, listadeusuarios])=>{
    const GV_bd_STS = {
        evento,
        listadeusuarios,
    }
    console.log(GV_bd_STS)
}).catch(err =>{
    alert("Houve problemas de requisição")
});*/

async function GV_updatedata(){
    try{
        GV_bd_STS = {
            evento: await fetchurlsget(url1),
        }
        GV_mostrareventosfavoritos(GV_bd_STS.evento);
        GV_mostrareventosparaedicao(GV_bd_STS.evento);
    }catch(err){
        alert("Houve problemas de requisição")
    };
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
            

/*Salvar dados dos eventos atualizado*/


function salvardadosusuario(dados){
    localStorage.setItem('bd_ShowTimeSeeker', JSON.stringify(dados));
}



/*Funçao para converter o id para index do evento*/


function GV_idindexevento(GV_id)
{
    let GV_dadosdoeventobuscarid = lerdadosevento().evento;
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


/*Funçao para converter o id para index do usuario na lista de usuarios*/


function GV_idindexusuario(GV_id)
{
    let GV_dadosdousuariobuscarid = lerdadosevento().listadeusuarios;
    let GV_indexpararetornar = -1;
    let GV_contador = 0;
    do
    {
        if(GV_dadosdousuariobuscarid[GV_contador].id == GV_id)
        {
            GV_indexpararetornar = GV_contador;
        }
        GV_contador = GV_contador + 1;
    }
    while(GV_contador < GV_dadosdousuariobuscarid.length && GV_indexpararetornar == -1);
    return(GV_indexpararetornar);
}


/*Salvar dados do usuario cadastrado*/


function GV_salvardadosdousuarioatual(GV_usuarioatual){
    let GV_objdadosusuario = lerdadosusuario();
    GV_objdadosusuario.usuario = GV_usuarioatual;
    fetchpost(url2, GV_usuarioatual, "index.html");
    salvardadosusuario(GV_objdadosusuario);
}


/*Salvar modificações no perfil do usuario atual*/


function GV_modificardadosdousuarioatual(GV_usuarioatual){
    //let GV_contadorusuario = -1;
    let GV_objdadosusuario = lerdadosusuario();
    fetchput(url2+`/${GV_objdadosusuario.usuario.id}`, GV_usuarioatual, "index.html", ()=>{GV_updatedata()})
    salvardadosusuario(GV_usuarioatual);
    
    /*GV_contadorusuario = GV_idindexusuario(GV_usuarioatual.id);
    
    if(GV_contadorusuario > -1)
    {
        GV_objdadosusuario.usuario = GV_usuarioatual;
        GV_objdadosusuario.listadeusuarios[GV_contadorusuario] = GV_usuarioatual;
        
    }*/
}


/*Modificar o evento segundo dados passados*/


function GV_modificardeterminadoevento(dadosdonovoevento, GV_idxdoevento){
    let objdados = lerdadosevento();
    let GV_existe = true;
    let GV_i = 0;
    // Verificar se algum evento possui o local, nome e data iguais ao evento
    do
    {
        if(objdados.evento && objdados.evento != [] && GV_i != GV_idxdoevento)
        {
            if(objdados.evento[GV_i].local == dadosdonovoevento.local && objdados.evento[GV_i].nome_do_evento == dadosdonovoevento.nome_do_evento && objdados.evento[GV_i].data == dadosdonovoevento.data)
            {
                GV_existe = false
            }
        }
        GV_i = GV_i + 1;
    }
    while(GV_i < objdados.evento.length && GV_existe == true);
    // Se nao tiver encontrado nenhum evento igual
    if(GV_existe)
    {
        objdados.evento[GV_idxdoevento] = dadosdonovoevento;
        salvardadosusuario(objdados);
        avisoavancar.innerHTML = '';
    } else {
    // Se nao
        avisoavancar.innerHTML = '<span>*Esse evento já existe</span>';
    }
}


/*Ler dados dos eventos no banco de dados*/


function lerdadosevento()
{
    let strdados = localStorage.getItem('bd_ShowTimeSeeker');
    let objdados = {}
    if(strdados){
//Caso existam ler e retornar os dados anteriores
        objdados = JSON.parse(strdados);
    } else
    {
//Dados iniciais caso nao existam dados anteriores
        objdados = {
            evento:[
                {
                    nome_do_evento: "",
                    local: "",
                    preco: {
                        valor: 0,
                        moeda: "R$"
                    },
                    data: "",
                    descricao: "",
                    fotos: [],
                    id: 0,
                    linkcontato: "",
                    estilodoevento: [],
                    visualizacoes: {
                        total: 0,
                        gosto1: 0,
                        gosto2: 0,
                        gosto3: 0,
                        gosto4: 0,
                        gosto5: 0,
                        gosto6: 0,
                        gosto7: 0,
                        gosto8: 0,
                        gosto9: 0,
                        gosto10: 0,
                        gosto11: 0,
                        gosto12: 0,
                    },
                    favoritos: 0,
                    comentarios: [],
                    donodoevento: "",
                },
                {
                    nome_do_evento: "Pool party",
                    local: "Avenida Jubeline",
                    preco: {
                        valor: 50,
                        moeda: "R$"
                    },
                    data: "2024-07-01T12:00",
                    descricao: "Em Maio temos mais um encontro marcado no Rancho Bill para comemorarmos o Bday do Felipe Arruda.\nUm super line, numa junção de muita vibe que o Rancho já tem, com a vibe que BH inteira já conhece das nossas festas. \nVai ser mais um DOMINGO de muita vibe, alegria e uma comemoração inesquecível.",
                    fotos: ["https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F451776649%2F1408553967403%2F1%2Foriginal.20230222-065803?w=600&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C238%2C1080%2C540&s=d44826119d6bec5f86d3faf2729717d7", "https://hips.hearstapps.com/hmg-prod/images/701/pool-party1-1499900484.jpg"],
                    id: 1718186424176,
                    linkcontato: "https://www.instagram.com/",
                    estilodoevento: ["2", "3"],
                    visualizacoes: {
                        total: 3,
                        gosto1: 1,
                        gosto2: 2,
                        gosto3: 3,
                        gosto4: 0,
                        gosto5: 0,
                        gosto6: 0,
                        gosto7: 0,
                        gosto8: 0,
                        gosto9: 0,
                        gosto10: 0,
                        gosto11: 0,
                        gosto12: 0,
                    },
                    favoritos: 0,
                    comentarios: [],
                    donodoevento: 1719666789117,
                },
                {
                    nome_do_evento: "Festa Junina",
                    local: "Avenida Dom Pedro II",
                    preco: {
                        valor: 0,
                        moeda: "R$"
                    },
                    data: "2024-08-19T14:00",
                    descricao: "Venha se juntar a nós para celebrar a tradição e a alegria da Festa Junina do Rotary Club de Belo Horizonte - Barro Preto! No dia 8 de junho de 2024, a partir das 14h, o Colégio São Paulo, localizado na Rua Olímpio de Assis 190, Cidade Jardim, Belo Horizonte/MG, será o palco para essa festa cheia de diversão e cultura.",
                    fotos: ["https://fashionistando.uai.com.br/wp-content/uploads/sites/11/2018/06/festa-junina-camarim.jpg", "https://soubh.uai.com.br/uploads/post/image/14267/festas_juninas_em_bh_ingressos_onde_ir.jpg"],
                    id: 1718186421301,
                    linkcontato: "https://www.instagram.com/",
                    estilodoevento: ["1", "3"],
                    visualizacoes: {
                        total: 0,
                        gosto1: 0,
                        gosto2: 0,
                        gosto3: 0,
                        gosto4: 0,
                        gosto5: 0,
                        gosto6: 0,
                        gosto7: 0,
                        gosto8: 0,
                        gosto9: 0,
                        gosto10: 0,
                        gosto11: 0,
                        gosto12: 0,
                    },
                    favoritos: 0,
                    comentarios: [],
                    donodoevento: 1719666789117,
                },
                {
                    nome_do_evento: "KPOP BRASIL FEST",
                    local: "Bairro Niteroi, Rio de Janeiro",
                    preco: {
                        valor: 800,
                        moeda: "R$"
                    },
                    data: "2024-08-08T20:00",
                    descricao: "Apresento a vocês nosso projeto K-pop Brasil Fest que vem com tudo no bairro de Niterói, em um novo local com um auditório belíssimo para confortar vocês que amam K-pop e cultura Coreana",
                    fotos: ["https://f.i.uol.com.br/fotografia/2019/11/05/15729835355dc1d2efabe3b_1572983535_3x2_md.jpg", "https://f.i.uol.com.br/fotografia/2019/09/30/15698728845d925bf4d6793_1569872884_3x2_md.jpg"],
                    id: 1718186419035,
                    linkcontato: "https://www.instagram.com/",
                    estilodoevento: ["1", "4"],
                    visualizacoes: {
                        total: 0,
                        gosto1: 0,
                        gosto2: 0,
                        gosto3: 0,
                        gosto4: 0,
                        gosto5: 0,
                        gosto6: 0,
                        gosto7: 0,
                        gosto8: 0,
                        gosto9: 0,
                        gosto10: 0,
                        gosto11: 0,
                        gosto12: 0,
                    },
                    favoritos: 0,
                    comentarios: [],
                    donodoevento: 1719666789117,
                },
            ],
            listadeusuarios:[
                {
                    username: "Eduardo",
                    senha: "12345",
                    email: "fffffff@gmail.com",
                    id: 1719666789117,
                    precoMedio: "564",
                    gostos: ["1", "2", "3"],
                    moeda: "R$",
                    favoritos: [],
                    visualizou: [],
                    foto_perfil: "https://fernandapessoa.com.br/wp-content/uploads/2021/11/jovem-na-escada-curso-fernanda-pessoa-um-novo-tempo-1536x1024.jpg"
                }
            ],
            usuario:{}
        };
    }
    return(objdados);
}


/*Converter data do banco do formato padrao para array com data e hora*/


function GV_converterdata(data){
    let convertida = data.split("T");
    convertida[0] = convertida[0].split("-");
    convertida[0] = convertida[0].reverse();
    convertida[0] = convertida[0].join("/")
    return convertida
}


/*Exibir os eventos favoritos na aba favoritos*/


function GV_mostrareventosfavoritos(GV_listatotaisfav){
    let GV_objtotaisfav = lerdadosusuario();
    let GV_strfav = '';
    //let GV_listatotaisfav = GV_objtotaisfav.evento;
    for(let GV_favevento of GV_objtotaisfav.usuario.favoritos){
        let GV_objfavevento = GV_listatotaisfav.find((elemento)=> elemento.id == GV_favevento);
        if(GV_objfavevento){
            let GV_dataehoraconvertida = GV_converterdata(GV_objfavevento.data) 
            GV_strfav = GV_strfav + `
            <div class="GV_exibicaodadosdoseventos">
                <div class="GV_titulodecadaevento">
                    <h3>${GV_objfavevento.nome_do_evento}</h3>
                </div>
                <div class="GV_imgfav">
                    <img src="${GV_objfavevento.fotos[0]}" alt="">
                </div>
                <div class="GV_dadosfavvisu">
                    <div class="GV_favdescriacao">
                        ${GV_objfavevento.descricao.replaceAll('\n', '<br>')}
                    </div>
                    <div class="GV_vervisualizacoes">
                        <span class="GV_destaquedatalocal">Data:</span> ${GV_dataehoraconvertida[0]} <span class="GV_destaquedatalocal">Hora:</span> ${GV_dataehoraconvertida[1]}<br>
                        <span class="GV_destaquedatalocal">Local:</span> ${GV_objfavevento.local}
                    </div>
                </div>
                <div class="GV_botoesdealteracao">
                    <button class="GV_vermaisbtn" data-id="${GV_objfavevento.id}">Ver mais</button>
                    <button class="GV_excluirbtn" data-id="${GV_objfavevento.id}">Excluir</button>
                </div>
            </div>`;
        }
    }
    GV_areadoseventosfavoritos.innerHTML = GV_strfav;
}


/*Exibir eventos na aba meus eventos*/


function GV_mostrareventosparaedicao(GV_arrayeventos){
    const GV_areadoseventosparaedicao = document.getElementById('GV_visualizarmodificareventos');
    let GV_stringeventosparaedicao = '';
    let GV_nomedosgostos = Object.keys(GV_arrayeventos[0].visualizacoes);
    for(let GV_imeventoedit = 1; GV_imeventoedit < GV_arrayeventos.length; GV_imeventoedit = GV_imeventoedit + 1)
    {
        let GV_objevento = GV_arrayeventos[GV_imeventoedit];
        if(GV_objevento.donodoevento == lerdadosusuario().usuario.id)
        {
            GV_stringeventosparaedicao = GV_stringeventosparaedicao + `
            <div class="GV_exibicaodadosdoseventos" data-index = "${GV_objevento.id}">
                <div class="GV_titulodecadaevento">
                    <h3>${GV_objevento.nome_do_evento}</h3>
                </div>
                <div class="GV_grafico">
                    <div class="chart">
                        <abbr title=""><div class="bar" id="gosto-1" ></div></abbr>
                        <abbr title=""><div class="bar" id="gosto-2" ></div></abbr>
                        <abbr title=""><div class="bar" id="gosto-3" ></div></abbr>
                        <abbr title=""><div class="bar" id="gosto-4" ></div></abbr>
                    </div>
                </div>
                <div class="GV_dadosfavvisu">
                    <div class="GV_verfavoritos">
                        Quantidade de favoritos: 
                        <span class="material-symbols-outlined">
                            star
                        </span>${GV_objevento.favoritos}
                    </div>
                    <div class="GV_vervisualizacoes">
                        Quantidade de visualizacoes:
                        <span class="material-symbols-outlined">
                            visibility
                        </span>${GV_objevento.visualizacoes.total}
                    </div>
                </div>
                <div class="GV_botoesdealteracao">
                    <button type="button" class="GV_botaoparamodificaroevento">Modificar</button>
                    <button type="button" class="GV_botaoparaexcluiroevento">Excluir</button>
                </div>
            </div>`;
        }
    }
    GV_areadoseventosparaedicao.innerHTML = GV_stringeventosparaedicao;
    const GV_todasareasdeedicao = document.querySelectorAll('.GV_exibicaodadosdoseventos');
    
            
            
    GV_todasareasdeedicao.forEach(function(area){
        let GV_ditoevento = GV_arrayeventos.find((elemento) => elemento.id == area.getAttribute("data-index"));
        if(GV_ditoevento)
        {
            let GV_valoresdosgostos = Object.values(GV_ditoevento.visualizacoes);
            let GV_legenda = area.querySelector('div.chart');
            let ED_Array_visu_gostos = new Array();
            let ED_array_maiores_visu_gostos = new Array(0,0,0,0);
            let ED_array_id_gostos = new Array(0,0,0,0);
            var ED_comparacao = 0;

            //Pegar os valores para calcular encontrar os 4 gostos com mais visualizações
            ED_Array_visu_gostos[0] = GV_ditoevento.visualizacoes.gosto1;
            ED_Array_visu_gostos[1] = GV_ditoevento.visualizacoes.gosto2;
            ED_Array_visu_gostos[2] = GV_ditoevento.visualizacoes.gosto3;
            ED_Array_visu_gostos[3] = GV_ditoevento.visualizacoes.gosto4;
            ED_Array_visu_gostos[4] = GV_ditoevento.visualizacoes.gosto5;
            ED_Array_visu_gostos[5] = GV_ditoevento.visualizacoes.gosto6;
            ED_Array_visu_gostos[6] = GV_ditoevento.visualizacoes.gosto7;
            ED_Array_visu_gostos[7] = GV_ditoevento.visualizacoes.gosto8;
            ED_Array_visu_gostos[8] = GV_ditoevento.visualizacoes.gosto9;
            ED_Array_visu_gostos[9] = GV_ditoevento.visualizacoes.gosto10;
            ED_Array_visu_gostos[10] = GV_ditoevento.visualizacoes.gosto11;
            ED_Array_visu_gostos[11] = GV_ditoevento.visualizacoes.gosto12;
            
            //Calculo de saber os 4 gostos com mais visualizações
            for (let i = 0; i < 12; i++) {
                if(ED_Array_visu_gostos[i] > ED_comparacao){
                    ED_comparacao = ED_Array_visu_gostos[i];
                    ED_array_maiores_visu_gostos[0] = ED_comparacao;
                    ED_array_id_gostos[0] = i+1;
                }
            }
            
            ED_comparacao = 0;
            
            for (let i = 0; i < 12; i++) {
                if(ED_Array_visu_gostos[i] > ED_comparacao && ED_array_id_gostos[0]-1 != i){
                    ED_comparacao = ED_Array_visu_gostos[i];
                    ED_array_maiores_visu_gostos[1] = ED_comparacao;
                    ED_array_id_gostos[1] = i+1;
                }
            }
            
            ED_comparacao = 0;
            
            for (let i = 0; i < 12; i++) {
                if(ED_Array_visu_gostos[i] > ED_comparacao && ED_array_id_gostos[1]-1 != i && ED_array_id_gostos[0]-1 != i){
                    ED_comparacao = ED_Array_visu_gostos[i];
                    ED_array_maiores_visu_gostos[2] = ED_comparacao;
                    ED_array_id_gostos[2] = i+1;
                }
            }
            
            ED_comparacao = 0;
            
            for (let i = 0; i < 12; i++) {
                if(ED_Array_visu_gostos[i] > ED_comparacao && ED_array_id_gostos[2]-1 != i && ED_array_id_gostos[0]-1 != i && ED_array_id_gostos[1]-1 != i){
                    ED_comparacao = ED_Array_visu_gostos[i];
                    ED_array_maiores_visu_gostos[3] = ED_comparacao;
                    ED_array_id_gostos[3] = i+1;
                }
            }
            
            // Exibir os dados nos graficos
            GV_legenda.innerHTML =                 
            `<abbr title="${GV_nomedosgostos[ED_array_id_gostos[0]]}: ${GV_valoresdosgostos[ED_array_id_gostos[0]]}"><div class="bar" id="gosto-1" ></div></abbr>
            <abbr title="${GV_nomedosgostos[ED_array_id_gostos[1]]}: ${GV_valoresdosgostos[ED_array_id_gostos[1]]}"><div class="bar" id="gosto-2" ></div></abbr>
            <abbr title="${GV_nomedosgostos[ED_array_id_gostos[2]]}: ${GV_valoresdosgostos[ED_array_id_gostos[2]]}"><div class="bar" id="gosto-3" ></div></abbr>
            <abbr title="${GV_nomedosgostos[ED_array_id_gostos[3]]}: ${GV_valoresdosgostos[ED_array_id_gostos[3]]}"><div class="bar" id="gosto-4" ></div></abbr>`

            // Selecionar a barras do grafico
            let ED_barra_1 = area.querySelector('#gosto-1');
            let ED_barra_2 = area.querySelector('#gosto-2');
            let ED_barra_3 = area.querySelector('#gosto-3');
            let ED_barra_4 = area.querySelector('#gosto-4');
            
            // Calcular escala adaptavel
            let fatorEscala = 200 / ED_array_maiores_visu_gostos[0]; 
            
            // Calcula as novas alturas proporcionalmente ao valor recebido
            let novaAltura1 = ED_array_maiores_visu_gostos[0] * fatorEscala;
            let novaAltura2 = ED_array_maiores_visu_gostos[1] * fatorEscala;
            let novaAltura3 = ED_array_maiores_visu_gostos[2] * fatorEscala;
            let novaAltura4 = ED_array_maiores_visu_gostos[3] * fatorEscala;
            
            // Define as novas alturas das barras
            ED_barra_1.style.height = novaAltura1 + 'px';
            ED_barra_2.style.height = novaAltura2 + 'px';
            ED_barra_3.style.height = novaAltura3 + 'px';
            ED_barra_4.style.height = novaAltura4 + 'px';
        }
    })   
}


/*Deletar o evento segundo seu index*/


/*function GV_deletareventos(GV_indexdoevento){
        let GV_objetodadosSTS = lerdadosevento();
        GV_objetodadosSTS.evento.splice(GV_indexdoevento, 1);
        salvardadosusuario(GV_objetodadosSTS);
        GV_mostrareventosparaedicao(lerdadosevento().evento)
}*/


/*Funçao a ser chamada assim que a pagina carregar*/


async function codigo(estilosdoseventovalores){

    const GV_abameuseventosedit = document.querySelector('div.GV_abameuseventos');
    //const GV_areadoseventosfavoritos = document.querySelector('div.GV_abameusfavoritos');
    const GV_btnabadoseventosfav = document.querySelector('button.GV_favoritosabamenor');
    const GV_btnabadoseventosmeusedit = document.querySelector('button.GV_meuseventosabamenor');
    const GV_btnabadoseventosmeuseditid = document.getElementById('GV_btnmeuseventos');
    const GV_html = document.querySelector('html');
    const GV_containerformulario = document.getElementById('GV_containerdoform');
    const GV_fundoescuro = document.getElementById('GV_fundoescuro');
    const formulario = document.getElementById('criarevento');
    //const GV_formularioquerry = document.getElementById('#criarevento');
    //const valoresdeprecos = document.getElementById('preco');

    const camponomedoevento = document.querySelector('input#nomedoevento');
    const labelnomedoevento = document.querySelector('label.nomedoevento');

    const campolocaldoevento = document.querySelector('input#localdoevento');
    const labellocaldoevento = document.querySelector('label.localdoevento');

    const campogastomedio = document.querySelector('input#preco');
    const labelgastomedio = document.querySelector('label.precomedio');

    const campodataevento = document.querySelector('input#data');
    const labeldataevento = document.querySelector('label.data');

    const campodescricaoevento = document.querySelector('textarea#descricao');
    const labeldescricaoevento = document.querySelector('label.descricao');

    const GV_campolinkcontato = document.querySelector('input.GV_linkcontato')
    const GV_labellinkcontato = document.querySelector('label.GV_linkcontato')

    const campoimagemevento = document.querySelector('input#fotos');
    const labelimagemevento = document.querySelector('label.fotos');
    const amostraimagemevento = document.querySelector('div.mostrarfotos');
    const adicionarimagemevento = document.querySelector('button#adicionarimagemevento');
    const excluirimagemevento = document.querySelector('button#excluirimagemevento');

    const avancar1 = document.getElementById('avancar1');
    const avancar2 = document.getElementById('avancar2');
    const GV_retroceder1 = document.getElementById('GV_retroceder1');
    const GV_retroceder2 =document.getElementById('GV_retroceder2');
    
    
    const primeiraparte = document.getElementById('primeiraparte');
    const segundaparte = document.getElementById('segundaparte');
    const terceiraparte = document.getElementById('terceiraparte');
    
    const nome_usuario = document.getElementById('nome_no_perfil');
    const foto_usuario = document.getElementById('foto_perfil_ED');
    const GV_botaoexcluirevento = document.querySelector('.GV_botaoparaexcluiroevento');

    const urlPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    
    var listaimagensevento = [];
    var novaArr = [];
    var vnomedoevento = false, vlocaldoevento = false, vgastomedio = true, vestiloevento = false, vdescricaoevento = false, vimagensevento = false, vdataevento = false, GV_vlinkcontato = false;
    var GV_idimagem = 0

    let GV_usuario_STS = lerdadosusuario();

    try{
        GV_bd_STS = {
            evento: await fetchurlsget(url1),
        }
        GV_mostrareventosfavoritos(GV_bd_STS.evento);
        GV_mostrareventosparaedicao(GV_bd_STS.evento);

        //Criar um novo evento
        formulario.addEventListener('submit', criar1 => {
            let GV_existe = true;
    //Lista dos estilos dos eventos sem repetiçoes
            novaArr = estilosdoseventovalores.filter((estilo, i) => estilosdoseventovalores.indexOf(estilo) === i);

    //Validacao dos estilos do evento
            if(novaArr.length == 0){
                    vestiloevento = false;
            } else {
                    vestiloevento = true;
            }

    //Validacao das imagens do evento
            if(listaimagensevento.length == 0){
                    vimagensevento = false;
            } else {
                    vimagensevento = true;
            }

    //Evitar que seja feito o padrao
            criar1.preventDefault();

    //Validacao geral na hora de criar um evento
            if(vnomedoevento && vlocaldoevento && vestiloevento && vgastomedio && vdescricaoevento && GV_vlinkcontato && vimagensevento && vdataevento){

                avisoavancar.innerHTML = '';
    //Pegar o objeto JavaScript gerado pelo formulario
            const formdata = new FormData(formulario);
            var dadosdosformularios = Object.fromEntries(formdata);

    //Substituir os estilos nos dados dos formularios
            dadosdosformularios.estilodoevento = novaArr;

    //Criar uma elemento moedas com valor e moeda
            dadosdosformularios.preco = {
                valor: parseFloat(dadosdosformularios.preco),
                moeda: dadosdosformularios.moeda,
            }
            delete dadosdosformularios.moeda;

            dadosdosformularios.fotos = listaimagensevento;

                if(GV_verificacaodemodificacao != 0){
                    dadosdosformularios.visualizacoes = GV_objetoeventoindex.visualizacoes;
                    dadosdosformularios.favoritos = GV_objetoeventoindex.favoritos;
                    dadosdosformularios.comentarios = GV_objetoeventoindex.comentarios;
                    dadosdosformularios.donodoevento = GV_objetoeventoindex.donodoevento;
                    dadosdosformularios.id = GV_objetoeventoindex.id;
                    //GV_modificardeterminadoevento(dadosdosformularios, GV_verificacaodemodificacao);
                    GV_existe = GV_bd_STS.evento.find((elemento)=>(elemento.local == dadosdosformularios.local && elemento.nome_do_evento == dadosdosformularios.nome_do_evento && elemento.data == dadosdosformularios.data && elemento.id != dadosdosformularios.id))
                    if(!GV_existe){
                        fetchput(url1 + `/${dadosdosformularios.id}`, dadosdosformularios, "0", ()=>{GV_updatedata()})
                        GV_idimagem = 0;
                        avisoavancar.innerHTML = '';
                        GV_containerformulario.style.display = 'none';
                        GV_fundoescuro.style.display = 'none';
                        GV_html.style.overflowY = 'auto';
                        botaocriarevento.innerText = 'Criar';
                    } else {
                        avisoavancar.innerHTML = '<span>*Esse evento já existe</span>';
                    }
                }else{
                    dadosdosformularios.id = Date.now().toString();
                    dadosdosformularios.visualizacoes = {
                        total: 0,
                        gosto1: 0,
                        gosto2: 0,
                        gosto3: 0,
                        gosto4: 0,
                        gosto5: 0,
                        gosto6: 0,
                        gosto7: 0,
                        gosto8: 0,
                        gosto9: 0,
                        gosto10: 0,
                        gosto11: 0,
                        gosto12: 0,
                    };
                    dadosdosformularios.favoritos = 0;
                    dadosdosformularios.comentarios = [];
                    dadosdosformularios.donodoevento = lerdadosusuario().usuario.id;
        //Mostrar na tela
                    GV_existe = GV_bd_STS.evento.find((elemento)=>(elemento.local == dadosdosformularios.local && elemento.nome_do_evento == dadosdosformularios.nome_do_evento && elemento.data == dadosdosformularios.data))
                    if(!GV_existe){
                        fetchpost(url1, dadosdosformularios, "0", ()=>{GV_updatedata()})
                        GV_idimagem = 0;
                        avisoavancar.innerHTML = '';
                        GV_containerformulario.style.display = 'none';
                        GV_fundoescuro.style.display = 'none';
                        GV_html.style.overflowY = 'auto';
                        botaocriarevento.innerText = 'Criar';
                    } else {
                        avisoavancar.innerHTML = '<span>*Esse evento já existe</span>';
                    }      
                }
            } else{
                botaocriarevento.style.display = 'inline';
                avisoavancar.innerHTML = '<span>*Preencha todos os campos corretamente</span>';
            }  
        });
    }catch(err){
        alert("Houve problemas de requisição: " + err)
    };
    
    // Mostrar os eventos da aba favoritos e meus eventos e salvar o local storage
    //GV_mostrareventosparaedicao(lerdadosevento().evento)
    salvardadosusuario(lerdadosusuario());
    
    
    //Se houver nome no usuario logado exibi-lo
    if (nome_usuario) {
        // Altera o conteúdo do elemento
        nome_usuario.textContent = GV_usuario_STS.usuario.username; 
    } else {
        console.error('Elemento com id "nome_no_perfil" não encontrado.');
    }
    //Se houver foto no usuario logado exibi-la
    if (foto_usuario) {
        // Altera o conteúdo do elemento
        foto_usuario.src = GV_usuario_STS.usuario.foto_perfil; 
    } else {
        console.error('Elemento com id "foto_perfil_ED" não encontrado.');
    }
    

    /*Botoes ver mais e excluir da aba favoritos*/


    GV_areadoseventosfavoritos.addEventListener('click',(favevent) => {
        if(favevent.target.getAttribute('class') == 'GV_vermaisbtn'){
            location.href = `eventopage.html?id=${favevent.target.getAttribute('data-id')}`
        }else if(favevent.target.getAttribute('class') == 'GV_excluirbtn'){
            let GV_objetodadosfav = lerdadosusuario();
            let GV_iddoeventofav = favevent.target.getAttribute('data-id');
            let GV_indexdoeventofav = -1;
            //let GV_contfav= 0
            //let GV_indexusuario = -1;
            //let GV_contusuario = 0;
            let GV_objeventofav = GV_bd_STS.evento.find((elemento)=>elemento.id == GV_iddoeventofav)
            /*do
            {
                if(GV_objetodadosfav.listadeusuarios[GV_contusuario].id == GV_objetodadosfav.usuario.id)
                {
                    GV_indexusuario = GV_contusuario;
                }
                GV_contusuario = GV_contusuario + 1;
            }
            while(GV_contusuario < GV_objetodadosfav.listadeusuarios.length && GV_indexusuario == -1);*/
            GV_indexdoeventofav = GV_objetodadosfav.usuario.favoritos.findIndex((elemento)=>elemento == GV_iddoeventofav);
            /*do
            {
                if(GV_objetodadosfav.usuario.favoritos[GV_contfav] == GV_iddoeventofav)
                {
                    GV_indexdoeventofav = GV_contfav;
                }
                GV_contfav = GV_contfav + 1;
            }
            while(GV_contfav < GV_objetodadosfav.usuario.favoritos.length && GV_indexdoeventofav == -1);
            console.log(GV_indexusuario);*/
            if(GV_indexdoeventofav >= 0)
            {
                if(GV_objeventofav){
                    GV_objeventofav.favoritos = GV_objeventofav.favoritos - 1;
                }
                GV_objetodadosfav.usuario.favoritos.splice(GV_indexdoeventofav, 1);
                fetchput(url1 + `/${GV_iddoeventofav}`, GV_objeventofav, "0", ()=>{GV_updatedata()});
                fetchput(url2 + `/${GV_objetodadosfav.usuario.id}`, GV_objetodadosfav.usuario, "0", ()=>{GV_updatedata()})
                //GV_objetodadosfav.listadeusuarios[GV_indexusuario].favoritos.splice(GV_indexdoeventofav, 1);
                salvardadosusuario(GV_objetodadosfav);
                //GV_mostrareventosfavoritos();
            }
            GV_mostrareventosparaedicao(GV_bd_STS.evento);
        }
        
    })

    GV_btnabadoseventosmeusedit.addEventListener('click', () => {
        GV_areadoseventosfavoritos.classList.add('hidden')
        GV_btnabadoseventosfav.classList.remove('GV_botaoerguido');
        GV_btnabadoseventosmeusedit.classList.add('GV_botaoerguido');
        GV_abameuseventosedit.classList.remove('hidden');
        GV_btnabadoseventosmeuseditid.style.boxShadow = "none";
    })

    GV_btnabadoseventosfav.addEventListener('click', () => {
        GV_areadoseventosfavoritos.classList.remove('hidden')
        GV_btnabadoseventosfav.classList.add('GV_botaoerguido');
        GV_btnabadoseventosmeusedit.classList.remove('GV_botaoerguido');
        GV_abameuseventosedit.classList.add('hidden');
    })

    //Limpar os dados do formulario
    function limparformulario(){
        let GV_checkboxestilo = document.querySelectorAll('input.input-checkbox');
        camponomedoevento.value = '';
        campolocaldoevento.value = '';
        campodataevento.value = '';
        campogastomedio.value = '0.00';
        campodescricaoevento.value = '';
        GV_campolinkcontato.value = '';
        campoimagemevento.value = '';
        listaimagensevento = [];
        GV_idimagem = 0;
        amostraimagemevento.innerHTML = '<span id="gv_espaco">&ensp;</span>'
    }

//Botao criar para mostrar o formulario

    GV_botaomostrarformcriarevento.addEventListener('click', () => {
        limparformulario();
        GV_containerformulario.style.display = 'block';
        GV_fundoescuro.style.display = 'block';
        GV_html.style.overflowY = 'hidden';
        segundaparte.style.display = 'none';
        terceiraparte.style.display = 'none'; 
        primeiraparte.style.display = 'block';
        GV_retroceder2.style.display = 'none';
        GV_retroceder1.style.display = 'none';
        avancar1.style.display = 'inline';
        avancar2.style.display = 'none';
        botaocriarevento.style.display = 'none';
        avisoavancar.innerHTML = '';
        GV_vlinkcontato = false;
        vnomedoevento = false;
        vlocaldoevento = false;
        vgastomedio = true;
        vestiloevento = false;
        vdescricaoevento = false;
        vimagensevento = false;
        vdataevento = false;
    })

//Formatar data
    function formatardata(date = new Date(), formatacao = 'yyyy-mm-ddThh:nn')
    {
        formatacao = formatacao.replace('dd', date.getDate().toString().padStart(2, '0')).replace('mm', (date.getMonth() + 1).toString().padStart(2, '0')).replace('yyyy', date.getFullYear()).replace('hh', date.getHours().toString().padStart(2, '0')).replace('nn', date.getMinutes().toString().padStart(2, '0'));
        return(formatacao);
    }

//Atribuir uma valor minimo ao campo data
    campodataevento.setAttribute('min', formatardata())

//Excluir determinado evento
    GV_areadoseventosparaedicao.addEventListener('click', (GV_informacao) => {
        //let GV_indexdoevento;
        let GV_oquefoiclicado = GV_informacao.target;
        if(GV_oquefoiclicado.getAttribute('class') == 'GV_botaoparaexcluiroevento'){
            fetchdelete(url1 + `/${GV_oquefoiclicado.parentNode.parentNode.getAttribute('data-index')}`, "0", () => {GV_updatedata();});
        } else if (GV_oquefoiclicado.getAttribute('class') == 'GV_botaoparamodificaroevento'){
            //GV_indexdoevento = GV_idindexevento(GV_oquefoiclicado.parentNode.parentNode.getAttribute('data-index'));
            limparformulario();
            GV_containerformulario.style.display = 'block';
            GV_fundoescuro.style.display = 'block';
            GV_html.style.overflowY = 'hidden';
            segundaparte.style.display = 'none';
            terceiraparte.style.display = 'none';
            primeiraparte.style.display = 'block';
            GV_retroceder2.style.display = 'none';
            GV_retroceder1.style.display = 'none';
            avancar1.style.display = 'inline';
            avancar2.style.display = 'none';
            botaocriarevento.style.display = 'none';
            GV_verificacaodemodificacao = 1;
            GV_objetoeventoindex = GV_bd_STS.evento.find((elemento)=>elemento.id == GV_oquefoiclicado.parentNode.parentNode.getAttribute('data-index'));
            camponomedoevento.value = GV_objetoeventoindex.nome_do_evento;
            campolocaldoevento.value = GV_objetoeventoindex.local;
            campogastomedio.value = GV_objetoeventoindex.preco.valor
            campodataevento.value = GV_objetoeventoindex.data
            campodescricaoevento.value = GV_objetoeventoindex.descricao
            GV_campolinkcontato.value = GV_objetoeventoindex.linkcontato
            listaimagensevento = JSON.parse(JSON.stringify(GV_objetoeventoindex.fotos))
            for(let GV_imagem of listaimagensevento){
                /*if(document.getElementById('gv_espaco')){
                    document.getElementById('gv_espaco').remove();
                }
                amostraimagemevento.innerHTML = amostraimagemevento.innerHTML + `<img src="${GV_imagem}" alt="" class="imagensdoseventos">` */
                if(document.getElementById('gv_espaco')){
                    document.getElementById('gv_espaco').remove();
                }
                amostraimagemevento.innerHTML = amostraimagemevento.innerHTML + `<div data-index='${GV_idimagem}'><button data-index='${GV_idimagem}' class='GV_excluirimg'>X</button><img src="${GV_imagem}" alt="" class="imagensdoseventos"></div>` 
                GV_idimagem = GV_idimagem + 1;
            }
            GV_vlinkcontato = true;
            vnomedoevento = true;
            vlocaldoevento = true;
            vgastomedio = true;
            vestiloevento = true;
            vdescricaoevento = true;
            vimagensevento = true;
            vdataevento = true;
            botaocriarevento.innerText = 'Modificar';
        }
    })

//Adicionar imagem ao evento
    adicionarimagemevento.addEventListener('click', () => {
        listaimagensevento.push(campoimagemevento.value);
        
        if(urlPattern.test(campoimagemevento.value))
        {
            if(document.getElementById('gv_espaco')){
                document.getElementById('gv_espaco').remove();
            }
            amostraimagemevento.innerHTML = amostraimagemevento.innerHTML + `<div data-index='${GV_idimagem}'><button data-index='${GV_idimagem}' class='GV_excluirimg'>X</button><img src="${campoimagemevento.value}" alt="" class="imagensdoseventos"></div>` 
            campoimagemevento.value = '';
            labelimagemevento.innerHTML = '';
            GV_idimagem = GV_idimagem + 1;
        }
        else
        {
            GV_vlinkcontato = false;
            labelimagemevento.innerHTML = '*Insira um link válido';
        }
    })

//Excluir imagem adicionada ao evento
    amostraimagemevento.addEventListener('click', (GV_imgclick)=>{
        let GV_btnexcimg = GV_imgclick.target;
        if(GV_btnexcimg.getAttribute('class') == 'GV_excluirimg'){
            let GV_indeximg = GV_btnexcimg.getAttribute('data-index');
            listaimagensevento.splice(GV_indeximg, 1);
            amostraimagemevento.querySelector(`[data-index="${GV_indeximg}"]`).remove();
            for(let GV_iniimg = parseInt(GV_indeximg) +1; GV_iniimg <= listaimagensevento.length; GV_iniimg = GV_iniimg + 1){
                console.log(GV_iniimg);
                amostraimagemevento.querySelector(`div[data-index="${GV_iniimg}"]`).setAttribute('data-index', `${GV_iniimg-1}`);
                amostraimagemevento.querySelector(`button[data-index="${GV_iniimg}"]`).setAttribute('data-index', `${GV_iniimg-1}`);
            }
            
            console.log(listaimagensevento)
            GV_idimagem = GV_idimagem - 1;
            console.log(GV_idimagem);
        }
        
    })

//Validacao do nome do evento
    camponomedoevento.addEventListener('blur', () => {
        if(camponomedoevento.value.length < 5){
                labelnomedoevento.innerHTML = '*Insira no mínimo 5 caracteres';
                vnomedoevento = false;
        } else{
                labelnomedoevento.innerHTML = '';
                vnomedoevento = true;
        }
    });
    camponomedoevento.addEventListener('change', () => {
        if(camponomedoevento.value.length < 5){
                labelnomedoevento.innerHTML = '*Insira no mínimo 5 caracteres';
                vnomedoevento = false;
        } else{
                labelnomedoevento.innerHTML = '';
                vnomedoevento = true;
        }
    });

//Validacao do local do evento
    campolocaldoevento.addEventListener('blur', () => {
        if(campolocaldoevento.value.length < 15){
                labellocaldoevento.innerHTML = '*Insira no mínimo 15 caracteres';
                vlocaldoevento = false;
        } else{
                labellocaldoevento.innerHTML = '';
                vlocaldoevento = true;
        }
    });
    campolocaldoevento.addEventListener('change', () => {
        if(campolocaldoevento.value.length < 15){
                labellocaldoevento.innerHTML = '*Insira no mínimo 15 caracteres';
                vlocaldoevento = false;
        } else{
                labellocaldoevento.innerHTML = '';
                vlocaldoevento = true;
        }
    });

//Validacao do gasto medio do evento
    campogastomedio.addEventListener('blur', () => {
        if(campogastomedio.value == ''){
                labelgastomedio.innerHTML = '*Insira um valor';
                vgastomedio = false;
        } else{
                vgastomedio = true;
        }
    });
    campogastomedio.addEventListener('change', () => {
        if(campogastomedio.value == ''){
                labelgastomedio.innerHTML = '*Insira um valor';
                vgastomedio = false;
        } else{
                vgastomedio = true;
        }
    });

//Validacao da data do evento
    function GV_validardata(){
        let GV_dataehoraatual = new Date(formatardata());
        let GV_datadoevento = new Date(campodataevento.value);
        if((campodataevento.value == '') || (GV_datadoevento < GV_dataehoraatual)){
            labeldataevento.innerHTML = '*Insira uma data válida';
            vdataevento = false;
        } else {
            labeldataevento.innerHTML = '';
            vdataevento = true;
        }
    }
    campodataevento.addEventListener('blur', () => {
        GV_validardata();
    })
    campodataevento.addEventListener('change', () => {
        GV_validardata();
    })

//Validacao da descricao do evento
    campodescricaoevento.addEventListener('blur', () => {
        if(campodescricaoevento.value.length < 100){
            labeldescricaoevento.innerHTML = '*Insira no mínimo 100 caracteres';
            vdescricaoevento = false;
        } else if(campodescricaoevento.value.length > 350){
            labeldescricaoevento.innerHTML = '*Insira no máximo 350 caracteres';
            vdescricaoevento = false;
        } else{
            labeldescricaoevento.innerHTML = '';
            vdescricaoevento = true;
        }
    });
    campodescricaoevento.addEventListener('change', () => {
        if(campodescricaoevento.value.length < 100){
            labeldescricaoevento.innerHTML = '*Insira no mínimo 100 caracteres';
            vdescricaoevento = false;
        } else if(campodescricaoevento.value.length > 350){
            labeldescricaoevento.innerHTML = '*Insira no máximo 350 caracteres';
            vdescricaoevento = false;
        } else{
            labeldescricaoevento.innerHTML = '';
            vdescricaoevento = true;
        }
    });

//Validacao do link de contato
    GV_campolinkcontato.addEventListener('blur', () =>{
        if(urlPattern.test(GV_campolinkcontato.value))
        {
            GV_vlinkcontato = true;
            GV_labellinkcontato.innerHTML = '';
        }
        else
        {
            GV_vlinkcontato = false;
            GV_labellinkcontato.innerHTML = '*Insira um link válido';
        }
    })
    GV_campolinkcontato.addEventListener('change', () =>{
        if(urlPattern.test(GV_campolinkcontato.value))
        {
            GV_vlinkcontato = true;
            GV_labellinkcontato.innerHTML = '';
        }
        else
        {
            GV_vlinkcontato = false;
            GV_labellinkcontato.innerHTML = '*Insira um link válido';
        }
    })

//Limpar dados e retornar ao precionar cancelar
    GV_cancelar.addEventListener('click', GV_cancelar => {
        limparformulario();
        GV_containerformulario.style.display = 'none';
        GV_fundoescuro.style.display = 'none';
        GV_html.style.overflowY = 'auto'
        avisoavancar.innerHTML = '';
    });

//Validar os dados e ir para pagina 2
    avancar1.addEventListener('click', proximapagina => {
        novaArr = estilosdoseventovalores.filter((estilo, i) => estilosdoseventovalores.indexOf(estilo) === i);
        
        if(novaArr.length == 0){
                vestiloevento = false;
        } else {
                vestiloevento = true;
        }
        if(vnomedoevento && vlocaldoevento && vestiloevento && vgastomedio && vdataevento){
                avisoavancar.innerHTML = '';
                primeiraparte.style.display = 'none';
                segundaparte.style.display = 'inherit';
                avancar1.style.display = 'none';
                avancar2.style.display = 'inline';
                GV_retroceder1.style.display = 'inline';
        } else {
                avisoavancar.innerHTML = '<span>*Preencha todos os campos corretamente</span>';
                avancar1.style.display = 'inline';
                GV_retroceder1.style.display = 'none';
        }
    });

//Retroceder da pagina 2 para a pagina 1
    GV_retroceder1.addEventListener('click', GV_parginaanterior =>{
        avisoavancar.innerHTML = '';
        primeiraparte.style.display = 'inherit';
        segundaparte.style.display = 'none';
        avancar1.style.display = 'inline';
        avancar2.style.display = 'none';
        GV_retroceder1.style.display = 'none';
    });

//Validar os dados e ir para pagina 3
    avancar2.addEventListener('click', proximapagina2 => {
        if(vdescricaoevento && GV_vlinkcontato){
                avisoavancar.innerHTML = '';
                segundaparte.style.display = 'none';
                terceiraparte.style.display = 'inherit';
                avancar2.style.display = 'none';
                botaocriarevento.style.display = 'inline';
                GV_retroceder2.style.display = 'inline';
                GV_retroceder1.style.display = 'none';
        } else {
                avisoavancar.innerHTML = '<span>*Preencha todos os campos corretamente</span>';
                avancar2.style.display = 'inline';
                GV_retroceder2.style.display = 'none';
        }
    })
//Retroceder da pagina 3 para a pagina 2
    GV_retroceder2.addEventListener('click', GV_parginaanterior2 =>
        {
                avisoavancar.innerHTML = '';
                segundaparte.style.display = 'inherit';
                terceiraparte.style.display = 'none';
                avancar2.style.display = 'inline';
                botaocriarevento.style.display = 'none';
                GV_retroceder2.style.display = 'none';
                GV_retroceder1.style.display = 'inline';
        });


    

    preco.addEventListener('change', function(){
        if(preco.value == ''){
                preco.value = 0;
        }
        preco.value = parseFloat(preco.value).toFixed(2);
    })

    
}






// Author: Habib Mhamadi
// Email: habibmhamadi@gmail.com

function MultiSelectTag(e,t={shadow:!1,rounded:!0}){var n=null,l=null,a=null,d=null,s=null,o=null,i=null,r=null,c=null,u=null,v=null,p=null,h=t.tagColor||{};h.textColor="#0372B2",h.borderColor="#0372B2",h.bgColor="#C0E6FC";var m=new DOMParser;function g(e,t,n=!1){const l=document.createElement("li");l.innerHTML="<input type='checkbox' style='margin:0 0.5em 0 0' class='input_checkbox'>",l.innerHTML+=e.label,l.dataset.value=e.value;const a=l.firstChild;a.dataset.value=e.value,t&&e.label.toLowerCase().startsWith(t.toLowerCase())?p.appendChild(l):t||p.appendChild(l),n&&(l.style.backgroundColor=h.bgColor,a.checked=!0)}function f(e=null){for(var t of(p.innerHTML="",l))t.selected?(!b(t.value)&&C(t),g(t,e,!0)):g(t,e)}function C(e){const t=document.createElement("div");t.classList.add("item-container"),t.style.color=h.textColor||"#2c7a7b",t.style.borderColor=h.borderColor||"#81e6d9",t.style.background=h.bgColor||"#e6fffa";const n=document.createElement("div");n.classList.add("item-label"),n.style.color=h.textColor||"#2c7a7b",n.innerHTML=e.label,n.dataset.value=e.value;const a=m.parseFromString('<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="item-close-svg">\n                <line x1="18" y1="6" x2="6" y2="18"></line>\n                <line x1="6" y1="6" x2="18" y2="18"></line>\n            </svg>',"image/svg+xml").documentElement;a.addEventListener("click",(t=>{l.find((t=>t.value==e.value)).selected=!1,w(e.value),f(),E()})),t.appendChild(n),t.appendChild(a),i.append(t)}function L(){for(var e of p.children)e.addEventListener("click",(e=>{!1===l.find((t=>t.value==e.target.dataset.value)).selected?(l.find((t=>t.value==e.target.dataset.value)).selected=!0,c.value=null,f(),E()):(l.find((t=>t.value==e.target.dataset.value)).selected=!1,c.value=null,f(),E(),w(e.target.dataset.value))}))}function b(e){for(var t of i.children)if(!t.classList.contains("input-body")&&t.firstChild.dataset.value==e)return!0;return!1}function w(e){for(var t of i.children)t.classList.contains("input-body")||t.firstChild.dataset.value!=e||i.removeChild(t)}function E(e=!0){selected_values=[];for(var a=0;a<l.length;a++)n.options[a].selected=l[a].selected,l[a].selected&&selected_values.push({label:l[a].label,value:l[a].value});e&&t.hasOwnProperty("onChange")&&t.onChange(selected_values)}n=document.getElementById(e),function(){l=[...n.options].map((e=>({value:e.value,label:e.label,selected:e.selected}))),n.classList.add("hidden"),(a=document.createElement("div")).classList.add("mult-select-tag"),(d=document.createElement("div")).classList.add("wrapper"),(o=document.createElement("div")).classList.add("body"),t.shadow&&o.classList.add("shadow"),t.rounded&&o.classList.add("rounded"),(i=document.createElement("div")).classList.add("input-container"),(c=document.createElement("input")).classList.add("input"),c.placeholder=`${t.placeholder||"Search..."}`,(r=document.createElement("inputBody")).classList.add("input-body"),r.append(c),o.append(i),(s=document.createElement("div")).classList.add("btn-container"),(u=document.createElement("button")).type="button",s.append(u);const e=m.parseFromString('<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n                <polyline points="18 15 12 21 6 15"></polyline>\n            </svg>',"image/svg+xml").documentElement;u.append(e),o.append(s),d.append(o),(v=document.createElement("div")).classList.add("drawer","hidden"),t.shadow&&v.classList.add("shadow"),t.rounded&&v.classList.add("rounded"),v.append(r),p=document.createElement("ul"),v.appendChild(p),a.appendChild(d),a.appendChild(v),n.nextSibling?n.parentNode.insertBefore(a,n.nextSibling):n.parentNode.appendChild(a)}(),f(),L(),E(!1),u.addEventListener("click",(()=>{v.classList.contains("hidden")?(f(),L(),v.classList.remove("hidden"),c.focus()):v.classList.add("hidden")})),c.addEventListener("keyup",(e=>{f(e.target.value),L()})),c.addEventListener("keydown",(e=>{if("Backspace"===e.key&&!e.target.value&&i.childElementCount>1){const e=o.children[i.childElementCount-2].firstChild;l.find((t=>t.value==e.dataset.value)).selected=!1,w(e.dataset.value),E()}})),window.addEventListener("click",(e=>{a.contains(e.target)||("LI"!==e.target.nodeName&&"input_checkbox"!==e.target.getAttribute("class")?v.classList.add("hidden"):L())}))}

function MultiSelectTag2(el, customs = { shadow: false, rounded: true }) {
        // Initialize variables
        var element = null,
            options = null,
            customSelectContainer = null,
            wrapper = null,
            btnContainer = null,
            body = null,
            inputContainer = null,
            inputBody = null,
            input = null,
            button = null,
            drawer = null,
            ul = null;
    
        // Customize tag colors
        var tagColor = customs.tagColor || {};
        tagColor.textColor = "#0372B2";
        tagColor.borderColor = "#0372B2";
        tagColor.bgColor = "#C0E6FC";
    
        // Initialize DOM Parser
        var domParser = new DOMParser();
    
        // Initialize
        init();
    
        function init() {
            // DOM element initialization
            element = document.getElementById(el);
            createElements();
            initOptions();
            enableItemSelection();
            setValues(false);
    
            // Event listeners
            button.addEventListener('click', () => {
                if (drawer.classList.contains('hidden')) {
                    initOptions();
                    enableItemSelection();
                    drawer.classList.remove('hidden');
                    input.focus();
                } else {
                    drawer.classList.add('hidden');
                }
            });
    
            input.addEventListener('keyup', (e) => {
                initOptions(e.target.value);
                enableItemSelection();
            });
    
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && inputContainer.childElementCount > 1) {
                    const child = body.children[inputContainer.childElementCount - 2].firstChild;
                    const option = options.find((op) => op.value == child.dataset.value);
                    option.selected = false;
                    removeTag(child.dataset.value);
                    setValues();
                }
            });
    
            window.addEventListener('click', (e) => {
                if (!customSelectContainer.contains(e.target)) {
                    if ((e.target.nodeName !== "LI") && (e.target.getAttribute("class") !== "input_checkbox")) {
                        // hide the list option only if we click outside of it
                        drawer.classList.add('hidden');
                    } else {
                        // enable again the click on the list options
                        enableItemSelection();
                    }
                }
            });
        }
    
        function createElements() {
            // Create custom elements
            options = getOptions();
            element.classList.add('hidden');
    
            // .multi-select-tag
            customSelectContainer = document.createElement('div');
            customSelectContainer.classList.add('mult-select-tag');
    
            // .container
            wrapper = document.createElement('div');
            wrapper.classList.add('wrapper');
    
            // body
            body = document.createElement('div');
            body.classList.add('body');
            if (customs.shadow) {
                body.classList.add('shadow');
            }
            if (customs.rounded) {
                body.classList.add('rounded');
            }
    
            // .input-container
            inputContainer = document.createElement('div');
            inputContainer.classList.add('input-container');
    
            // input
            input = document.createElement('input');
            input.classList.add('input');
            input.placeholder = `${customs.placeholder || 'Search...'}`;
    
            inputBody = document.createElement('inputBody');
            inputBody.classList.add('input-body');
            inputBody.append(input);
    
            body.append(inputContainer);
    
            // .btn-container
            btnContainer = document.createElement('div');
            btnContainer.classList.add('btn-container');
    
            // button
            button = document.createElement('button');
            button.type = 'button';
            btnContainer.append(button);
    
            const icon = domParser.parseFromString(
                `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 21 6 15"></polyline>
                </svg>`, 'image/svg+xml').documentElement;
    
            button.append(icon);
    
            body.append(btnContainer);
            wrapper.append(body);
    
            drawer = document.createElement('div');
            drawer.classList.add(...['drawer', 'hidden']);
            if (customs.shadow) {
                drawer.classList.add('shadow');
            }
            if (customs.rounded) {
                drawer.classList.add('rounded');
            }
            drawer.append(inputBody);
            ul = document.createElement('ul');
    
            drawer.appendChild(ul);
    
            customSelectContainer.appendChild(wrapper);
            customSelectContainer.appendChild(drawer);
    
            // Place TailwindTagSelection after the element
            if (element.nextSibling) {
                element.parentNode.insertBefore(customSelectContainer, element.nextSibling);
            } else {
                element.parentNode.appendChild(customSelectContainer);
            }
        }
    
        function createElementInSelectList(option, val, selected = false) {
            // Create a <li> elmt in the drop-down list,
            // selected parameters tells if the checkbox need to be selected and the bg color changed
            const li = document.createElement('li');
            li.innerHTML = "<input type='checkbox' style='margin:0 0.5em 0 0' class='input_checkbox'>"; // add the checkbox at the left of the <li>
            li.innerHTML += option.label;
            li.dataset.value = option.value;
            const checkbox = li.firstChild;
            checkbox.dataset.value = option.value;
    
            // For search
            if (val && option.label.toLowerCase().startsWith(val.toLowerCase())) {
                ul.appendChild(li);
            } else if (!val) {
                ul.appendChild(li);
            }
    
            // Change bg color and checking the checkbox
            if (selected) {
                li.style.backgroundColor = tagColor.bgColor;
                checkbox.checked = true;
            }
        }
    
        function initOptions(val = null) {
            ul.innerHTML = '';
            for (var option of options) {
                // if option already selected
                if (option.selected) {
                    !isTagSelected(option.value) && createTag(option);
    
                    // We create a option in the list, but with different color
                    createElementInSelectList(option, val, true);
                } else {
                    createElementInSelectList(option, val);
                }
            }
        }
    
        function createTag(option) {
            // Create and show selected item as tag
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-container');
            itemDiv.style.color = tagColor.textColor || '#2c7a7b';
            itemDiv.style.borderColor = tagColor.borderColor || '#81e6d9';
            itemDiv.style.background = tagColor.bgColor || '#e6fffa';
            const itemLabel = document.createElement('div');
            itemLabel.classList.add('item-label');
            itemLabel.style.color = tagColor.textColor || '#2c7a7b';
            itemLabel.innerHTML = option.label;
            itemLabel.dataset.value = option.value;
            const itemClose = domParser.parseFromString(
                `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="item-close-svg">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>`, 'image/svg+xml').documentElement;
    
            itemClose.addEventListener('click', (e) => {
                const unselectOption = options.find((op) => op.value == option.value);
                unselectOption.selected = false;
                removeTag(option.value);
                initOptions();
                setValues();
            });
    
            itemDiv.appendChild(itemLabel);
            itemDiv.appendChild(itemClose);
            inputContainer.append(itemDiv);
        }
    
        function enableItemSelection() {
            // Add click listener to the list items
            for (var li of ul.children) {
                li.addEventListener('click', (e) => {
                    if (options.find((o) => o.value == e.target.dataset.value).selected === false) {
                        // if the option is not selected, we select it
                        options.find((o) => o.value == e.target.dataset.value).selected = true;
                        input.value = null;
                        initOptions();
                        setValues();
                        //input.focus() // brings up the list to the input
                    } else {
                        // if it's already selected, we deselect it
                        options.find((o) => o.value == e.target.dataset.value).selected = false;
                        input.value = null;
                        initOptions();
                        setValues();
                        //input.focus() // brings up the list on the input
                        removeTag(e.target.dataset.value);
                    }
                });
            }
        }
    
        function isTagSelected(val) {
            // If the item is already selected
            for (var child of inputContainer.children) {
                if (!child.classList.contains('input-body') && child.firstChild.dataset.value == val) {
                    return true;
                }
            }
            return false;
        }
    
        function removeTag(val) {
            // Remove selected item
            for (var child of inputContainer.children) {
                if (!child.classList.contains('input-body') && child.firstChild.dataset.value == val) {
                    inputContainer.removeChild(child);
                }
            }
        }
    
        function setValues(fireEvent = true) {
            // Update element final values
            selected_values = [];
            for (var i = 0; i < options.length; i++) {
                element.options[i].selected = options[i].selected;
                if (options[i].selected) {
                    selected_values.push({ label: options[i].label, value: options[i].value });
                }
            }
            if (fireEvent && customs.hasOwnProperty('onChange')) {
                customs.onChange(selected_values);
            }
        }
    
        function getOptions() {
            // Map element options
            return [...element.options].map((op) => {
                return {
                    value: op.value,
                    label: op.label,
                    selected: op.selected,
                };
            });
        }
    








const GV_teste = document.getElementById('GV_limparchecbox');


//GV_teste.addEventListener('click', (tregfa) => 
    function GV_limparestiloevento(){
        let GV_checkboxestiloteste = document.querySelector('input.input_checkbox');
        GV_checkboxestiloteste.checked = false;
        //let GV_ul = document.querySelector('div.drawer.rounded ul');
        //GV_ul.style.background = 'black'


        ul = document.querySelector('div.drawer.rounded ul');
        for (var li of ul.children) {
            //console.log(li.dataset.value);    
            if (options.find((o) => o.value == li.dataset.value).selected === true) {
                options.find((o) => o.value == li.dataset.value).selected = false;
                input.value = null;
                initOptions();
                setValues();
                removeTag(li.dataset.value);
            }
        }
    }

    function GV_modificarosgostos(GV_listadegosto){
        for (let GV_gosto of GV_listadegosto) {
            //console.log(li.dataset.value);    
            if (options.find((o) => o.value == GV_gosto).selected === false) {
                options.find((o) => o.value == GV_gosto).selected = true;
                input.value = null;
                initOptions();
                setValues();
            }
        }
    }
    

    //botaocriarevento.addEventListener('click', () =>{GV_limparestiloevento()})

    GV_cancelar.addEventListener('click', () =>{GV_limparestiloevento()})

    GV_botaomostrarformcriarevento.addEventListener('click', () =>{GV_limparestiloevento()})

    GV_areadoseventosparaedicao.addEventListener('click', (GV_informacao) => {
        //let GV_indexdoevento;
        let GV_oquefoiclicado = GV_informacao.target;
        if (GV_oquefoiclicado.getAttribute('class') == 'GV_botaoparamodificaroevento'){
            //GV_indexdoevento = GV_idindexevento(GV_oquefoiclicado.parentNode.parentNode.getAttribute('data-index'));
            GV_modificarosgostos(GV_bd_STS.evento.find((elemento)=>GV_oquefoiclicado.parentNode.parentNode.getAttribute('data-index') == elemento.id).estilodoevento);
        }
    })
}



function deslogar(){
    var logado = false;
    let GV_objdadosusuario = lerdadosevento();
    GV_objdadosusuario.usuario = {};
    salvardadosusuario(GV_objdadosusuario);
    location.href = "index.html";
    alert('deslogado com sucesso');
    sessionStorage.setItem("logado", logado);
 }
 function ir_para_alteracao(){
    location.href = "editar_perfil.html";
 }

function GV_codigopaginacadastro(){
    const GV_formulariocadastrousuario = document.getElementById('formulariodecadastrousuario');

    new MultiSelectTag('gostos', {
        rounded: true,    // default true
        shadow: true,      // default false
        placeholder: 'Search',  // default Search...
        tagColor: {
            textColor: '#327b2c',
            borderColor: '#92e681',
            bgColor: '#eaffe6',
        },
        onChange: function(values) {
            
            for(var GV_iest = 0; GV_iest <= ED_gostospaginacadastro.length; GV_iest = GV_iest + 1){ED_gostospaginacadastro.pop()}
            if(ED_gostospaginacadastro.length > 0){
                for(var GV_iest = 0; GV_iest <= ED_gostospaginacadastro.length; GV_iest = GV_iest + 1){ED_gostospaginacadastro.pop()}
            }
            console.log(ED_gostospaginacadastro);
            values.map((estilo) => {
                ED_gostospaginacadastro.push(estilo.value) ;
        
            })
            console.log(ED_gostospaginacadastro);
        }
    })

    GV_formulariocadastrousuario.addEventListener('submit', eventocad =>{
        eventocad.preventDefault();
        cadastro(ED_gostospaginacadastro)
    })
} 

function cadastro(ED_estilos){
 
    // Coletar valores dos inputs
    var  ED_username = document.getElementById('username').value;
    var  ED_senha = document.getElementById('senha_criar').value;
    var  ED_email = document.getElementById('email').value;
    var  ED_foto_perfil = document.getElementById('foto_perfil').value;
    var ED_iD_usuario = Date.now();
    var  ED_precoMedio = document.getElementById('preco-médio-usuario').value;
    var gostosSelect = document.getElementById('gostos');
    var ED_gostos = ED_estilos;
    //var ED_gostos = Array.from(gostosSelect.selectedOptions).map(option => option.value);
    var ED_moeda = document.querySelector('.form-select').value;
    
    //variavel para saber se esta logado
    var ED_logado = false;


    //variavel para validação
    var ED_username_conf = false, ED_senha_conf = false, ED_preco_conf = false;

    //validação do username
    if(ED_username.length < 5){
        alert('ERRO: username deve ter mais que 5 caracteres');
    }
    else{
        ED_username_conf= true;
    }
    
    //validação da senha
    if(ED_senha.length < 5){
        alert('ERRO: senha deve ter mais que 5 caracteres');
    }
    else{
        ED_senha_conf = true;
    }

    //validação preco
    if(ED_precoMedio < 10){
        alert('ERRO: valor muito baixo');
    }
    else{
        ED_preco_conf = true;
    }

 



    if(ED_username_conf && ED_senha_conf && ED_preco_conf){
         // Criar objeto usuário
     const usuario = {
        username: ED_username,
        senha: ED_senha,
        email: ED_email,
        foto_perfil: ED_foto_perfil,
        id: ED_iD_usuario.toString(),
        precoMedio: ED_precoMedio,
        gostos: ED_gostos,
        moeda: ED_moeda,
        favoritos: [],
        visualizou: [],
    };

        
    // Armazenar objeto usuário no localStorage
    GV_salvardadosdousuarioatual(usuario);
    //localStorage.setItem('usuario', JSON.stringify(usuario));
        
    ED_logado = true;
    sessionStorage.setItem("logado", ED_logado);

    

    // Exibir mensagem de sucesso 
    alert('Usuário cadastrado com sucesso!');
    }
    else{
        location.href = "cadastrar.html";
    }

 
}

function editarperfilcad(ED_estilos){
    let GV_objdadosusuario = lerdadosevento();
    // Coletar valores dos inputs
    var  ED_username = document.getElementById('username').value;
    var  ED_senha = document.getElementById('senha_criar').value;
    var  ED_email = document.getElementById('email').value;
    var  ED_foto_perfil = document.getElementById('foto_perfil2').value;
    var  ED_precoMedio = document.getElementById('preco-médio-usuario').value;
    var gostosSelect = document.getElementById('gostos');
    var ED_gostos = ED_estilos;
    //var ED_gostos = Array.from(gostosSelect.selectedOptions).map(option => option.value);
    var ED_moeda = document.querySelector('.form-select').value;
    
    //variavel para saber se esta logado
    var ED_logado = false;


    //variavel para validação
    var ED_username_conf = false, ED_senha_conf = false, ED_preco_conf = false;

    //validação do username
    if(ED_username.length < 5){
        alert('ERRO: username deve ter mais que 5 caracteres');
    }
    else{
        ED_username_conf= true;
    }
    
    //validação da senha
    if(ED_senha.length < 5){
        alert('ERRO: senha deve ter mais que 5 caracteres');
    }
    else{
        ED_senha_conf = true;
    }

    //validação preco
    if(ED_precoMedio < 10){
        alert('ERRO: valor muito baixo');
    }
    else{
        ED_preco_conf = true;
    }


    if(ED_username_conf && ED_senha_conf && ED_preco_conf){
         // Criar objeto usuário
        const usuario = {};
        usuario.usuario = {
            username: ED_username,
            senha: ED_senha,
            email: ED_email,
            foto_perfil: ED_foto_perfil,
            id: GV_objdadosusuario.usuario.id,
            precoMedio: ED_precoMedio,
            gostos: ED_gostos,
            moeda: ED_moeda,
            favoritos: GV_objdadosusuario.usuario.favoritos,
            visualizou: GV_objdadosusuario.usuario.visualizou,
        };

        
    // Armazenar objeto usuário no localStorage
    GV_modificardadosdousuarioatual(usuario);
    //localStorage.setItem('usuario', JSON.stringify(usuario));
    ED_logado = true;
    sessionStorage.setItem("logado", ED_logado);

    // Exibir mensagem de sucesso 
    alert('Usuário cadastrado com sucesso!');
    }
    else{
        location.href = "cadastrar.html";
    }
}


async function codigopaginadelogin(){
    const GV_formulariodeloginusuario = document.getElementById('GV_formulariodeloginentrar');

    try{
        GV_formulariodeloginusuario.addEventListener('submit', async realizarlogin => {
            realizarlogin.preventDefault();
            await logar(GV_bd_STS);
        })
    }catch(err){
        alert("Houve problemas de requisição")
        console.log(err)
    };
}


async function logar (){
    try{
        const GV_objetoJS = {
            listadeusuarios: await fetchurlsget(url2),
        }
        var login = document.getElementById('login').value;
        var senha = document.getElementById('senha').value;
        var ED_logado = false;
        // Recupera o objeto do localStorage
        //var objetoArmazenado = localStorage.getItem('bd_ShowTimeSeeker');

        // Converte o objeto de volta para um objeto 
        //let GV_objetoJS = JSON.parse(objetoArmazenado); 
        
        
        let GV_contadorusuario = -1;
        let GV_acheiousuario = false; 
        do
        {
            GV_contadorusuario = GV_contadorusuario + 1;
            GV_acheiousuario = (GV_objetoJS.listadeusuarios[GV_contadorusuario].username == login && GV_objetoJS.listadeusuarios[GV_contadorusuario].senha == senha);
        }
        while(GV_contadorusuario < GV_objetoJS.listadeusuarios.length - 1 && !GV_acheiousuario);

        
        //armazenar os valores das classes em uma variavel
        //var ED_senha_correta = objetoJS.senha;
        //var ED_usuario_correto = objetoJS.username; 
        if(GV_acheiousuario){
            var objetoJS ={};
            objetoJS.usuario = GV_objetoJS.listadeusuarios[GV_contadorusuario];
            alert('Bem vindo!');
            //GV_objetoJS.usuario = objetoJS;
            salvardadosusuario(objetoJS);
            location.href = "index.html";
            ED_logado = true;
            sessionStorage.setItem("logado", ED_logado);
        }
        else{
            alert('Usuario ou senha incorretos');
            ED_logado = false;
            sessionStorage.setItem("logado", ED_logado);
            //location.href = "entrar.html";
        }
    }catch(err){
        alert("Houve problemas de requisição");
        console.log(err)
    }
}


function criarElementoComentario(comentarioObj) {
    let divComentario = document.createElement('div');
    divComentario.classList.add('comentario');

    let nomeUsuario = document.createElement('span');
    nomeUsuario.classList.add('usuario-comentario');
    nomeUsuario.textContent = comentarioObj.usuario.username + ': '; // Nome do usuário que comentou

    let textoComentario = document.createElement('span');
    textoComentario.textContent = comentarioObj.texto; // Texto do comentário

    divComentario.appendChild(nomeUsuario);
    divComentario.appendChild(textoComentario);

    return divComentario;
}


async function GV_updateeventopage(){
    try{
        const urlparams = new URLSearchParams(window.location.search);
        const GV_idurl = parseInt(urlparams.get('id'));
        let GV_objeventodapagina = await fetchurlsget(`${url1}?id=${GV_idurl}`);
        GV_objeventodapagina = GV_objeventodapagina[0]
        let favoritadosElem = document.getElementById('favoritados');
        let divcomentariosevento = document.getElementById('comentados');
        favoritadosElem.textContent = GV_objeventodapagina.favoritos;
        divcomentariosevento.innerHTML = '';
    
        // Adicionar divs para cada comentário
        GV_objeventodapagina.comentarios.forEach(comentario => {
            let divComentario = criarElementoComentario(comentario);
            divcomentariosevento.insertBefore(divComentario, divcomentariosevento.firstChild);
        });
        //paginadoevento(GV_bd_STS, GV_bd_STS.evento.find((elemento)=>elemento.id == GV_idurl));
    }catch(err){
        alert("Houve problemas de requisição" + err)
    };
}

async function GV_updatevisueventopage(){
    try{
        const urlparams = new URLSearchParams(window.location.search);
        const GV_idurl = parseInt(urlparams.get('id'));
        let GV_enventoatual = await fetchurlsget(`${url1}?id=${GV_idurl}`);
        GV_enventoatual = GV_enventoatual[0];
        let visualizacoesTotaisElem = document.getElementById('visualizacoesTotais');
        visualizacoesTotaisElem.textContent = GV_enventoatual.visualizacoes.total;
    }catch(err){
        alert("Houve problemas de requisição")
    };
}

//function paginadoevento(objeto_evento, objdoevento) {
async function paginadoevento() {
    const urlparams = new URLSearchParams(window.location.search);
    const GV_idurl = parseInt(urlparams.get('id'));
    let objdoevento = await fetchurlsget(`${url1}?id=${GV_idurl}`);
    objdoevento = objdoevento[0]
    // Elementos do DOM que serão preenchidos dinamicamente
    let nomeEventoElem = document.getElementById('nomeEvento');
    let localEventoElem = document.getElementById('localEvento');
    let dataEventoElem = document.getElementById('dataEvento');
    let horaEventoElem = document.getElementById('horaEvento');
    let descricaoEventoElem = document.getElementById('descricaoEvento');
    let favoritadosElem = document.getElementById('favoritados');
    let visualizacoesTotaisElem = document.getElementById('visualizacoesTotais');
    let carouselInner = document.getElementById('carouselInner');
    let divcomentariosevento = document.getElementById('comentados');
    let botaoDeContato = document.getElementById('botao_de_contato'); 
    let botaoDefav = document.getElementById('botaoFavoritar');
    let GV_dataehorapaginaindividual = GV_converterdata(objdoevento.data);
    
    //botão para favoritar
    botaoDefav.addEventListener('click', function() {
        //objeto_evento = favoritar(objeto_evento, objdoevento);
        favoritar(objdoevento);
        //salvardadosusuario(objeto_evento);
        //location.reload();
    });
    
    //objeto_evento = ED_vusualizacao(objeto_evento, objdoevento);
    ED_vusualizacao(objdoevento);

    // Função para criar elementos de comentário


    // Preencher o carrossel com as fotos do evento
    objdoevento.fotos.forEach((foto, index) => {
        let carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
            carouselItem.classList.add('active');
        }

        let img = document.createElement('img');
        img.src = foto;
        img.classList.add('d-block', 'w-100');
        img.alt = `Imagem ${index + 1}`;

        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
    });

    // Preencher as informações do evento
    nomeEventoElem.textContent = objdoevento.nome_do_evento;
    localEventoElem.textContent = objdoevento.local;
    dataEventoElem.textContent = GV_dataehorapaginaindividual[0];
    horaEventoElem.textContent = GV_dataehorapaginaindividual[1];
    descricaoEventoElem.innerHTML = objdoevento.descricao.replace('\n', '</br>');
    favoritadosElem.textContent = objdoevento.favoritos;
    visualizacoesTotaisElem.textContent = objdoevento.visualizacoes.total;

    // Limpar a div de comentários antes de adicionar novamente
    divcomentariosevento.innerHTML = '';
    
    // Adicionar divs para cada comentário
    objdoevento.comentarios.forEach(comentario => {
        let divComentario = criarElementoComentario(comentario);
        divcomentariosevento.insertBefore(divComentario, divcomentariosevento.firstChild);
    });

    // Adicionar evento para o botão de comentar
    let botaoComentar = document.getElementById('botaoComentar');
    botaoComentar.addEventListener('click', function() {
        let comentarioTexto = document.getElementById('areaComentarios').value.trim();
        let GV_usuariobd = lerdadosusuario();
        if (comentarioTexto !== '') {
            let novoComentario = {
                texto: comentarioTexto,
                usuario: {
                    username: GV_usuariobd.usuario.username // Nome de usuário que está comentando
                }
            };
            objdoevento.comentarios.push(novoComentario);
            // Limpar o campo de comentário
            document.getElementById('areaComentarios').value = '';
            // Salvar de volta no Local Storage
            //salvardadosusuario(objeto_evento);
            // Atualizar a exibição dos comentários
            /*divcomentariosevento.innerHTML = '';
            objdoevento.comentarios.forEach(comentario => {
                let divComentario = criarElementoComentario(comentario);
                divcomentariosevento.appendChild(divComentario);
            });*/
            fetchput(url1+`/${objdoevento.id}`, objdoevento, "0", ()=>{GV_updateeventopage()});
        }
    }); 
    //botão para ir para o contato do evento
    botaoDeContato.addEventListener('click', function() {
        botaoDeContato.href = objdoevento.linkcontato;
    });

}


function ED_vusualizacao(objdoevento) {
    let usuariovizu = lerdadosusuario();
    //console.log(indexusuariovizu);
    let nomeDoEvento = objdoevento.id;
    let visualizacoesUsuario = usuariovizu.usuario.visualizou;
    let ED_gostosusuario = usuariovizu.usuario.gostos;
    let ED_gostosusuarioTam = usuariovizu.usuario.gostos.length;
    //let listaletvisualizacoesUsuario = objeto_evento.listadeusuarios[indexusuariovizu].visualizou;
    
    // Verificar se o evento já foi visualizado pelo usuário
    if (!visualizacoesUsuario.includes(nomeDoEvento)) {
        visualizacoesUsuario.push(nomeDoEvento); // Registrar que o evento foi visualizado
        //listaletvisualizacoesUsuario.push(nomeDoEvento);

        // Verificar se objeto_evento.evento existe
        if (objdoevento) {
            // Verificar se objeto_evento.evento.visualizacoes existe e tem a propriedade total
            if (objdoevento.visualizacoes && objdoevento.visualizacoes.total !== undefined) {
                objdoevento.visualizacoes.total++; // Incrementar o contador de visualizações totais
                for(let i = 0; i<ED_gostosusuarioTam; i++){
                    if(ED_gostosusuario[i] == 1){
                        objdoevento.visualizacoes.gosto1++;
                    }
                    if(ED_gostosusuario[i] == 2){
                        objdoevento.visualizacoes.gosto2++;
                    }
                    if(ED_gostosusuario[i] == 3){
                        objdoevento.visualizacoes.gosto3++;
                    }
                    if(ED_gostosusuario[i] == 4){
                        objdoevento.visualizacoes.gosto4++;
                    }
                    if(ED_gostosusuario[i] == 5){
                        objdoevento.visualizacoes.gosto5++;
                    }
                    if(ED_gostosusuario[i] == 6){
                        objdoevento.visualizacoes.gosto6++;
                    }
                    if(ED_gostosusuario[i] == 7){
                        objdoevento.visualizacoes.gosto7++;
                    }
                    if(ED_gostosusuario[i] == 8){
                        objdoevento.visualizacoes.gosto8++;
                    }
                    if(ED_gostosusuario[i] == 9){
                        objdoevento.visualizacoes.gosto9++;
                    }
                    if(ED_gostosusuario[i] == 10){
                        objdoevento.visualizacoes.gosto10++;
                    }
                    if(ED_gostosusuario[i] == 11){
                        objdoevento.visualizacoes.gosto11++;
                    }
                    if(ED_gostosusuario[i] == 12){
                        objdoevento.visualizacoes.gosto12++;
                    }
                }
            } else {
                console.error(`Propriedade 'visualizacoes' ou 'total' não está definida em objeto_evento.evento[${objdoevento}]`);
            }
        } else {
            console.error(`Evento com índice ${objdoevento} não está definido em objeto_evento.evento`);
        }
    }
    salvardadosusuario(usuariovizu);
    fetchput(url2+`/${usuariovizu.usuario.id}`, usuariovizu.usuario, "0", ()=>{GV_updatevisueventopage()});
    fetchput(url1+`/${objdoevento.id}`, objdoevento, "0", ()=>{GV_updatevisueventopage()});
    //return objeto_evento;
}
//salvar na lista de usuarios


function indexdousuario(ID_usuario, objeto_evento){
   let tamanholista = objeto_evento.listadeusuarios.length;
   let i = 0;
   while(i<tamanholista){
    if( objeto_evento.listadeusuarios[i].id === ID_usuario){
        return i;
    }
    i++;
   }
}
function favoritar(objdoevento) {
    // Encontrar o índice do usuário com base no ID
    let usuariofav = lerdadosusuario();

    if (usuariofav === -1) {
        console.error(`Usuário com ID ${usuariofav.usuario.id} não encontrado na lista de usuários`);
        //return objeto_evento;
    }

    let nomeDoEvento = objdoevento.id;
    //let listaFavoritosUsuario = objeto_evento.listadeusuarios[indexusuariofav].favoritos;
    let favoritousuario = usuariofav.usuario.favoritos;

    // Verificar se o evento já está nos favoritos do usuário
    if (!favoritousuario.includes(nomeDoEvento)) {
        //listaFavoritosUsuario.push(nomeDoEvento); 
        favoritousuario.push(nomeDoEvento);

        // Verificar se objeto_evento.evento existe
        if (objdoevento) {
            // Incrementar o contador de favoritos se a propriedade existir
            if (objdoevento.favoritos !== undefined) {
                objdoevento.favoritos++;
            } else {
                // Se 'favoritos' não estiver definido, inicializá-lo com 1
                objdoevento.favoritos = 1;
            }
        } else {
            console.error(`Evento com índice ${indexdoevento} não está definido em objeto_evento.evento`);
        }

        // Salvar as alterações no Local Storage ou no servidor
        salvardadosusuario(usuariofav);
        fetchput(url2+`/${usuariofav.usuario.id}`, usuariofav.usuario);
        fetchput(url1+`/${objdoevento.id}`, objdoevento, "0", ()=>{GV_updateeventopage()});
        console.log(`Evento '${nomeDoEvento}' adicionado aos favoritos do usuário`);
    } else {
        console.log(`Evento '${nomeDoEvento}' já está nos favoritos do usuário`);
    }

    //return objeto_evento;
}

