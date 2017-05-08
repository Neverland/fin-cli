/**
 * @file remove
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/25
 */

const FS = require('fs');
const PATH = require('path');

const FSE = require('fs-extra');

const CO = require('co');
const PROMPT = require('co-prompt');

const PROGRAM = require('commander');
const STRING = require('string');

const LOG = require('../util/log');
const GET_ENV = require('../util/getEnv');

const REMOVE_PAGE_SERVICE = require('../action/removePageService');

const ACTION = {
    page(option) {
        let {CWD, NAME, REAL_NAME} = option.ENV;
        let path = PATH.join(CWD, NAME);

        REMOVE_PAGE_SERVICE(option);

        if (!FS.existsSync(path)) {
            let temp = PATH.join(CWD, REAL_NAME);

            if (FS.existsSync(temp)) {
                path = temp;

                let newOption = {
                    name: REAL_NAME,
                    NAME: REAL_NAME
                };

                Object.assign(option.ENV, newOption);
            }
            else {
                LOG(`The page \`${NAME}\` directory does not exist!`);
            }
        }

        try {
            FSE.removeSync(PATH.join(path, `${option.originName}.tpl`));
            FSE.removeSync(PATH.join(path, `${option.originName}.js`));
            FSE.removeSync(PATH.join(path, `${option.originName}.less`));

            if (FS.statSync(path).isDirectory()
                && FS.readdirSync(path).length === 0) {
                FSE.removeSync(path);
            }
        }
        catch (error) {
            LOG(`${error.message}`, 'red');
        }

        LOG(`Remove \`${option.originName}\` directory completed!`, 'success');
    }
};

module.exports = () => {
    CO(function *() {
        let {type} = PROGRAM.args[0];

        if (!type) {
            LOG(` The \`${type}\` does not support!`);
        }

        if (type in ACTION) {
            let name = yield PROMPT(`Remove ${type} name: `);;

            if (!name) {
                LOG(`The type \`${type}\` name is required!`);
            }

            let originName = name;

            name = STRING(name).dasherize().s;

            let alias = STRING(name).camelize().s;

            const ENV = GET_ENV('page', name) || {};

            try {
                ACTION[type]({
                    ENV,
                    type, name, alias, originName
                });
            }
            catch (e) {
                LOG(`${e}`);
            }
        }
        else {
            LOG(`The type \`${type}\` does not support!`);
        }
    });
};
