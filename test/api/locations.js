import schema from '../../src/api/locations/locations-schema.json';
import schemaDelete from '../../src/api/delete-schema.json';
import createMoniker from '../utils/createMoniker';

describe('Locations', () => {
    const organizationID = 4;
    let locationID;

    it('should be able to get all locations in an organization', (done) => {
        const apiPromise = gigwalk.locations.getAll({
            query: {
                limit: 2
            }
        });

        apiPromise.then((res) => {
            expect(res.status).to.equal(200);
            expect(res.data).to.have.jsonSchema(schema);
            done();
        }).catch(done);
    });

    it('should be able to get all organization locations in an organization', (done) => {
        const apiPromise = gigwalk.locations.getAllForOrganization({
            organization_id: organizationID,
            query: {
                limit: 2
            }
        });

        apiPromise.then((res) => {
            expect(res.status).to.equal(200);
            expect(res.data).to.have.jsonSchema(schema);
            done();
        }).catch(done);
    });

    it('should be able to create a new location', (done) => {
        const apiPromise = gigwalk.locations.bulkCreate({
            locations: [{
                title: createMoniker(),
                locality: null,
                administrative_area_level_1: null,
                country: null,
                postal_code: null,
                latitude: 0,
                longitude: 0,
                formatted_address: null
            }]
        });

        apiPromise.then((res) => {
            expect(res.status).to.equal(200);
            expect(res.data).to.have.jsonSchema(schema);
            locationID = res.data.data[0].id;
            done();
        }).catch(done);
    });

    it('should be able to get a specific location', (done) => {
        const apiPromise = gigwalk.locations.get({
            location_id: locationID
        });

        apiPromise.then((res) => {
            expect(res.status).to.equal(200);
            expect(res.data).to.have.jsonSchema(schema);
            done();
        }).catch(done);
    });

    it('should be able to get a specific organization location', (done) => {
        const apiPromise = gigwalk.locations.getForOrganization({
            organization_id: organizationID,
            location_id: locationID
        });

        apiPromise.then((res) => {
            expect(res.status).to.equal(200);
            expect(res.data).to.have.jsonSchema(schema);
            done();
        }).catch(done);
    });

    it('should be able to create new organization locations', (done) => {
        const apiPromise = gigwalk.locations.bulkCreateForOrganization({
            organization_id: organizationID,
            locations: [{
                title: createMoniker(),
                locality: null,
                administrative_area_level_1: null,
                country: null,
                postal_code: null,
                latitude: 0,
                longitude: 0,
                formatted_address: null
            }]
        });

        apiPromise.then((res) => {
            expect(res.status).to.equal(200);
            expect(res.data).to.have.jsonSchema(schema);
            done();
        }).catch(done);
    });

    it('should be able to update organization locations', (done) => {
        const apiPromise = gigwalk.locations.bulkUpdateForOrganization({
            organization_id: organizationID,
            locations: [{
                id: locationID,
                title: 'string 2'
            }]
        });

        apiPromise.then((res) => {
            expect(res.status).to.equal(200);
            expect(res.data).to.have.jsonSchema(schema);
            done();
        }).catch(done);
    });

    it('should be able to create organization location', (done) => {
        const apiPromise = gigwalk.locations.createForOrganization({
            organization_id: organizationID,
            title: createMoniker(),
            address: '600 Bryant'
        });

        apiPromise.then((res) => {
            expect(res.status).to.equal(200);
            expect(res.data).to.have.jsonSchema(schema);
            done();
        }).catch(done);
    });

    it('should be able to update organization location', (done) => {
        const apiPromise = gigwalk.locations.updateForOrganization({
            organization_id: organizationID,
            location_id: locationID,
            address: '600 Bryant',
            title: createMoniker()
        });

        apiPromise.then((res) => {
            expect(res.status).to.equal(200);
            expect(res.data).to.have.jsonSchema(schema);
            done();
        }).catch(done);
    });

    it('should be able to delete a specific location', (done) => {
        const apiPromise = gigwalk.locations.deleteForOrganization({
            organization_id: organizationID,
            location_id: locationID
        });

        apiPromise.then((res) => {
            expect(res.status).to.equal(200);
            expect(res.data).to.have.jsonSchema(schemaDelete);
            done();
        }).catch(done);
    });

    it.skip('should be able to create a location list', (done) => {
        const apiPromise = gigwalk.locations.createListForOrganization({
            organization_id: organizationID,
            subscription_id: 1
        });

        apiPromise.then((res) => {
            expect(res.status).to.equal(200);
            expect(res.data).to.have.jsonSchema(schema);
            done();
        }).catch(done);
    });
});
