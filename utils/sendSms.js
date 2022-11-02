// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console and set the environment variables.
// See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VAc971acd7b16cd91c236afe6dfbb8fdca";
const asyncHandler = require('express-async-handler')
const client = require('twilio')(accountSid, authToken);


exports.sendSms = asyncHandler(async (phoneNumber, message) => {
    await client.messages
        .create({
            body: message,
            to: `+2${phoneNumber}`,
            from: '+12182777930',
        })
})

