/**
 * @file createServerConf
 * @author ienix(ienx@foxmail.com)
 *
 * @since 2017/3/17
 */

const PATH = require('path');
const FS = require('fs');

const STRING = require('string');
const CHALK = require('chalk');

module.exports = (name, project) => {
    /**
     * 项目根目录
     *
     * @const
     * @type {string}
     */
    const PROJECT_NAME = project.name;

    /**
     * 项目唯一识别代号
     *
     * @const
     * @type {string}
     */
    const PROJECT_ID = project.id;

    const CWD = process.cwd();
    const ROOT_DIR = PATH.resolve(CWD);

    /**
     * 当前创建的page a-b-c 转化为驼峰 aBC
     *
     * @const
     * @type {string}
     */
    const REAL_PATH_NAME = STRING(name).camelize().s;

    // 当前创建的page的相对根的路径
    let currentPath = `${PROJECT_ID}${ROOT_DIR.split(PROJECT_NAME)[1]}/${name}/${name}.tpl`;
    let parsePath = CWD.match(/(\w+)/g);

    // x/y/z/a-b-c.tpl - baseDir = z;
    let baseDir = parsePath[parsePath.length - 1];
    let browseUrl = `localhost:8080/${PROJECT_ID}/${baseDir}/${REAL_PATH_NAME}`;

    let regReg = `template ^(\\/${PROJECT_ID})?\\/${baseDir}\\/${REAL_PATH_NAME}($|\\?.*)$`;

    const ROUTER = `\n\r## page ${REAL_PATH_NAME}:\n${regReg} ${currentPath}\n\r`;

    // server.conf string
    let serverConfPath = ROOT_DIR.slice(0, ROOT_DIR.indexOf(PROJECT_NAME) + PROJECT_NAME.length + 1) + 'server.conf';

    // server.conf path
    const SERVER_CONF_PATH = PATH.join(serverConfPath);

    let fileContent = FS.readFileSync(SERVER_CONF_PATH, {encoding: 'utf8', flag: 'r'})
        .toString();

    fileContent += ROUTER;

    FS.writeFileSync(
        PATH.join(SERVER_CONF_PATH),
        fileContent, {encoding: 'utf8', flag: 'w'}
    );

    console.log(CHALK.gray('\n Browse ') + CHALK.bold.green(browseUrl));
};
