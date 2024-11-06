const puppeteer = require('puppeteer')
const readLineSync = require('readline-sync')
require('dotenv').config();

async function Robo() {
    // - abre a pagina do aprender
    const browser = await puppeteer.launch({headless: false})
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
}

Robo()