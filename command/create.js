/**
 * @file create
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/10/7
 */

'use strict';

require('console.table');

const PATH = require('path');

const STRING = require('string');
const PROGRAM = require('commander');
const CO = require('co');
const PROMPT = require('co-prompt');

const CHALK = require('chalk');

const CREATE = require('./create/index');
const USER = require('./user').getRcData();
const CREATE_PAGE_SERVICE = require('../action/createPageService');
const BATCH_CREATE_PAGE = require('../action/batchCreatePage');
const CREATE_INDEX_PAGE = require('../action/createIndexPage');

let userData = {
    author: USER.author,
    email: USER.email,
    project: USER.project
};

let createPage = (name, data, targetDir = '') => {
    CREATE_PAGE_SERVICE(name, userData.project, targetDir);
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
        else if (type === 'index') {
            const PAGE_NAME = 'index';
            const DEV_DIR = 'fin-dev';
            const TARGET_DIR = PATH.join(process.cwd(), 'page', DEV_DIR);

            CREATE_INDEX_PAGE(PAGE_NAME, userData, TARGET_DIR)
                .then(result => {
                    let pageData = Object.assign({}, {name: PAGE_NAME}, userData, {pageData: result});

                    CREATE('index', pageData, TARGET_DIR);

                    console.log(CHALK.green('\n √ Generation completed!'));
                    process.exit();
                })
                .catch(error => {
                    console.log(CHALK.bold.red(`\n × \`${error}\``));
                    process.exit();
                });

        }
        else {
            console.log(CHALK.bold.red(`\n × The type \`${type}\` does not support!`));
            process.exit();
        }
    });
};
