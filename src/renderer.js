const { ipcRenderer } = require('electron');

document.getElementById('scrapeBtn').addEventListener('click', async () => {
    const result = await ipcRenderer.invoke('run-scraper');
    document.getElementById('result').innerText = `Resultado: ${result}`;
});
