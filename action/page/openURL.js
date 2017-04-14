/**
 * @file open url
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/13
 */

const RUN = require('exec-cmd');

const STRING = require('string');
const CHALK = require('chalk');

module.exports = (ENV) => {
    let {
        PROJECT_ID,
        REAL_PAGE_NAME,
        TRUE_PATH
    } = ENV;

    let browseUrl = `localhost:8080/${PROJECT_ID}${STRING(TRUE_PATH).camelize().s}/${REAL_PAGE_NAME}`;

    console.log(CHALK.gray('\n Browse ') + CHALK.bold.green(browseUrl));
    RUN('open', [`http://${browseUrl}`]);
};
