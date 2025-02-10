const puppeteer = require('puppeteer')
const readLineSync = require('readline-sync')
require('dotenv').config();

async function Robo() {
    // - abre a pagina do aprender
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    })
    const page = await browser.newPage();
    const url = `https://www.unoeste.br/site/ava/`
    await page.goto(url)

    // - pega o RA e a senha do usuario
    const RA = process.env.RA_KEY
    const Senha = process.env.PASS

    // - digita e cadastra o RA e a senha do usuario e entra no aprender 
    await page.type('[name="tbLogin"]', RA)
    await page.type('[name="tbSenha"]', Senha)
    await page.click('[type="submit"]')
    console.log('aprender acessado')

    // - entra na area do aluno
    await page.waitForSelector('.infacad')
    await page.click('.infacad')

    // - entra na pagina de faltas e notas
    await page.waitForSelector('[href="https://www.unoeste.br/site/consnota/aluno/ConsultaNota.aspx"]')
    await page.click('[href="https://www.unoeste.br/site/consnota/aluno/ConsultaNota.aspx"]')

    // - entra em faltas
    await page.waitForSelector('.linkNoHT')
    await page.click('.linkNoHT')

}
Robo()