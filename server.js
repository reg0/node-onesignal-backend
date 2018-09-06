const express = require('express');
const app = express();

// respond with "hello world" when a GET request is made to the /health endpoint
app.get('/health', (req, res) => {
    res.send('hello world');
});

app.get('/testPush', (req, res) => {
    require('./pushnotifications.util').sendNotification("Title test", "Text test", ["username1", "username2"]).then(result => {       
        res.send(result); 
    });
});

app.listen(process.env.PORT ? process.env.PORT : 3000, () => console.log('Example app listening on port 3000!'));