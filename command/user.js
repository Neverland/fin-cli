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

const FIN_RC = PATH.join(HOME_PATH, '/.finrc');

let rcData = {
    email: 'fin',
    author: 'fin',
    project: {
        name: 'fin',
        id: '-fin-'
    }
};

exports.path = HOME_PATH;

exports.getRcData = function () {
    let data = rcData;

    try {
        let text = FS.readFileSync(FIN_RC, {encoding: 'utf8', flag: 'r'});

        data = JSON.parse(text);
    }
    catch (e) {}

    return data
};

exports.finrc = FIN_RC;

exports.createRC = data => {
    if (!data) {
        data = rcData;
    }

    FS.writeFileSync(FIN_RC, JSON.stringify(data), {encoding: 'utf8', flag: 'w'});

    console.log(CHALK.green('\n √ User information configure completed!'));
};
