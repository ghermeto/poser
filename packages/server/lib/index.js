
import { start, stop, getServer } from './server.js';


function startGracefulShutdown() {
    const log = getServer().log;
    
    stop()
        .then(() => {
            log.info('Process has been successfully stopped.');
        })
        .catch((err) => {
            log.error(err);
            process.abort();
        });
}

process.on('SIGINT', startGracefulShutdown);
process.on('SIGTERM', startGracefulShutdown);

await start();