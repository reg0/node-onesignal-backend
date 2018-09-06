const OneSignalRequest = require('./OneSignalRequest').OneSignalRequest;

function sendNotification(title, text, usernames, additionalData) {
    return new OneSignalRequest()
        .withApiKey(require('./OneSignalRequest').API_KEY)
        .withAppId(require('./OneSignalRequest').APP_ID)
        .withRecipients(usernames)
        .withAdditionalData(additionalData)
        .send(title, text)
        .then(result => {
            const {usernamesUsed} = result;
            const usernamesString = `${usernamesUsed.slice(0, Math.min(5, usernamesUsed.length)).join(', ')}${usernamesUsed.length > 5 ? ` and ${usernamesUsed.length - 5} more` : '' }`;
            console.log(`Notifications sent to ${ usernamesUsed.length } user(s) [${usernamesString}], response:`);
            console.log(result.response);
            return result;
        }).catch(err => {
            console.error("Notifications delivery failed, error:");
            console.error(err);
            throw err;
        });
};

module.exports = {sendNotification};