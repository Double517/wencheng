const chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
    , assert = chai.assert;

const util = require('../api/util');
const student_api = require('../api/student');

describe('课表', function() {
    describe('教学第几周', function () {
        it('should return 9', function () {
            var start_day = '2016-02-21 00:00:00.000';
            var now = new Date('2016-04-22 00:00:00.000');
            var result = util.get_current_week(start_day, now);
            console.log({result:result});
            assert(result == 9);
        });
    });
    describe('课表', () => {
        const userid = '1517249001';
        it('should return array', function *() {
            var result = yield *student_api.get_class_schedule(userid, 9);
            console.log(result);
            assert(result.week === 9);
            assert(result.list.length > 0);
        });
        it('should return []', function *() {
            var result = yield *student_api.get_class_schedule('9999999999999', 9);
            console.log(result);
            assert(result.week === 9);
            assert(result.list.length === 0);
        });
        it('should return this week', function *() {
            var result = yield *student_api.get_this_week_class_schedule(userid);
            console.log(result);
            assert(result.list.length > 0);
        });
        it('should return today', function *() {
            var result = yield *student_api.get_today_class_schedule(userid);
            console.log(result);
            assert(result.list.length > 0);
        });
    });
});

