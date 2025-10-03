const express = require('express');
const app = express();
__path = process.cwd()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
let code = require('../index'); 

require('events').EventEmitter.defaultMaxListeners = 500;

app.use('/code', code);
app.use('/pair', async (req, res, next) => {
    res.sendFile(__path + '/lib/pair.html')
});
app.use('/', async (req, res, next) => {
    res.sendFile(__path + '/lib/main.html')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`
𝘝𝘈𝘑𝘐𝘙𝘈 𝘔𝘐𝘕𝘐 𝘔𝘋 𝘉𝘠 𝘝𝘢𝘫𝘪𝘳𝘢𝘖𝘧𝘧𝘪𝘤𝘪𝘢𝘭

Server running on http://localhost:` + PORT)
});

module.exports = app;
