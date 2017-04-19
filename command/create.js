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

const LOG = require('../util/log');

const CREATE = require('./create/index');

const GET_PAGE_ENV = require('../util/getPageEnv');

const CREATE_PAGE_SERVICE = require('../action/createPageService');
const BATCH_CREATE_PAGE = require('../action/batchCreatePage');
const CREATE_INDEX_PAGE = require('../action/createIndexPage');

let createPage = (option) => {
    let {type = 'page', targetDir = ''} = option;

    CREATE(type, option, targetDir);
    CREATE_PAGE_SERVICE(option, targetDir);
};

const ACTION = {
    component(option) {
        CREATE('component', option);

        LOG('Generation completed!', 'success');
    },
    widget(option) {
        CREATE('widget', option);

        LOG('Generation completed!', 'success');
    },
    page(option) {
        createPage(option);
        LOG('Generation completed!', 'success');
    },
    webpage(option) {
        let data  = Object.assign({}, option, {type: 'webpage'});

        createPage(data);
        LOG('Generation completed!', 'success');
    },
    batch(option) {

        BATCH_CREATE_PAGE(createPage, option);
    },
    index(option) {
        const PAGE_NAME = 'index';
        const DEV_DIR = 'dev-fin';
        const TARGET_DIR = PATH.join(process.cwd(), 'page', DEV_DIR);

        let pageData = CREATE_INDEX_PAGE(option, PAGE_NAME, TARGET_DIR);

        CREATE('index', pageData, TARGET_DIR);
        LOG('Generation completed!', 'success');
    }
};

const CREATE_TYPE = 'single';
const OVERWRITE = false;

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
                name = yield PROMPT(`${action} name: `);

                if (!name) {
                    LOG(`The type \`${type}\` name is required!`);
                }
            }

            let alias = STRING(name).camelize().s;

            const ENV = GET_PAGE_ENV(name) || {};

            try {
                ACTION[type]({
                    ENV,
                    overwrite: OVERWRITE,
                    createType: CREATE_TYPE,
                    type, name, title, alias, extra
                });
            }
            catch (e) {
                LOG(`${e}`);
            }
        }
        else {
            LOG(`The type \`${type}\` does not support!`);
        }
    });
};
