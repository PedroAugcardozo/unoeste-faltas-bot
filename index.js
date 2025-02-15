const puppeteer = require('puppeteer')
const readLineSync = require('readline-sync')
require('dotenv').config();


//? quando está pronto
//! quando pode ser que tenha uma alteração no futuro

async function Robo() {
    //? - abre a pagina do aprender
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    })
    const page = await browser.newPage();
    const url = `https://www.unoeste.br/site/ava/`
    await page.goto(url)
    console.log('abriu o navegador')

    //? - pega o RA e a senha do usuario
    const RA = process.env.RA_KEY
    const Senha = process.env.PASS

    //? - digita e cadastra o RA e a senha do usuario e entra no aprender 
    await page.type('[name="tbLogin"]', RA)
    await page.type('[name="tbSenha"]', Senha)
    await page.click('[type="submit"]')
    console.log('aprender acessado')

    //? - entra na area do aluno
    await page.waitForSelector('.infacad')
    await page.click('.infacad')
    console.log('area do aluno acessada')

    //? - entra na pagina de faltas e notas
    await page.waitForSelector('[href="https://www.unoeste.br/site/consnota/aluno/ConsultaNota.aspx"]')
    await page.click('[href="https://www.unoeste.br/site/consnota/aluno/ConsultaNota.aspx"]')

    //? - entra em faltas
    await page.waitForSelector('[data-index="1"]')
    await page.click('[data-index="1"]')
    console.log('area de faltas acessada')

    //!pega as materias

    await page.waitForSelector('table', { timeout: 5000 }); // Espera até 5 segundos

    let dados = await page.$$eval('table tr', linhas => {
        return linhas.map(linha => {
            const materia = linha.getAttribute('data-disnome')?.trim();
            if (!materia) return null; // Ignora linhas sem nome de disciplina
    
            const getSpanText = idPrefix =>
                linha.querySelector(`span[id^="${idPrefix}"]`)?.innerText.trim() || '0';
    
            const presencialNum = parseInt(getSpanText('ContentPlaceHolder_gyFaltas_lbPresencial_'), 10);
            const naoPresencialNum = parseInt(getSpanText('ContentPlaceHolder_gyFaltas_lbNPresencial_'), 10);
            const chPrevistaNum = parseInt(getSpanText('ContentPlaceHolder_gvFaltas_lbChPrevista_'), 10);
    
            if (chPrevistaNum === 0) return null; // Remove disciplinas sem carga horária prevista
    
            const totalFaltas = presencialNum + naoPresencialNum;
            const percFaltas = chPrevistaNum > 0 ? ((totalFaltas / chPrevistaNum) * 100).toFixed(2) + "%" : "0%";
            //calcula quantas faltas ainda tenho
            const faltasPermitidas = (chPrevistaNum * 25) / 100
            const horasDeFalta = presencialNum + naoPresencialNum
            const horasRestantes = faltasPermitidas - horasDeFalta
            const blocosRestantes = horasRestantes / 1.5
    
            return{ 
                    disciplina: materia,
                    perc_faltas: percFaltas,
                    cargaHoraria: chPrevistaNum, 
                    FaltasPermitidas: blocosRestantes 
                };
        }).filter(Boolean); // Remove elementos nulos
    });
    
    
    // Convertendo os dados filtrados de volta para um array
    dados = Array.from(dados.values());
    console.log(dados)
    browser.close()

    //! vou tentar usar isso aqui para mandar os dados para o front-end
    return dados;
}
Robo()

module.exports = Robo;