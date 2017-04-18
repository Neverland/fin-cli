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

    CREATE_SERVER_CONF({ENV});
    OPEN_URL({ENV});

    return ENV;
};

let createQrCode = (page, category, id) => {
    let url = `/${id}/${category}/${page.name}`;
    let {name, title} = page;

    return new Promise((resolve, reject) => {
        let path = `http://${IP_ADDRESS}:8080${url}`;

        QRCODE.toDataURL(path, (error, result) => {

            if (error) {
                reject(error);

                LOG(`${error}`);
            }

            resolve({url, title: title ? title : name, name, qrCode: result, category});
        });

    });
};
let filterData = (data, ENV, categoryCount) => {
    let list = {};

    data.forEach(item => {
        let key = item.category;

        list[key] || (list[key] = []);

        list[key].push(item);
    });

    return Promise.resolve({list, ENV, pageCount: data.length, categoryCount});
};

module.exports = (option, pageName, targetDir) => {
    const CWD = process.cwd();
    const INDEX_DOC = READ_PROJECT_YAML(CWD);
    const ENV = createIndexServerConf(pageName, targetDir);

    let id = ENV.PROJECT_ID;
    let queue = [];

    Object.keys(INDEX_DOC).forEach(category => INDEX_DOC[category].forEach(page => {
        return queue.push(createQrCode(page, category, id))
    }));

    return Promise.all(queue)
        .then(result => filterData(result, ENV, Object.keys(INDEX_DOC).length));
};
