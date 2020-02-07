const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const rx = require('rxjs');

async function obter_dados_empresa(url) {
    return await rp(url)
    .then(html => {
        var $ = cheerio.load(html);
        var tabela_empresas = $("#ctl00_contentPlaceHolderConteudo_BuscaNomeEmpresa1_grdEmpresa_ctl01");
        $(".GridRow_SiteBmfBovespa", tabela_empresas).each(function (i, element) {
            console.log("Empresa:" + $(element).text().trim());
            console.log("Link: " + $('a', element).attr('href'));
            let link_empresa = "http://bvmf.bmfbovespa.com.br/cias-listadas/empresas-listadas/" + $('a', element).attr('href');
            json_empresas[$(element).text().trim()] = link_empresa;
        });
    })
    .catch(err => {
        console.error(err);
    });
}

function next_letra(letra) {
    console.log(letra);
    const url = 'http://bvmf.bmfbovespa.com.br/cias-listadas/empresas-listadas/BuscaEmpresaListada.aspx?Letra='+letra+'&idioma=pt-br';
    obter_dados_empresa(url);
}

const arrayLetras = rx.from(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Z']);

var json_empresas = {};

arrayLetras.subscribe({
    next(letra) { 
        next_letra(letra);
    },
    error(err) {
        console.error('Ocorreu um erro: ' + err); 
    },
    complete() { 
        console.log("Completo.");
        fs.writeFile('empresas.json', JSON.stringify(json_empresas), 'utf8', function(err) {
            if (err) throw err;
        });
    }
});