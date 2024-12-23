const net = require('net');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class CommClient {
    constructor() {
        this.client = new net.Socket();
        this.eventListeners = {};
        this.pendingRequests = {};
        this.clientId = uuidv4();
        this.name = null;
        this.messageBuffer = '';
        this.acknowledged = new Set(); // Mensajes ACK recibidos
    }

    static getInstance() {
        if (!CommClient.instance) {
            CommClient.instance = new CommClient();
        }
        return CommClient.instance;
    }

    connect(host, port, name) {
        this.name = name;
        return new Promise((resolve, reject) => {
            this.client.connect(port, host, () => {
                console.log(`Conectado al servidor en ${host}:${port}`);
                this.register();
                resolve();
            });

            this.client.on('data', (data) => {
                this.handleData(data);
            });

            this.client.on('error', (error) => {
                console.error(`Error de conexión: ${error.message}`);
                reject(error);
            });

            this.client.on('end', () => {
                console.log('Desconectado del servidor');
            });
        });
    }

    register() {
        const message = this.createMessage({
            type: 'register',
            name: this.name
        });
        this.client.write(message);
    }

    on(eventType, callback) {
        if (!this.eventListeners[eventType]) {
            this.eventListeners[eventType] = [];
        }
        this.eventListeners[eventType].push(callback);
    }

    emit(eventType, data) {
        const listeners = this.eventListeners[eventType];
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }

    handleData(data) {
        this.messageBuffer += data.toString();

        let boundary;
        while ((boundary = this.messageBuffer.indexOf('<END>')) !== -1) {
            const completeMessage = this.messageBuffer.slice(0, boundary);
            this.messageBuffer = this.messageBuffer.slice(boundary + 5);

            try {
                const parsedMessage = JSON.parse(completeMessage);

                if (parsedMessage.type === 'ACK') {
                    this.acknowledged.add(parsedMessage.requestId);
                } else if (parsedMessage.type === 'request') {
                    this.emit('request', parsedMessage);
                    this.sendAck(parsedMessage.requestId);
                } else if (parsedMessage.type === 'response' && this.pendingRequests[parsedMessage.requestId]) {
                    const { resolve } = this.pendingRequests[parsedMessage.requestId];
                    delete this.pendingRequests[parsedMessage.requestId];
                    resolve(parsedMessage.content);
                    this.sendAck(parsedMessage.requestId);
                } else if (parsedMessage.type === 'channel') {
                    this.emit(`channel:${parsedMessage.channel}`, parsedMessage.content);
                }
            } catch (error) {
                console.error(`Error al procesar el mensaje JSON: ${error.message}`);
            }
        }
    }

    sendAck(requestId) {
        const ackMessage = this.createMessage({
            type: 'ACK',
            requestId: requestId
        });
        this.client.write(ackMessage);
    }

    createMessage(header, content = null) {
        const message = { ...header, content };
        return `<START>${JSON.stringify(message)}<END>`;
    }

    sendDirect(toId, data) {
        return new Promise((resolve, reject) => {
            const requestId = uuidv4();

            const message = this.createMessage({
                type: 'direct',
                requestId: requestId,
                from: this.name,
                to: toId
            }, data);

            this.pendingRequests[requestId] = { resolve, reject };

            this.client.write(message);
        });
    }

    subscribe(channel) {
        const message = this.createMessage({
            type: 'subscribe',
            channel: channel,
            from: this.name
        });
        this.client.write(message);
    }

    publish(channel, messageContent) {
        const message = this.createMessage({
            type: 'publish',
            channel: channel,
            from: this.name,
            content: messageContent
        });
        this.client.write(message);
    }

    // Enviar mensaje con archivo adjunto codificado en base64
    sendDirectWithFile(toId, data, filePath) {
        return new Promise((resolve, reject) => {
            const requestId = uuidv4();

            let fileContent = null;
            if (filePath) {
                try {
                    const fileBuffer = fs.readFileSync(filePath);
                    fileContent = fileBuffer.toString('base64');
                } catch (error) {
                    console.error(`Error al leer el archivo: ${error.message}`);
                    reject(error);
                    return;
                }
            }

            const message = this.createMessage({
                type: 'direct',
                requestId: requestId,
                from: this.name,
                to: toId
            }, { ...data, file: fileContent });

            this.pendingRequests[requestId] = { resolve, reject };

            this.client.write(message);
        });
    }
}

module.exports = CommClient.getInstance();