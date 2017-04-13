/**
 * @file open url
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/13
 */

const CHALK = require('chalk');

module.exports = (ENV) => {
    let {
        PROJECT_ID,
        REAL_PAGE_NAME,
        TRUE_PATH
    } = ENV;

    let browseUrl = `localhost:8080/${PROJECT_ID}${TRUE_PATH}/${REAL_PAGE_NAME}`;

    console.log(CHALK.gray('\n Browse ') + CHALK.bold.green(browseUrl));
    RUN('open', [`http://${browseUrl}`]);
};
