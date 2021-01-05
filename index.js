import Main from './src/Main.js'
import log from './src/util/Log.js'

log.setLogLevel('VERBOSE'); // Valid log levels: VERBOSE/INFO/WARNING/ERROR/CRITICAL

const main = new Main();
main.start();

process.on('uncaughtException', (err) => main.log.critical('PROCESS', 'An uncaught error occured:', err));