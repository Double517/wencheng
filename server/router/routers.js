const log_router = require('./log');
const wechat_router = require('./wechat');
const student_router = require('./student');
const teacher_router = require('./teacher');
const manager_router = require('./manager');

module.exports = [
    log_router,
    wechat_router,
    student_router,
    teacher_router,
    manager_router
];