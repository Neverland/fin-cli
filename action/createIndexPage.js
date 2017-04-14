/**
 * @file createIndexPage
 * @author ienix(ienx@foxmail.com)
 *
 * @since 2017/4/13
 */

const QRCODE = require('qrcode');

const IP = require('ip');
const CHALK = require('chalk');

const GET_PAGE_ENV = require('../util/getPageEnv');

const READ_PROJECT_YAML = require('../util/readProjectConfigYaml');
const CREATE_SERVER_CONF = require('../action/page/createServerConf');
const OPEN_URL = require('../action/page/openURL');

const IP_ADDRESS = IP.address();

let createIndexServerConf = (pageName, project, targetDir) => {
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
    } = GET_PAGE_ENV(pageName, project, targetDir);

    CREATE_SERVER_CONF(ENV);
    OPEN_URL(ENV);
};

module.exports = (pageName, userData, targetDir) => {
    const CWD = process.cwd();
    const INDEX_DOC = READ_PROJECT_YAML(CWD);

    createIndexServerConf(pageName, userData.project, targetDir);

    let pageList = {};
    let queue = [];

    Object.keys(INDEX_DOC).forEach(category => {
        pageList[category] = [];

        INDEX_DOC[category].forEach((page, index) => {
            let url = `/${userData.project.id}/${category}/${page.name}`;
            let promise = new Promise((resolve, reject) => {

                QRCODE.toDataURL(`http//:${IP_ADDRESS}:8080${url}`, (error, result) => {

                    if (error) {
                        reject(error);

                        console.log(CHALK.bold.red(`\n × ${error}`));
                        process.exit();
                    }

                    pageList[category].push({url, title: page.title || page.name, index, qrCode: result});
                    resolve({success: true});
                });

            });

            queue.push(promise);
        });
    });

    return Promise.all(queue)
        .then(result => {
            return Promise.resolve(pageList);
        });
};
