const express = require('express'); // imports the express framework
const app = express(); // declares the express function to variable app


const environment = process.env.NODE_ENV || 'development'; // declares environment or uses dev as default
const configuration = require('./knexfile')[environment]; // imports knex config saves to variable
const database = require('knex')(configuration); // declares variable for knex use with config

const bodyParser = require('body-parser'); // saves body parser as easy to use variable

app.use(express.static('public')); // tells every instance of app to get files from public
app.use(bodyParser.json()); // tells every instance of app to parse the body

app.set('port', process.env.PORT || 3000); // set port based on environment or default 3000

app.locals.title = 'Pallet Picker'; // sets the local title to "Pallet Picker"

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`); // tells server to listen on port and respond
});

app.get('/api/v1/projects', (request, response) => { //path for get request
  database('projects').select() // pick database called projects
    .then((projects) => { // callback
      return response.status(200).json(projects); // return response with status 200 and fetched projects
    })
    .catch((err) => { // catch any error and begin callback
      return response.status(500).json(err); // return response with status 500 and error
    });
});

app.get('/api/v1/pallets', (request, response) => { // path for get request
  database('pallets').select() // pick database called pallets
    .then((pallets) => { // callback
      return response.status(200).json(pallets); // return response with status 200 and fetched pallets
    })
    .catch((err) => { // catch any error and begin callback
      return response.status(500).json(err); // return response with 500 and error
    });
});

app.post('/api/v1/projects', (request, response) => { // path for post request
  const project = request.body; // declares the body of the request as variable named project

  for (let requiredParameter of ['name']) { // defines name as required parameter
    if (!project[requiredParameter]) { // if you DONT have a required parameter
      return response.status(422).json({error: `You are missing a ${requiredParameter}`}); // return status 422 and error with which parameter you are missing
    }
  }

  database('projects').insert(project, 'name') // find db projects, insert project variable, return name
    .then(projectName => { // callback
      return response.status(201).json({success: `Successfully added ${projectName} to photos database.`}); // return status 201 with success message
    })
    .catch(err => { // catch any error and begin callback
      return response.status(500).json(err); //return status 500 with error message
    });
});

app.post('/api/v1/pallets', (request, response) => { // path for post request
  const pallet = request.body; // declares the body of the request as variable named pallet

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'pallet_id']) { // defines these 7 items as required parameters
    if (!pallet[requiredParameter]) { // if you DONT have a required parameter
      return response.status(422).json({error: `You are missing a ${requiredParameter}`}); // return status 422 with error message
    }
  }

  database('pallets').insert(pallet, 'name') // find db pallets, insert pallet variable, return name
    .then(palletName => { // callback
      return response.status(201).json({success: `Successfully added ${palletName} to photos database.`}); //return status 201 with success message
    })
    .catch(err => { // catch any error and begin callback
      return response.status(500).json(err); // return status 500 with error message
    });
});

app.delete('/api/v1/pallets/:id', (request, response) => { // path for delete request 
  database('pallets').where('id', request.params.id).del() // find db called pallet with matching id and delete
    .then(deleteCount => { // callback
      if (deleteCount === 1) { // del returns a delete count, so as long as you deleted one item...
        return response.status(200).json({success: `Photo with an id of ${request.params.id} deleted.`}); // return status 200 with success message
      } else { // if you did anything other than delete one item
        return response.status(404).json({error: `Photo with an id of ${request.params.id} does not exist.`}); // return status 404 with error message
      }
    })
    .catch(err => { // catch any error and begin callback
      return response.status(500).json(err); // return response status 500 with error message
    });
});

module.exports = app;