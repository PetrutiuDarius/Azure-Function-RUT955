const { DefaultAzureCredential } = require("@azure/identity");
const { Client } = require("azure-iot-device");
const { Mqtt } = require("azure-iot-device-mqtt");
const { Message } = require("azure-iot-device");

module.exports = async function (context, req) {
    context.log("HTTP trigger received data:", req.body);

    const connectionString = process.env.IOTHUB_DEVICE_CONNECTION_STRING;
    const client = Client.fromConnectionString(connectionString, Mqtt);

    const msg = new Message(JSON.stringify(req.body));

    client.open((err) => {
        if (err) {
            context.log("Could not connect: " + err.message);
            context.res = { status: 500, body: err.message };
        } else {
            client.sendEvent(msg, (err) => {
                if (err) {
                    context.log("Send failed: " + err.message);
                    context.res = { status: 500, body: err.message };
                } else {
                    context.log("Message sent");
                    context.res = { status: 200, body: "Success" };
                }
                client.close();
            });
        }
    });
};
