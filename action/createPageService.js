/**
 * @file createPageService
 * @author ienix(ienx@foxmail.com)
 *
 * @since 2017/3/17
 */


const GET_PAGE_ENV = require('../util/getPageEnv');

const CREATE_MOCK = require('../action/page/createMock');
const CREATE_SERVER_CONF = require('../action/page/createServerConf');
const OPEN_URL = require('../action/page/openURL');

module.exports = (name, project, targetDir = '') => {
    const ENV = {
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
    } = GET_PAGE_ENV(name, project, targetDir);

    CREATE_SERVER_CONF(ENV);
    CREATE_MOCK(ENV);

    if (!targetDir) {
        OPEN_URL(ENV);
    }
};
