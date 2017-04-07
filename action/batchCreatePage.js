/**
 * @file batchCreatePage
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/7
 */

const FS = require('fs');
const PATH = require('path');

const FSE = require('fs-extra');
const YAML = require('js-yaml');
const STRING = require('string');

const CHALK = require('chalk');

let batchCreatePage = (userData, list, dirPath, createPage) => {

    if (Array.isArray(list)) {
        list.forEach(item => {
            if (!item.name) {
                console.log(CHALK.bold.red('\n × Page `name` does not exist!'));
                return false;
            }

            let pageName = STRING(item.name).dasherize().s;

            createPage(pageName, userData, dirPath);
        });
    }
};

module.exports = (userData, createPage) => {
    const CWD = process.cwd();
    const ymlPath = PATH.join(CWD, 'index.yml');

    if (!FS.existsSync(ymlPath)) {
        console.log(CHALK.bold.red('\n × `index.yml` does not exist!'));
        process.exit();
    }

    const INDEX_DOC = YAML.safeLoad(FS.readFileSync(ymlPath, 'utf8'));

    let keyMap = Object.keys(INDEX_DOC);

    if (keyMap === 0) {
       console.log(CHALK.bold.red('\n × `index.yml` has some error!'));
       process.exit();
    }

    Object.keys(INDEX_DOC).forEach(key => {
        let dirName = STRING(key).dasherize().s;
        let dirPath = PATH.join(CWD, 'page', dirName);

        if (!FS.existsSync(dirPath)) {
            FSE.ensureDirSync(dirPath);
        }

        batchCreatePage(userData, INDEX_DOC[key], dirPath, createPage);
    });

    console.log(CHALK.green('\n √ Batch generation completed!'));
    process.exit();
};
