const { app } = require('@azure/functions');
const { Client, Message } = require('azure-iot-device');
const { Mqtt } = require('azure-iot-device-mqtt');

const connectionString = process.env.IOTHUB_DEVICE_CONNECTION_STRING;
const client = Client.fromConnectionString(connectionString, Mqtt);

app.http('rut955function', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Received request at: ${request.url}`);

        let body;
        try {
            body = await request.json();  // parses JSON body
        } catch (err) {
            return { status: 400, body: 'Invalid JSON body.' };
        }

        const payload = JSON.stringify(body);
        const message = new Message(payload);

        try {
            await client.open();
            await client.sendEvent(message);
            context.log('Message sent to IoT Hub:', payload);
            return { status: 200, body: 'Data forwarded to IoT Hub.' };
        } catch (err) {
            context.log.error('Error sending to IoT Hub:', err);
            return { status: 500, body: 'Failed to forward data to IoT Hub.' };
        } finally {
            await client.close();
        }
    }
});
