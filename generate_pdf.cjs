const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const htmlPath = path.join(__dirname, 'tcc_documentacao.html');
const pdfPath = path.join(__dirname, 'tcc_documentacao.pdf');

// Caminhos comuns do Google Chrome no Windows
const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
];

let chromeExe = null;
for (const p of chromePaths) {
  if (fs.existsSync(p)) {
    chromeExe = p;
    break;
  }
}

if (!chromeExe) {
  console.error('Erro: Google Chrome não foi encontrado nos caminhos padrão.');
  console.log('Por favor, abra o arquivo "tcc_documentacao.html" no seu navegador e imprima como PDF manualmente.');
  process.exit(1);
}

console.log(`Google Chrome encontrado em: ${chromeExe}`);
console.log('Gerando PDF. Por favor, aguarde...');

// Comando do Chrome Headless para imprimir em PDF
const command = `"${chromeExe}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao gerar o PDF: ${error.message}`);
    return;
  }
  
  if (fs.existsSync(pdfPath)) {
    console.log('--------------------------------------------------');
    console.log('PDF Gerado com Sucesso!');
    console.log(`Arquivo criado em: ${pdfPath}`);
    console.log('--------------------------------------------------');
  } else {
    console.error('Erro: O arquivo PDF não foi criado.');
  }
});
