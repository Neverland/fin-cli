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
        WORK_DIR,
        CURRENT_DIR,
        REAL_NAME,
        TRUE_PATH,
        NAME
    } = data.ENV;

    // 当前创建的page的相对根的路径: ${projectId}/${module}/page/abc/abc-def/abc-def.tpl
    let currentTplPath = `${PROJECT_ID}${CURRENT_DIR}/${NAME}/${NAME}.tpl`;
    let truePath = TRUE_PATH.replace(/\//g, '\\/');
    let regReg = `template ^(\\/${PROJECT_ID})?${STRING(truePath).camelize().s}\\/${REAL_NAME}($|\\?.*)$`;

    const ROUTER = `\n\r## page /${PROJECT_ID}${truePath.replace(/\\/g, '')}/${REAL_NAME}:\n${regReg} ${currentTplPath}\n\r`;

    if (WORK_DIR.split('/').indexOf(PROJECT_NAME) === -1) {

        LOG('\n × \`Project name\` or \`Project id\` is error!', 'red');

        return false;
    }

    // server.conf string
    let serverConfPath = WORK_DIR.slice(0, WORK_DIR.indexOf(PROJECT_NAME) + PROJECT_NAME.length + 1);

    serverConfPath = PATH.join(serverConfPath, 'server.conf');

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
