/**
 * @file open url
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/13
 */

const RUN = require('exec-cmd');

const STRING = require('string');

const LOG = require('../../util/log');

module.exports = (ENV) => {
    let {
        PROJECT_ID,
        REAL_PAGE_NAME,
        TRUE_PATH
    } = ENV;

    let browseUrl = `localhost:8080/${PROJECT_ID}${STRING(TRUE_PATH).camelize().s}/${REAL_PAGE_NAME}`;

    LOG(`\n Browse ${browseUrl}`, 'green');
    RUN('open', [`http://${browseUrl}`]);
};
