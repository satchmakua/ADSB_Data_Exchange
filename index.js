const express = require('express');
const app = express();
const auth = require('./routes/auth');
const users = require('./routes/users');
const oauth = require('./routes/oauth'); 
const adsb = require('./routes/adsb');
const PORT = 3000; // 443 for HTTPS

app.get('/', (req, res) => 
{ 
    res.status(200).json('you reached the homepage');
});

app.use('/auth', auth);
app.use('/users', users);
app.use('/oauth', oauth); 
app.use('/adsb', adsb);

app.use((req, res, next) =>
{
    res.status(404).send("Could not find resource!");
});


app.listen(PORT, () => {
    console.log(`Listening on port ${ PORT }...`);
    }
)



