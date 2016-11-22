/**
 * @file create
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/10/7
 */

'use strict';

const STRING = require('string');
const PROGRAM = require('commander');
const CO = require('co');
const PROMPT = require('co-prompt');

const CHALK = require('chalk');
 
const CREATE = require('./create/index');

const USER = require('./user').getRcData();

let userData = {
    author: USER.author,
    email: USER.email
};

module.exports = () => {

    CO(function *() {
        let type = PROGRAM.args[0].type;

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

        if (type === 'page') {
            let name = yield PROMPT('Page name: ');

            if (!name) {
                console.log(CHALK.bold.red('\n × `Page name` does not exist!'));
                process.exit();
            }

            CREATE('page', Object.assign({}, {name}, userData));
        }

        console.log(CHALK.bold.red(`\n × The type \`${type}\` does not support!`));
        process.exit();
    });
};
