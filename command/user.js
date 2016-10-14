/**
 * @file user
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2016/10/12
 */

'use strict';

const FS = require('fs');

const HOME_PATH = require('os-homedir')();
const FIN_RC = HOME_PATH + '/.finrc';
let rcData = {email: 'fin', author: 'fin'};

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
};
