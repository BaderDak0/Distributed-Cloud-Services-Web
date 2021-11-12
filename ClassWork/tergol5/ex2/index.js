const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.post('/savemusic', (req, res) => {

    res.json({"success":1});
});