/**
 * @file createIndexPage
 * @author ienix(ienx@foxmail.com)
 *
 * @since 2017/4/13
 */

const QRCODE = require('qrcode');

const IP = require('ip');

const LOG = require('../util/log');

const GET_PAGE_ENV = require('../util/getPageEnv');

const READ_PROJECT_YAML = require('../util/readProjectConfigYaml');
const CREATE_SERVER_CONF = require('../action/page/createServerConf');

const OPEN_URL = require('../action/page/openURL');

const IP_ADDRESS = IP.address();

let createIndexServerConf = (pageName, targetDir) => {
    const ENV = {
        PROJECT_NAME,
        PROJECT_ID,
        CWD,
        WORK_DIR,
        WORK_DIR_ARRAY,
        CURRENT_DIR,
        MODULE_NAME,
        REAL_NAME,
        PARSE_PATH,
        BASE_DIR
    } = GET_PAGE_ENV(pageName, targetDir);

    // CREATE_SERVER_CONF({ENV});
    // OPEN_URL({ENV});

    return ENV;
};

module.exports = (option, pageName, targetDir) => {
    const CWD = process.cwd();
    const ENV = createIndexServerConf(pageName, targetDir);

    let id = ENV.PROJECT_ID;
    const yamlData = READ_PROJECT_YAML(CWD);
    let allCategory = Object.keys(yamlData);
    let pageCount = 0;

    allCategory.forEach(category => yamlData[category].forEach((page, index) => {
        pageCount++;
        yamlData[category][index]['uri'] = `/${id}/${category}/${page.name}`;
    }));

    let data = JSON.stringify({
        list: yamlData,
        ip: IP_ADDRESS,
        categoryCount: allCategory.length,
        pageCount
    });

    let indexPageData = {
        name: pageName,
        title: pageName,
        alias: pageName,
        overwrite: true
    };

    return Object.assign({}, option, {ENV, data}, indexPageData);
};

