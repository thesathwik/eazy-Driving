const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
    console.error('❌ SENDGRID_API_KEY is missing in .env file');
    process.exit(1);
}

console.log(`🔑 Testing SendGrid Key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);

sgMail.setApiKey(apiKey);

const msg = {
    to: process.env.EMAIL_FROM || 'test@example.com', // Send to self for testing
    from: process.env.EMAIL_FROM || 'noreply@eezydriving.com',
    subject: 'SendGrid API Key Test',
    text: 'If you receive this, your SendGrid API key is working correctly!',
    html: '<strong>If you receive this, your SendGrid API key is working correctly!</strong>',
};

(async () => {
    try {
        await sgMail.send(msg);
        console.log('✅ Email sent successfully! Your API key is valid.');
    } catch (error) {
        console.error('❌ Error sending email:');
        console.error(error.toString());
        if (error.response) {
            console.error('Response body:', JSON.stringify(error.response.body, null, 2));
        }
    }
})();
