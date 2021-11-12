const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
app.all('*',(req, res,next) => {
    // res.send("check if is connect");
    next();
})
app.get('/', (req, res) => {

    res.json({"url":"home.html"});
});

app.post('/category', (req, res) => {

    res.json({"url":"category.html"});
});

app.put('/product', (req, res) => {
    res.json({"url":"product.html"});
});
app.all('*',(req, res) => {
    res.send("404");
})
app.listen(port);
console.log(`Listening on port ${port}`);