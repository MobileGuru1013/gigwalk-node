// import schema from '../src/api/pushNotifications/pushNotifications-schema.json';
import createMoniker from '../utils/createMoniker';

describe('Push Notifications', () => {
    const userID = 100;

    it.skip('should be able to create a push notification', (done) => {
        const apiPromise = gigwalk.pushNotifications.create({
            push_notification: {
                users: [userID],
                group_ids: [],
                message: createMoniker()
            }
        });

        apiPromise.then((res) => {
            expect(res.status).to.equal(200);
            // expect(res.data).to.have.jsonSchema(schema);
            done();
        }).catch(done);
    });
});
