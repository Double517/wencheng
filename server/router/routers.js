const base_router = require('./base');
const wechat_router = require('./wechat');
const student_router = require('./student');
const teacher_router = require('./teacher');
const manager_router = require('./manager');

module.exports = [
    base_router,
    wechat_router,
    student_router,
    teacher_router,
    manager_router
];