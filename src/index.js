const { Client, Message } = require('azure-iot-device');
const { Mqtt } = require('azure-iot-device-mqtt');

const connectionString = process.env.IOTHUB_DEVICE_CONNECTION_STRING;
const client = Client.fromConnectionString(connectionString, Mqtt);

module.exports = async function (context, req) {
    context.log('HTTP trigger function received a request.');

    if (!req.body) {
        context.res = {
            status: 400,
            body: "No data provided in the request body."
        };
        return;
    }

    const payload = JSON.stringify(req.body);
    const message = new Message(payload);

    try {
        await client.open();
        await client.sendEvent(message);
        context.log('Message sent to IoT Hub:', payload);

        context.res = {
            status: 200,
            body: "Data forwarded to IoT Hub."
        };
    } catch (err) {
        context.log.error('Error sending to IoT Hub:', err);
        context.res = {
            status: 500,
            body: "Failed to forward data to IoT Hub."
        };
    } finally {
        await client.close();
    }
};
