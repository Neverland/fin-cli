/**
 * @file createPageService
 * @author ienix(ienx@foxmail.com)
 *
 * @since 2017/3/17
 */

const CREATE_MOCK = require('../action/page/createMock');
const CREATE_SERVER_CONF = require('../action/page/createServerConf');
const OPEN_URL = require('../action/page/openURL');

module.exports = (data) => {
    if (!data.ENV.MODULE_NAME) {
        return false;
    }

    CREATE_SERVER_CONF(data);

    return false;
    CREATE_MOCK(data);

    if (data.createType === 'single') {
        OPEN_URL(data);
    }
};
