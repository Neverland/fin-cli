/**
 * @file create page
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/25
 */

const PATH = require('path');
const FS = require('fs');

const STRING = require('string');

const LOG = require('../../util/log');
 
exports.getServerConfRouter = data => {
    let {
        PROJECT_ID,
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

    const ROUTER = `\n\r## [page]: /${PROJECT_ID}${truePath.replace(/\\/g, '')}/${REAL_NAME}\n${router}\n\r`;

    return {router, ROUTER};
};

exports.readServerConf = path => {
    let fileContent = '';

    try {
        fileContent = FS.readFileSync(path, {encoding: 'utf8', flag: 'r'})
            .toString();
    }
    catch (error) {
        LOG(`${error}`);
    }

    // LOG(`Read \`Server.conf\` from ${path}`, 'white');

    return fileContent
};

exports.getServerConfPath = (rootDir, projectName) => {
    // server.conf string
    let serverConfPath = PATH.join(rootDir, projectName, 'server.conf');

    // server.conf path
    return PATH.join(serverConfPath);
};

exports.getMockPath = data => {
    let {
        PROJECT_NAME,
        ROOT_DIR,
        MODULE_NAME,
        PARENT_DIR,
        NAME
    } = data.ENV;

    let filePath = PATH.join(ROOT_DIR, PROJECT_NAME, MODULE_NAME, 'test/page', PARENT_DIR, NAME);
    let file = `${filePath}/${NAME}.php`;

    return {filePath, file};
};
