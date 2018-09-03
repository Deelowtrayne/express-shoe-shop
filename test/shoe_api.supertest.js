const assert = require('assert');
const request = require('supertest');
const base_url = process.env.public_url || 'http://localhost:3000';


describe('GET /api/shoes/all', function() {

    it('Should return success message', () => {
        request(base_url)
            .get('/api/shoes/all')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                assert.equal(response.body.status, 'success')
            });
    });

});

describe('POST /api/shoes/filter', function() {

    it('Should return success message', () => {
        let filterParams = {
            brand: 'Adidas'
        }
        request(base_url)
            .post('/api/shoes/filter')
            .send(filterParams)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert.equal(res.body.status, 'success')
            });
    });

    it('Should return sucess message with an empty array', () => {
        let filterParams = {
            brand: 'Toyota'
        }
        request(base_url)
            .post('/api/shoes/filter')
            .send(filterParams)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert.deepEqual(res.body, {
                    status: 'success',
                    items: []
                })
            });
    });

});

describe('GET /api/shoes/add', function() {

    it('Should return a success message', () => {
        let shoe = {
            brand: 'Lacoste',
            colour: 'Black',
            size: 7,
            price: 1400,
            qty: 10
        }
        request(base_url)
            .post('/api/shoes/add')
            .send(shoe)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                assert.equal(response.body.message, 'shoe added successfully')
            });
    });

    it('Should return an error message if no shoe is provided', () => {
        let shoe = {
            brand: 'Toyota'
        }
        request(base_url)
            .post('/api/shoes/add')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                assert.equal(response.body.status, 'error')
            });
    });

});