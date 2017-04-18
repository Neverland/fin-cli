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

    let project = USER.project;

    const PROJECT_NAME = project.name;
    const PROJECT_ID = project.id;

    const CWD = targetDir || process.cwd();
    const WORK_DIR = PATH.resolve(CWD);

    const WORK_DIR_ARRAY = WORK_DIR.split('/');

    if (WORK_DIR_ARRAY.indexOf(PROJECT_NAME) === -1) {

        LOG('× \`Project id\` is error!', 'red');

        return false;
    }

    let projectDir = WORK_DIR.split(PROJECT_NAME);

    const ROOT_DIR = projectDir[0];

    // 以${module}目录为参照，当前目录如/${module}/page/a/
    const CURRENT_DIR = projectDir[1];

    let purePath = CURRENT_DIR.split('page');

    const TRUE_PATH = purePath[1];

    // ${module} app
    const MODULE_NAME = purePath[0].replace(/\//g, '');

    /**
     * 当前创建的page a-b-c 转化为驼峰 aBC
     *
     * @const
     * @type {string}
     */
    const REAL_NAME = STRING(name).camelize().s;

    // 以当前工作目录解析
    const PARSE_PATH = PATH.parse(WORK_DIR);

    // ${projectId}/${module}/page/x/y/z/a-b-c.tpl baseDir = z;
    const BASE_DIR = PARSE_PATH.base;


    // ${module}/page/abc/xyz/x-ya-zb -> /abc/xyz/xYaZb
    const PARENT_DIR_ALIAS = STRING(TRUE_PATH).camelize().s;

    const NOW = new Date();

    const TIME_STRING = +(NOW);

    const TIME_STRING_CN = NOW.toLocaleString();

    const TIME_STRING_32 = TIME_STRING.toString(32);

    return  {
        ROOT_DIR,
        PROJECT_NAME,
        PROJECT_ID,
        CWD,
        WORK_DIR,
        WORK_DIR_ARRAY,
        CURRENT_DIR,
        MODULE_NAME,
        REAL_NAME,
        PARSE_PATH,
        BASE_DIR,
        TRUE_PATH,
        PARENT_DIR_ALIAS,
        TIME_STRING,
        TIME_STRING_32,
        TIME_STRING_CN,
        NAME: name
    }
};
