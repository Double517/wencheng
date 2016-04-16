const superagent = require('supertest');
const app = require('../app');
const request = superagent(app.listen());

describe('Wechat', () => {
    describe('checkin', () => {
        it('should return 200', done => {
            request
                .get('/wechat/?signature=ec196de909f7752a21be99e256b812c4da8e85da&echostr=5203816041256820222&timestamp=1460798756&nonce=462217178')
                .expect(200)
                .expect('5203816041256820222', done);
        });
    });
});
