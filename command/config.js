/**
 * @file config
 * @author ienix(enix@foxmail.com)
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
                list.push(`\n -${item}: ${JSON.stringify(data[item])}`);
            });

        console.log(''
            + CHALK.green('\n Config list:')
            + CHALK.gray('\n' + list.join(''))
        );
        process.exit();
    }

    // FIXME: 不能使用解构， node版本问题？

    switch(param) {
        case 'author':
            data.author = param.author;
        break;
        case 'email':
            data.email = param.email;
            break;
        case 'projectName':
            data.project.name = param.projectName;
            break;
        case 'projectId':
            data.project.id = param.projectId;
            break;
    }

    USER.createRC(data);

    process.exit();
};
