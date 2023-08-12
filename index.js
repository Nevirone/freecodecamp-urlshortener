require('dotenv').config();
const express = require('express');
const cors = require('cors');
const URL = require('url').URL

const connectMongo = require('./src/services/connectMongo')
const UrlShort = require('./src/models/UrlShort')

connectMongo()
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

function validateUrl(urlString) {
  try {
    new URL(urlString)
    return true
  } catch {
    return false
  }
} 

app.post('/api/shorturl', async (req, res) => {
  if(!req.body.url)
    return res.status(400).send({ error: 'invalid url' })

  if(!validateUrl(req.body.url))
    return res.status(400).json({ error: 'invalid url'})

  const urlShort = UrlShort({ original: req.body.url })

  try {

    await urlShort.save()
    
    res.json({ original_url: urlShort.original, short_url: urlShort.short })
  }
  catch(err) {
    res.status(500).send()
    console.error(err)
  }
})

app.get('/api/shorturl/:id', async (req, res) => {
  const shortUrl = await UrlShort.find({ short: req.params.id })
  if(!shortUrl)
    return res.status(404).send({ error: 'Short url not found' })

  res.json({ original_url: shortUrl.original, short_url: shortUrl.short })
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
