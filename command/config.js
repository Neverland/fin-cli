/**
 * @file config
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/10/12
 */

'use strict';

const PROGRAM = require('commander');

const LOG = require('../util/log');

const USER = require('./user');

module.exports = () => {
    let data = USER.getRcData();
    let {
            list, author,
            email,
            pName,
            pId
        } = PROGRAM.args[0];

    if (list) {
        let list = [];

        Object.keys(data)
            .forEach(item => {
                list.push(`\n -${item}: ${JSON.stringify(data[item])}`);
            });

        LOG('Config list:', 'green');
        LOG(list.join(''), 'white');

        process.exit();
    }
    else if (email) {
        data.email = email;
    }
    else if (author) {
        data.author = author;
    }
    else if (pName) {
        data.project.name = pName;
    }
    else if (pId) {
        data.project.id = pId;
    }

    USER.createRC(data);

    process.exit();
};
