/**
 * @file createMock
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/13
 */

const PATH = require('path');
const FS = require('fs');

const STRING = require('string');

const LOG = require('../../util/log');

let getServerConfPath = (rootDir, projectName) => {
    // server.conf string
    let serverConfPath = PATH.join(rootDir, projectName, 'server.conf');

    // server.conf path
    return PATH.join(serverConfPath);
};

let writeServerConf  = (rootDir, projectName, router) => {
    const SERVER_CONF_PATH = getServerConfPath(rootDir, projectName);

    try {
        FS.existsSync(SERVER_CONF_PATH);
    }
    catch (e) {
        LOG(`${e.message}`);
    }

    let fileContent = readServerConf(SERVER_CONF_PATH);

    fileContent += router;

    FS.writeFileSync(
        PATH.join(SERVER_CONF_PATH),
        fileContent, {encoding: 'utf8', flag: 'w'}
    );
};

let readServerConf = path => {
    let fileContent = '';

    try {
        fileContent = FS.readFileSync(path, {encoding: 'utf8', flag: 'r'})
            .toString();
    }
    catch (error) {
        LOG(`${error}`);
    }

    LOG(`Read \`Server.conf\` from ${path}`, 'white');

    return fileContent
};

let checkServerConfRouter = (rootDir, projectName, router) => {
    const SERVER_CONF_PATH = getServerConfPath(rootDir, projectName);

    let fileContent = readServerConf(SERVER_CONF_PATH);

    return fileContent.split('\n').indexOf(router) > -1;
};

module.exports = (data) => {
    let {
        PROJECT_NAME,
        ROOT_DIR,
        PROJECT_ID,
        WORK_DIR_ARRAY,
        PARENT_DIR,
        PARENT_DIR_ALIAS,
        REAL_NAME,
        MODULE_NAME,
        NAME
    } = data.ENV;


    // 当前创建的page的相对根的路径: ${projectId}/${module}/page/abc/abc-def/abc-def.tpl
    let currentTplPath = PATH.join(PROJECT_ID, MODULE_NAME, 'page', PARENT_DIR, NAME, `${NAME}.tpl`);
    let truePath = PARENT_DIR_ALIAS.replace(/\//g, '\\/');

    let templateRegExp = `template ^(\\/${PROJECT_ID})?${STRING(truePath).camelize().s}\\/${REAL_NAME}($|\\?.*)$`;
    let router = `${templateRegExp} ${currentTplPath}`;

    const ROUTER = `\n\r## page ${PROJECT_ID}${truePath.replace(/\\/g, '')}/${NAME}:\n${router}\n\r`;

    if (WORK_DIR_ARRAY.indexOf(PROJECT_NAME) === -1) {
        LOG('\n \`Project id\` or \`Project name\` is error!', 'red');
    }

    // 如果router 在server.conf中存在， 则不添加
    if(!checkServerConfRouter(ROOT_DIR, PROJECT_NAME, router)) {
        writeServerConf(ROOT_DIR, PROJECT_NAME, ROUTER);
    }
};
