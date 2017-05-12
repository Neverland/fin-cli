/**
 * @file getEnv
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/13
 */

const PATH = require('path');

const STRING = require('string');
const LOG = require('./log');

const USER = require('../command/user').getRcData();

let method = {
    time() {
        const NOW = new Date();

        const TIME_STRING = +(NOW);

        const TIME_STRING_CN = NOW.toLocaleString();

        const TIME_STRING_32 = TIME_STRING.toString(32);

        return {
            NOW,
            TIME_STRING,
            TIME_STRING_CN,
            TIME_STRING_32
        };
    },
    project() {
        let project = USER.project;

        const PROJECT_NAME = project.name;
        const PROJECT_ID = project.id;

        return {
            PROJECT_NAME,
            PROJECT_ID
        }
    },
    root(targetDir) {
        const CWD = targetDir || process.cwd();
        const WORK_DIR = PATH.resolve(CWD);
        const PARSE_PATH = PATH.parse(WORK_DIR);
        const WORK_DIR_ARRAY = WORK_DIR.split('/');

        return  {
            CWD,
            WORK_DIR,
            WORK_DIR_ARRAY,
            PARSE_PATH
        }
    },
    page(ROOT, PROJECT) {
        let index = ROOT.WORK_DIR_ARRAY.indexOf('page');
        let moduleName = ROOT.WORK_DIR_ARRAY[index - 1];
        let projectName = ROOT.WORK_DIR_ARRAY[ROOT.WORK_DIR_ARRAY.indexOf(moduleName) - 1];

        if (ROOT.WORK_DIR_ARRAY.indexOf(PROJECT.PROJECT_NAME) > -1) {
            projectName = PROJECT.PROJECT_NAME;
        }

        let projectDir = ROOT.WORK_DIR.split(projectName);

        const ROOT_DIR = projectDir[0];

        // 以${module}目录为参照，当前目录如/${module}/page/a/
        const CURRENT_DIR = projectDir[1];

        let truePath = ROOT.PARSE_PATH.base;

        if (truePath === 'page') {
            truePath = '';
        }
        else {
            truePath = `/${ROOT.PARSE_PATH.base}`;
        }

        let parentDirIndex = ROOT.WORK_DIR_ARRAY.indexOf('page') + 1;

        const PARENT_DIR = ROOT.WORK_DIR_ARRAY.slice(parentDirIndex).join('/');

        let parentDirAlias = STRING(PARENT_DIR).camelize().s;

        const PARENT_DIR_ALIAS = parentDirAlias
                ? `/${parentDirAlias}`
                : parentDirAlias;

        return {
            ROOT_DIR,
            CURRENT_DIR,
            PARENT_DIR,
            PARENT_DIR_ALIAS,
            TRUE_PATH: truePath,
            PROJECT_NAME: projectName,
            MODULE_NAME: moduleName
        };
    }
};


/**
 * 获取要创建page的环境常量
 *
 * @param  {string} name - name(page, component)
 * @param {string} targetDir - output dist(resolve url)
 * @return {Object}
 */

module.exports = (name, targetDir) => {
    if (!name) {
        return false;
    }

    /**
     * 当前创建的page a-b-c 转化为驼峰 aBC
     *
     * @const
     * @type {string}
     */
    const REAL_NAME = STRING(name).camelize().s;
    const ROOT = method.root(targetDir);
    const PROJECT = method.project();
    const TIME = method.time();

    if (ROOT.WORK_DIR_ARRAY.indexOf(PROJECT.PROJECT_NAME) === -1) {
        LOG('\`Project id\` or \`Project name\` is error!', 'red');
    }

    let page  = {};

    if (ROOT.WORK_DIR_ARRAY.indexOf('page') > -1) {
        page = method.page(ROOT, PROJECT);
    }
    else {
        LOG('`Page` dir does not exist!', 'red');
    }

    /**
      * { CWD: '/WorkSpace/abc-def/app/page',
      * WORK_DIR: '/WorkSpace/abc-def/app/page',
      * WORK_DIR_ARRAY: [ '', 'WorkSpace', 'abc-def', 'app', 'page' ],
      * PARSE_PATH:
      *  { root: '/',
      *    dir: '/WorkSpace/abc-def/app',
      *    base: 'page',
      *    ext: '',
      *    name: 'page' },
      * PROJECT_NAME: 'abc-def',
      * PROJECT_ID: 'ad',
      * MODULE_NAME: 'app',
      * ROOT_DIR: '/WorkSpace/',
      * CURRENT_DIR: '/app/page',
      * TRUE_PATH: 'page',
      * REAL_NAME: 'abc',
      * name: 'abc',
      * NAME: 'abc' }
      */

    return Object.assign({}, ROOT, PROJECT, page, TIME, {REAL_NAME}, {name}, {NAME: name});
};
