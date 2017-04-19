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

module.exports = (data) => {
    let {
        PROJECT_NAME,
        PROJECT_ID,
        ROOT_DIR,
        WORK_DIR_ARRAY,
        PARENT_DIR_ALIAS,
        REAL_NAME,
        MODULE_NAME,
        NAME
    } = data.ENV;

    // 当前创建的page的相对根的路径: ${projectId}/${module}/page/abc/abc-def/abc-def.tpl
    let currentTplPath = PATH.join(PROJECT_ID, MODULE_NAME, 'page', PARENT_DIR_ALIAS, NAME, `${NAME}.tpl`);
    let truePath = PARENT_DIR_ALIAS.replace(/\//g, '\\/');
    let regReg = `template ^(\\/${PROJECT_ID})?${STRING(truePath).camelize().s}\\/${REAL_NAME}($|\\?.*)$`;

    const ROUTER = `\n\r## page ${PROJECT_ID}${truePath.replace(/\\/g, '')}/${NAME}:\n${regReg} ${currentTplPath}\n\r`;

    if (WORK_DIR_ARRAY.indexOf(PROJECT_NAME) === -1) {

        LOG('\n \`Project id\` or \`Project name\` is error!', 'red');
    }

    // server.conf string
    let serverConfPath = PATH.join(ROOT_DIR, PROJECT_NAME, 'server.conf');

    try {
        FS.existsSync(serverConfPath);
    }
    catch (e) {
        LOG(`${e.message}`);
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
