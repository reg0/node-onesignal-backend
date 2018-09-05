const https = require('https');

class OneSignalRequest {
    withApiKey(apiKey) {
        this.apiKey = apiKey;
        return this;
    }

    withAppId(appId) {
        this.appId = appId;
        return this;
    }

    withAdditionalData(dataObj) {
        this.dataObj = dataObj;
        return this;
    }

    withRecipients(usernames) {
        let filters = [];
        const usernamesUsed = [];
        usernames.forEach(u => {
            let username = u;

            if (filters.length > 199) { // OneSignal limitation: max 200 filter array elements
                throw new Error("Too many usernames passed, it should be no more than 100");
            }

            if (filters.length != 0) {
                filters = filters.concat([{operator: "OR"}]);  
            }
            filters = filters.concat([{
                field: "tag", 
                key: "username", 
                relation: "=", 
                value: username
            }]);
            usernamesUsed.push(username);
        });

        this.filters = filters;
        this.usernamesUsed = usernamesUsed;
        return this;
    }
    
    send(title, text) {
        if (!this.apiKey || !this.appId) {
            throw new Error("OneSignal app_id or API KEY missing in environment.js. Notifications cannot be pushed");
        }

        const headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": `Basic ${this.apiKey}`
        };
        
        const options = {
          host: "onesignal.com",
          port: 443,
          path: "/api/v1/notifications",
          method: "POST",
          headers: headers
        };

        const messageData = { 
            app_id: this.appId,
            headings: {"en": title},
            contents: {"en": text},
            filters: this.filters,
            data: this.dataObj ? this.dataObj : {}
        };
    
        return new Promise((resolve, reject) => {
            const req = https.request(options, res => {  
                res.on('data', resp => {
                    resolve({usernamesUsed: this.usernamesUsed, response: JSON.parse(resp)});
                });
            });
            
            req.on('error', e => {
                reject(e);
            });
            
            req.write(JSON.stringify(messageData));
            req.end();
        });
    }
}

module.exports = {OneSignalRequest};