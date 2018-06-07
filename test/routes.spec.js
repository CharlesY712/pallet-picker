const chai = require('chai');
const should = chai.should(); // eslint-disable-line
const {
  app,
  database
} = require('../server.js');
const chaiHttp = require('chai-http');

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
    chai.request(app)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body[0].should.have.property('name');
        done();
      });
  });

  it('should GET all the projects', (done) => {
    chai.request(app)
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
    chai.request(app)
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
});