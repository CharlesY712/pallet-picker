const express = require('express');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Pallet Picker';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((photos) => {
      return response.status(200).json(photos);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
});

app.post('/api/v1/pallet', (request, response) => {
  const pallet = request.body;

  for (let requiredParameter of ['title', 'url']) {
    if (!photo[requiredParameter]) {
      return response.status(422).json({error: `You are missing a ${requiredParameter}`});
    }
  }

  database('pallet').insert(photo, 'title')
    .then(photoTitle => {
      return response.status(201).json({success: `Successfully added ${photoTitle} to photos database.`});
    })
    .catch(err => {
      return response.status(500).json(err);
    });
});



app.delete('/api/v1/photos/:id', (request, response) => {
  database('photos').where('id', request.params.id).del()
    .then(deleteCount => {
      if (deleteCount === 1) {
        return response.status(200).json({success: `Photo with an id of ${request.params.id} deleted.`});
      } else {
        return response.status(404).json({error: `Photo with an id of ${request.params.id} does not exist.`});
      }
    })
    .catch(err => {
      return response.status(500).json(err);
    });
});

module.exports = { app, database };