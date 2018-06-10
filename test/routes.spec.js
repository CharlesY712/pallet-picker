const chai = require('chai');
const should = chai.should(); // eslint-disable-line
const chaiHttp = require('chai-http');
const server = require('../server');
const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp);


describe('Endpoint tests', () => {

  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
          .then(() => {
            return database.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  it('should GET all the projects', (done) => {
    chai.request(server)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body[0].should.have.property('name');
        done();
      });
  });

  it('should GET all the pallets', (done) => {
    chai.request(server)
      .get('/api/v1/pallets')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('color1');
        response.body[0].should.have.property('color2');
        response.body[0].should.have.property('color3');
        response.body[0].should.have.property('color4');
        response.body[0].should.have.property('color5');
        response.body[0].should.have.property('pallet_id');
        done();
      });
  });

  it('should POST a project to the db', (done) => {
    chai.request(server)
      .post('/api/v1/projects')
      .send({ name: 'Bar' })
      .end((error, response) => {
        response.should.be.json;
        response.should.have.status(201);
        response.should.be.an('object');
        response.body.should.have.property('success');
        done();
      });
  });

  it('should not POST a project to the db if missing param', (done) => {
    chai.request(server)
      .post('/api/v1/projects')
      .send({ })
      .end((error, response) => {
        response.should.be.json;
        response.should.have.status(422);
        response.should.be.an('object');
        response.body.should.have.property('error');
        done();
      });
  });

  it('should POST a pallet to the db', (done) => {
    chai.request(server)
      .post('/api/v1/pallets')
      .send({ 
        name: 'Third Pallet',
        color1: 'red',
        color2: 'white',
        color3: 'blue',
        color4: 'green',
        color5: 'purple',
        pallet_id: '1'
      })
      .end((error, response) => {
        response.should.be.json;
        response.should.have.status(201);
        response.should.be.an('object');
        response.body.should.have.property('success');
        done();
      });
  });

  it('should not POST a pallet to the db if missing param', (done) => {
    chai.request(server)
      .post('/api/v1/pallets')
      .send({ 
        name: 'Third Pallet',
        color1: 'red',
        color2: 'white',
        color3: 'blue',
        color4: 'green',
        pallet_id: '1'
      })
      .end((error, response) => {
        response.should.be.json;
        response.should.have.status(422);
        response.should.be.an('object');
        response.body.should.have.property('error');
        done();
      });
  });

});