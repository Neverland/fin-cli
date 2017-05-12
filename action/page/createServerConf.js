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

const PAGE = require('./page');

let writeServerConf  = (rootDir, projectName, router) => {
    const SERVER_CONF_PATH = PAGE.getServerConfPath(rootDir, projectName);

    try {
        FS.existsSync(SERVER_CONF_PATH);
    }
    catch (error) {
        LOG(`${error.message}`, 'red');

        return false
    }

    let fileContent = PAGE.readServerConf(SERVER_CONF_PATH);

    fileContent += router;

    FS.writeFileSync(
        PATH.join(SERVER_CONF_PATH),
        fileContent, {encoding: 'utf8', flag: 'w'}
    );
};

let checkServerConfRouter = (rootDir, projectName, router) => {
    const SERVER_CONF_PATH = PAGE.getServerConfPath(rootDir, projectName);

    let fileContent = PAGE.readServerConf(SERVER_CONF_PATH);

    return fileContent.split('\n').indexOf(router) > -1;
};

module.exports = data => {
    let {
        PROJECT_NAME,
        ROOT_DIR,
    } = data.ENV;

    let {router, ROUTER} = PAGE.getServerConfRouter(data);

    // 如果router 在server.conf中存在， 则不添加
    if (!checkServerConfRouter(ROOT_DIR, PROJECT_NAME, router)) {
        writeServerConf(ROOT_DIR, PROJECT_NAME, ROUTER);
    }
    else {
        LOG(`The page \`${data.ENV.name}\`'s router is already exist!`, 'white');
    }
};
