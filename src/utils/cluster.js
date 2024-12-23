const cluster = require('cluster');
const os = require('os');
module.exports = function (callback, enabled = true) {
    if (enabled) {
        if (cluster.isMaster) {
            const numCPUs = os.cpus().length;
            console.log(`Master ${process.pid} is running`);
            // Crear un worker por cada CPU
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
            // Reiniciar worker si falla
            cluster.on('exit', (worker, code, signal) => {
                console.log(`Worker ${worker.process.pid} died. Restarting...`);
                cluster.fork();
            });
        } else {
            callback();
        }
    } else {
        callback();
    }
}