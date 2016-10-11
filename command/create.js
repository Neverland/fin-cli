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
 
const COMPONENT = require('./create/component');

module.exports = () => {
    CO(function *() {
        let type = PROGRAM.args[0].type;

        if (!type) {
            console.log(CHALK.bold.red('\n × `type` does not exit!'));
            process.exit();
        }

        if (type === 'component') {
            let component = yield PROMPT('Component name: ');

            if (!component) {
                console.log(CHALK.bold.red('\n × `Component name` does not exit!'));
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

            let alias = component;

            if (alias.indexOf('-')) {
                alias = STRING(alias).camelize().s;
            }

            COMPONENT({
                component,
                author,
                email,
                alias
            });
        }

        console.log(CHALK.bold.red(`\n × The type \`${type}\` does not support!`));
        process.exit();
    });
};
