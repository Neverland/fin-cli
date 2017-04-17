/**
 * @file getEnv
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/14
 */

const CHALK = require('chalk');

module.exports = (text, type = 'fail') => {
    let prefix = '\n ';
    let exitMap = /^(success|fail)$/g;
    let log = CHALK[type];

    switch (type) {
        case 'success':
            prefix += '✔ ';
            log = CHALK.green;
            break;
        case 'fail':
            prefix += '✖ ';
            log = CHALK.red;
            break;
    }

    let message = `${prefix}${text}`;

    console.log(log(message));

    if (exitMap.test(type)) {
        process.exit();
    }
};
