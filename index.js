import Main from './src/Main.js'

const main = new Main();
main.start();

process.on('uncaughtException', (err) => main.log.critical('PROCESS', 'An uncaught error occured:', err));