/**
 * @file createIndexPage
 * @author ienix(ienx@foxmail.com)
 *
 * @since 2017/4/13
 */

const IP = require('ip');

const GET_ENV = require('../util/getEnv');

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
    } = GET_ENV('page', pageName, targetDir);

    CREATE_SERVER_CONF({ENV});
    OPEN_URL({ENV});

    return ENV;
};

module.exports = (option, pageName, targetDir) => {
    const CWD = process.cwd();

    let yamlData = READ_PROJECT_YAML(CWD);

    const ENV = createIndexServerConf(pageName, targetDir);
    const ID = ENV.PROJECT_ID;

    let allCategory = Object.keys(yamlData);
    let pageCount = 0;

    allCategory.forEach(category => yamlData[category].forEach((page, index) => {
        pageCount++;
        yamlData[category][index]['uri'] = `/${ID}/${category}/${page.name}`;
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
