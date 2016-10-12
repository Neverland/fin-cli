/**
 * @file user
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2016/10/12
 */

'use strict';

const PATH = require('path');

let USER_DATA_PATH = PATH.resolve(__dirname + '/../config/data.json');

exports.path = USER_DATA_PATH;

exports.data = require(USER_DATA_PATH);
