/**
 * @file config
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2016/10/12
 */

'use strict';

const PROGRAM = require('commander');

const CHALK = require('chalk');

const USER = require('./user');

module.exports = () => {
    let data = USER.getRcData();
    let param = PROGRAM.args[0];

    if (param.list) {
        let list = [];

        Object.keys(data)
            .forEach(item => {
                list.push(`\n -${item}: ${data[item]}`);
            });

        console.log(''
            + CHALK.green('\n Config list:')
            + CHALK.gray('\n' + list.join(''))
        );
        process.exit();
    }

    // FIXME: 不能使用解构， node版本问题？
    if  (param.author) {
        data.author = param.author;
    }

    if  (param.email) {
        data.email = param.email;
    }

    USER.createRC(data);

    process.exit();
};
