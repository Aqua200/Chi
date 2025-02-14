console.log('Iniciando 🚀🚀🚀'); 
import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import cfonts from 'cfonts';
import { createInterface } from 'readline';
import yargs from 'yargs';
import chalk from 'chalk';
import os from 'os';
import { promises as fsPromises } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url); 
const { name, author } = require(join(__dirname, './package.json')); 
const { say } = cfonts;
const rl = createInterface(process.stdin, process.stdout);

say('China-Mitzuki-Bot-MD', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta']
});
say(`Bot personalizado`, {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta']
});

var isRunning = false;

async function start(file) {
  if (isRunning) return;
  isRunning = true;

  let args = [join(__dirname, file), ...process.argv.slice(2)];

  say([process.argv[0], ...args].join(' '), {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
  });

  let p = fork(args[0], args.slice(1));

  p.on('message', (data) => {
    console.log('╭--------- - - - ✓\n┆ ✅ TIEMPO DE ACTIVIDAD ACTUALIZADA\n╰-------------------- - - -', data);
    switch (data) {
      case 'reset':
        p.kill();
        isRunning = false;
        start(file);
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
    }
  });

  p.on('exit', (code) => {
    isRunning = false;
    console.error('⚠️ ERROR ⚠️ >> ', code);
    if (code !== 0) start('main.js');
  });

  watchFile(args[0], () => {
    unwatchFile(args[0]);
    start(file);
  });

  const ramInGB = os.totalmem() / (1024 * 1024 * 1024);
  const freeRamInGB = os.freemem() / (1024 * 1024 * 1024);
  
  try {
    const packageJsonData = await fsPromises.readFile(join(__dirname, './package.json'), 'utf-8');
    const packageJsonObj = JSON.parse(packageJsonData);
    const currentTime = new Date().toLocaleString();

    console.log(chalk.yellow(`
╭──────────────
┊ 🖥️ ${os.type()}, ${os.release()} - ${os.arch()}
┊ 💾 RAM Total: ${ramInGB.toFixed(2)} GB
┊ 💽 RAM Libre: ${freeRamInGB.toFixed(2)} GB
┊ 🟢 Información:
┊ 💚 Nombre: ${packageJsonObj.name}
┊ 𓃠 Versión: ${packageJsonObj.version}
┊ 💜 Descripción: ${packageJsonObj.description}
┊ 💕 Dueña : 𝕮𝖍𝖎𝖓𝖆 𝕸𝖎𝖙𝖟𝖚𝖐𝖎 💋
┊ ღ Autor del proyecto: ${packageJsonObj.author.name}
┊ ⏰ Hora Actual: ${currentTime}
╰──────────────`));

    setInterval(() => {}, 1000);
  } catch (err) {
    console.error(chalk.red(`❌ No se pudo leer el archivo package.json: ${err}`));
  }

  let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
  if (!opts['test']) {
    if (!rl.listenerCount('line')) {
      rl.on('line', line => {
        p.emit('message', line.trim());
      });
    }
  }
}

start('main.js');
