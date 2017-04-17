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

const PROGRESS = require('../util/progress')();
const LOG = require('../util/log');

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
let createPage = (option) => {
    let {type = 'page', name, data, targetDir = ''} = option;

    CREATE_PAGE_SERVICE(name, userData.project, targetDir);
    CREATE(type, Object.assign({}, {name}, data), targetDir);
};

const ACTION = {
    component(option) {
        let {name} = option;
        let alias = name;

        if (alias.indexOf('-')) {
            alias = STRING(alias).camelize().s;
        }

        CREATE('component', Object.assign({}, {name, alias}, userData));

        LOG('Generation completed!', 'success');
    },
    widget(option) {
        let {name} = option;
        let alias = name;

        if (alias.indexOf('-')) {
            alias = STRING(alias).camelize().s;
        }

        CREATE('widget', Object.assign({}, {name, alias}, userData));

        LOG('Generation completed!', 'success');
    },
    page(option) {
        let {name, title} = option;
        let data  = Object.assign({}, {title}, userData);

        createPage({name, data});
        LOG('Generation completed!', 'success');
    },
    webpage(option) {
        let {name, title} = option;
        let data  = Object.assign({}, {title}, userData);

        createPage({name, data, type: 'webpage'});
        LOG('Generation completed!', 'success');
    },
    batch(option) {
        let {extra} = option;

        BATCH_CREATE_PAGE(userData, createPage, extra);
    },
    index() {
        const PAGE_NAME = 'index';
        const DEV_DIR = 'fin-dev';
        const TARGET_DIR = PATH.join(process.cwd(), 'page', DEV_DIR);

        CREATE_INDEX_PAGE(PAGE_NAME, userData, TARGET_DIR)
            .then(result => {
                let pageData = Object.assign({}, {name: PAGE_NAME}, userData, {page: result});

                CREATE('index', pageData, TARGET_DIR);
                LOG('Generation completed!', 'success');
            })
            .catch(error => {

                LOG(`\n × \`${error}\``);
            });
    }
};

module.exports = () => {
    CO(function *() {
        let {type, title = '', extra = 'page'} = PROGRAM.args[0];

        if (!type) {
            LOG(` The \`${type}\` does not support!`);
        }

        if (type in ACTION) {
            let name = '';
            let action = STRING(type).capitalize().s;

            if (!/^(index|batch)$/g.test(type)) {
                name = yield PROMPT(`${action} name: `)
            }

            ACTION[type]({type, name, title, extra});
        }
        else {
            LOG(`The type \`${type}\` does not support!`);
        }
    });
};
