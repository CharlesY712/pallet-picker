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
    .then((projects) => {
      return response.status(200).json(projects);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
});

app.get('/api/v1/pallets', (request, response) => {
  database('pallets').select()
    .then((pallets) => {
      return response.status(200).json(pallets);
    })
    .catch((err) => {
      return response.status(500).json(err);
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response.status(422).json({error: `You are missing a ${requiredParameter}`});
    }
  }

  database('projects').insert(project, 'name')
    .then(projectName => {
      return response.status(201).json({success: `Successfully added ${projectName} to photos database.`});
    })
    .catch(err => {
      return response.status(500).json(err);
    });
});

app.post('/api/v1/pallets', (request, response) => {
  const pallet = request.body;

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'pallet_id']) {
    if (!pallet[requiredParameter]) {
      return response.status(422).json({error: `You are missing a ${requiredParameter}`});
    }
  }

  database('pallets').insert(pallet, 'name')
    .then(palletName => {
      return response.status(201).json({success: `Successfully added ${palletName} to photos database.`});
    })
    .catch(err => {
      return response.status(500).json(err);
    });
});

app.delete('/api/v1/pallet/:id', (request, response) => {
  database('pallets').where('id', request.params.id).del()
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