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
    let {
            list, author,
            email, projectName,
            projectId
        } = PROGRAM.args[0];

    if (list) {
        let list = [];

        Object.keys(data)
            .forEach(item => {
                list.push(`\n -${item}: ${JSON.stringify(data[item])}`);
            });

        console.log(''
            + CHALK.green('\n Config list:')
            + CHALK.white('\n' + list.join(''))
        );
        process.exit();
    }
    else if (email) {
        data.email = email;
    }
    else if (author) {
        data.author = author;
    }
    else if (projectName) {
        data.project.name = projectName;
    }
    else if (projectId) {
        data.project.id = projectId;
    }

    USER.createRC(data);

    process.exit();
};
