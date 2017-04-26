/**
 * @file createPageService
 * @author enix(ienx@foxmail.com)
 *
 * @since 2017/3/17
 */

const FS = require('fs');
const PATH = require('path');

const FSE = require('fs-extra');

const PAGE = require('./page/page');

const LOG = require('../util/log');
const ESCAPE_REG = require('../util/escapeRegExp');

let removeServerConf = option => {
    let {
        PROJECT_NAME,
        ROOT_DIR,
    } = option.ENV;

    const SERVER_CONF_PATH = PAGE.getServerConfPath(ROOT_DIR, PROJECT_NAME);

    try {
        FS.existsSync(SERVER_CONF_PATH);
    }
    catch (error) {
        // LOG(`${error.message}`, 'red');

        return false
    }

    let fileContent = PAGE.readServerConf(SERVER_CONF_PATH);
    let {ROUTER} = PAGE.getServerConfRouter(option);
    let regExp = new RegExp(ESCAPE_REG(ROUTER), 'g');

    if (!regExp.test(fileContent)) {
        // LOG(`The page \`${option.name}'s\` router not found!`, 'red');

        return false;
    }

    fileContent = fileContent.replace(regExp, '');

    FS.writeFileSync(
        PATH.join(SERVER_CONF_PATH),
        fileContent, {encoding: 'utf8', flag: 'w'}
    );

    LOG(`The page \`${option.originName}'s\` router remove completed!`, 'white');
};

let removeMock = option => {
    let {file, filePath} = PAGE.getMockPath(option);

    try {
        FS.existsSync(file);
    }
    catch (error) {
        // LOG(`${error.message}`, 'red');
        return false
    }

    try {
        FSE.removeSync(file);

        if (FS.statSync(filePath).isDirectory()
            && FS.readdirSync(filePath).length === 0) {
            FSE.removeSync(filePath);
        }
    }
    catch (error) {
        // LOG(`${error.message}`, 'red');
        return false;
    }

    LOG(`Remove page \`${option.originName}'s\` mock completed!`, 'white');
};

module.exports = data => {
    if (!data.ENV.MODULE_NAME) {
        return false;
    }

    removeServerConf(data);
    removeMock(data);
};
