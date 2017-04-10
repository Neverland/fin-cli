/**
 * @file create
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/10/7
 */

'use strict';

require('console.table');

const STRING = require('string');
const PROGRAM = require('commander');
const CO = require('co');
const PROMPT = require('co-prompt');

const CHALK = require('chalk');

const CREATE = require('./create/index');
const USER = require('./user').getRcData();
const SERVER_CONF = require('../action/createServerConf');
const BATCH_CREATE_PAGE = require('../action/batchCreatePage');

let userData = {
    author: USER.author,
    email: USER.email,
    project: USER.project
};

let createPage = (name, data, targetDir = '') => {
    SERVER_CONF(name, userData.project, targetDir);
    CREATE('page', Object.assign({}, {name}, data), targetDir);
};

module.exports = () => {

    CO(function *() {
        let {type, title = ''} = PROGRAM.args[0];

        if (!type) {
            console.log(CHALK.bold.red('\n × `type` does not exist!'));
            process.exit();
        }

        if (type === 'component') {

            let name = yield PROMPT('Component name: ');

            if (!name) {
                console.log(CHALK.bold.red('\n × `Component name` does not exist!'));
                process.exit();
            }

            let alias = name;

            if (alias.indexOf('-')) {
                alias = STRING(alias).camelize().s;
            }

            CREATE('component', Object.assign({}, {name, alias}, userData));
        }
        else if (type === 'page') {
            let name = yield PROMPT('Page name: ');

            if (!name) {
                console.log(CHALK.bold.red('\n × `Page name` does not exist!'));
                process.exit();
            }

            createPage(name, Object.assign({}, {title}, userData));

            console.log(CHALK.green('\n √ Generation completed!'));
            process.exit();
        }
        else if (type === 'batch') {
            BATCH_CREATE_PAGE(userData, createPage);
        }

        console.log(CHALK.bold.red(`\n × The type \`${type}\` does not support!`));
        process.exit();
    });
};
