/**
 * @file createServerConf
 * @author ienix(ienx@foxmail.com)
 *
 * @since 2017/3/17
 */

const PATH = require('path');
const FS = require('fs');

const FSE = require('fs-extra');
const STRING = require('string');
const CHALK = require('chalk');

let env = (name, project) => {
    const PROJECT_NAME = project.name;
    const PROJECT_ID = project.id;

    const CWD = process.cwd();
    const WORK_DIR = PATH.resolve(CWD);

    const WORK_DIR_ARRAY = WORK_DIR.split('/');

    if (WORK_DIR_ARRAY.indexOf(PROJECT_NAME) === -1) {
        console.log(CHALK.bold.red(`\n × \`Project id\` is error!`));

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
    const REAL_PAGE_NAME = STRING(name).camelize().s;

    // 以当前工作目录解析
    const PARSE_PATH = PATH.parse(WORK_DIR);

    // ${projectId}/${module}/page/x/y/z/a-b-c.tpl baseDir = z;
    const BASE_DIR = PARSE_PATH.base;

    return  {
        ROOT_DIR,
        PROJECT_NAME,
        PROJECT_ID,
        CWD,
        WORK_DIR,
        WORK_DIR_ARRAY,
        CURRENT_DIR,
        MODULE_NAME,
        REAL_PAGE_NAME,
        PARSE_PATH,
        BASE_DIR,
        TRUE_PATH,
        NAME: name
    }
};

let serverConf = (ENV) => {
    let {
        PROJECT_NAME,
        PROJECT_ID,
        WORK_DIR,
        CURRENT_DIR,
        REAL_PAGE_NAME,
        TRUE_PATH,
        NAME
    } = ENV;

    // 当前创建的page的相对根的路径: ${projectId}/${module}/page/abc/abc-def/abc-def.tpl
    let currentTplPath = `${PROJECT_ID}${CURRENT_DIR}/${NAME}/${NAME}.tpl`;
    let truePath = TRUE_PATH.replace(/\//g, '\\/');
    let regReg = `template ^(\\/${PROJECT_ID})?${truePath}\\/${REAL_PAGE_NAME}($|\\?.*)$`;

    const ROUTER = `\n\r## page ${truePath}/${REAL_PAGE_NAME}:\n${regReg} ${currentTplPath}\n\r`;

    if (WORK_DIR.split('/').indexOf(PROJECT_NAME) === -1) {

        console.log(CHALK.bold.red(`\n × \`Project name\` or \`Project id\` is error!`));
        return false;
    }

    // server.conf string
    let serverConfPath = WORK_DIR.slice(0, WORK_DIR.indexOf(PROJECT_NAME) + PROJECT_NAME.length + 1);

    serverConfPath = PATH.join(serverConfPath, 'server.conf');

    try {
        FS.existsSync(serverConfPath);
    }
    catch (e) {
        console.log(CHALK.red('\n ${e.message} '));
        process.exit();
    }

    // server.conf path
    const SERVER_CONF_PATH = PATH.join(serverConfPath);

    let fileContent = FS.readFileSync(SERVER_CONF_PATH, {encoding: 'utf8', flag: 'r'})
        .toString();

    fileContent += ROUTER;

    FS.writeFileSync(
        PATH.join(SERVER_CONF_PATH),
        fileContent, {encoding: 'utf8', flag: 'w'}
    );
};

let openUrl = (ENV) => {
    let {
        PROJECT_ID,
        REAL_PAGE_NAME,
        TRUE_PATH
    } = ENV;

    let browseUrl = `localhost:8080/${PROJECT_ID}${TRUE_PATH}/${REAL_PAGE_NAME}`;

    console.log(CHALK.gray('\n Browse ') + CHALK.bold.green(browseUrl));
    RUN('open', [`http://${browseUrl}`]);
};

let createMock = (ENV) => {
    let {
        PROJECT_NAME,
        ROOT_DIR,
        MODULE_NAME,
        TRUE_PATH,
        NAME
    } = ENV;

    let filePath = PATH.join(ROOT_DIR, PROJECT_NAME, MODULE_NAME, 'test/page', TRUE_PATH, NAME);
    let file = `${filePath}/${NAME}.php`;
    let text = `<?php
        require_once  realpath(dirname(__FILE__) . '/../../') . '/public.php';
        $fis_data = array_merge($publicTestData, array(
            data => array(

            ),
        ));
        `;

    if (!FS.existsSync(filePath)) {
        FSE.ensureDirSync(filePath);
    }

    try {
        FS.writeFileSync(
            file,
            text, {encoding: 'utf8', flag: 'w'}
        );
    }
    catch (error) {
        console.log(error);
    }
};

module.exports = (name, project) => {
    let ENV = {
        PROJECT_NAME,
        PROJECT_ID,
        CWD,
        WORK_DIR,
        WORK_DIR_ARRAY,
        CURRENT_DIR,
        MODULE_NAME,
        REAL_PAGE_NAME,
        PARSE_PATH,
        BASE_DIR
    } = env(name, project);

    serverConf(ENV);
    createMock(ENV);
    openUrl(ENV);
};
