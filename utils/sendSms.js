const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
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

