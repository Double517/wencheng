/**
 * Created by wujichao on 16/4/23.
 */

const chai = require('chai')
    , expect = chai.expect
    , should = chai.should()
    , assert = chai.assert;

const fs = require('fs');
const _ = require('lodash');

describe('DataField', () => {
    describe('haha', () => {
        it('should return 200', done => {

            var dir = '/Users/wujichao/Documents/大学/论文/to_student/web_for_sublime/student/';

            var files = fs.readdirSync(dir);
            console.log(files);
            for (var i = 0; i < files.length; i++) {
                var value = files[i];
                var content;
                try {
                    content = fs.readFileSync(dir + value, 'utf8');
                } catch (err) {}

                console.log(value);

                var myRe = /DataField="([^"]+)" HeaderText="([^"]+)"/g;
                var myArray;
                while ((myArray = myRe.exec(content)) !== null) {
                    console.log({key: myArray[1], value: myArray[2]});
                }

                if (i == files.length - 1) {
                    done();
                }
            }
        });
    });
});
