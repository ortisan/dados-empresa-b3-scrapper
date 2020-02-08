const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

function obter_dados_empresa(url) {
    return rp(url)
    .then(html => {
        var $ = cheerio.load(html);
        var tabela_empresas = $("#ctl00_contentPlaceHolderConteudo_BuscaNomeEmpresa1_grdEmpresa_ctl01");
        let json_empresas = []; 
        $(".GridRow_SiteBmfBovespa", tabela_empresas).each(function (i, element) {
            console.log("Empresa:" + $(element).text().trim());
            console.log("Link: " + $('a', element).attr('href'));
            let link_empresa = "http://bvmf.bmfbovespa.com.br/cias-listadas/empresas-listadas/" + $('a', element).attr('href');            
            json_empresas[$(element).text().trim()] = link_empresa             
        });
        return json_empresas;
    })
    .catch(err => {
        console.error(err);
    });
}

Promise.all(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Z'].map(letra => {
    const url = 'http://bvmf.bmfbovespa.com.br/cias-listadas/empresas-listadas/BuscaEmpresaListada.aspx?Letra='+letra+'&idioma=pt-br';
    return obter_dados_empresa(url);
})).then(jsons_empresas => {    
    return jsons_empresas.reduce((acum, json) => {
        return {...acum, ...json}
    });
}).then(json_empresas => {
    fs.writeFile('empresas.json', JSON.stringify(json_empresas), 'utf8', function(err) {
        if (err) throw err;
    });
}).catch(err => {
    console.error("Ocorreu um erro ao fazer o scrap: " + err);
});