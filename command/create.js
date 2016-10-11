/**
 * @file create
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/10/7
 */

'use strict';

const EXEC = require('child_process').exec;

const STRING = require('string');
const PROGRAM = require('commander');
const CO = require('co');
const PROMPT = require('co-prompt');

const CHALK = require('chalk');
 
const CREATE = require('./create/index');

module.exports = () => {
    CO(function *() {
        let type = PROGRAM.args[0].type;

        if (!type) {
            console.log(CHALK.bold.red('\n × `type` does not exit!'));
            process.exit();
        }

        let author = yield PROMPT('Author name: ');

        if (!author) {
            console.log(CHALK.bold.red('\n × `Author` does not exit!'));
            process.exit();
        }

        let email = yield PROMPT('Your email prefix: ');

        if (!author) {
            console.log(CHALK.bold.red('\n × `Email prefix` does not exit!'));
            process.exit();
        }

        if (type === 'component') {
            let name = yield PROMPT('Component name: ');

            if (!name) {
                console.log(CHALK.bold.red('\n × `Component name` does not exit!'));
                process.exit();
            }

            let alias = name;

            if (alias.indexOf('-')) {
                alias = STRING(alias).camelize().s;
            }

            CREATE('component', {
                name,
                author,
                email,
                alias
            });
        }

        if (type === 'page') {
            let name = yield PROMPT('Page name: ');

            if (!name) {
                console.log(CHALK.bold.red('\n × `Page name` does not exit!'));
                process.exit();
            }

            CREATE('page', {
                name,
                author,
                email
            });
        }

        console.log(CHALK.bold.red(`\n × The type \`${type}\` does not support!`));
        process.exit();
    });
};
