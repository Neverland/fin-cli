 /**
 * @file user
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/10/12
 */

'use strict';

const FS = require('fs');
const PATH = require('path');

const CHALK = require('chalk');
const HOME_PATH = require('os').homedir();

const FIN_RC_LOCAL_DATA_PATH = PATH.join(HOME_PATH, '/.finrc');

const DEFAULT_RC_DATA = {
    email: 'fin',
    author: 'fin',
    project: {
        name: 'fin',
        id: '-fin-'
    }
};

exports.path = HOME_PATH;

let getRcData = function () {
    let data = DEFAULT_RC_DATA;

    try {
        let text = FS.readFileSync(FIN_RC_LOCAL_DATA_PATH, {encoding: 'utf8', flag: 'r'});

        data = JSON.parse(text);
    }
    catch (e) {}

    return data
};

exports.finrc = FIN_RC_LOCAL_DATA_PATH;

exports.getRcData = getRcData;

exports.createRC = data => {
    if (!data) {
        data = DEFAULT_RC_DATA;
    }

    FS.writeFileSync(FIN_RC_LOCAL_DATA_PATH, JSON.stringify(data), {encoding: 'utf8', flag: 'w'});

    console.log(CHALK.green('\n √ User information configure completed!'));
};

exports.upgradeRC = (data = {}) => {
    let oldUserData = getRcData();
    let newUserData = Object.assign({}, DEFAULT_RC_DATA, oldUserData, data);

    FS.writeFileSync(FIN_RC_LOCAL_DATA_PATH, JSON.stringify(newUserData), {encoding: 'utf8', flag: 'w'});
};
