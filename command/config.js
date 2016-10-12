/**
 * @file config
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2016/10/12
 */

'use strict';

const FS = require('fs');
const PATH = require('path');

const PROGRAM = require('commander');

const CHALK = require('chalk');

const USER = require('./user');

let config = USER.data;
let path = USER.path;

module.exports = () => {
    let param = PROGRAM.args[0];

    // FIXME: 不能使用解构， node版本问题？
    if  (param.author) {
        config.author = param.author;
    }

    if  (param.email) {
        config.email = param.email;
    }

    FS.writeFileSync(path, JSON.stringify(config), {encoding: 'utf8', flag: 'w'});

    console.log(CHALK.green('\n √ Generation completed!'));
    process.exit();
};
