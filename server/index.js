const express = require('express')
const next = require('next')
const db = require('../database/index');
const bodyParser = require('body-parser');


const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  server.get('/result/:id', (req, res) => {
    const actualPage = '/result'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
  })

  server.get('/movies', (req, res) => {
    db.read((err, data) => {
      if(err) {
        res.statusMessage = 'Failed to get the movie lists from database';
        return res.status(500).end();
      }
      return res.send(data);
    }) 
  })

  server.post('/movies', (req, res) => {
    db.create(req.body, (err, data) => {
      if(err) {
        res.statusMessage = 'Failed to save the movie to database';
        return res.status(500).end();
      }
      return res.send(data);
    }) 
  })
  
  server.delete('/movies', (req, res) => {
    db.delete(req.body, (err) => {
      if (err) {
        res.statusMessage = 'Failed to delete the movie from database';
        return res.status(500).end();
      }
      return res.sendStatus(200);
    }) 
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})