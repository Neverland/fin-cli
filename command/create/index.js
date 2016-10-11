/**
 * @file index.js
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2016/10/11
 */

'use strict';

const FS = require('fs');
const PATH = require('path');

const ETPL = require('etpl');

const CHALK = require('chalk');

const UNIT_TYPE = require('./config');

ETPL.config( {
    variableOpen: '<%',
    variableClose: '%>'
});

let readFile = (type, fileName) => {
    let path = PATH.resolve(`${__dirname}/../../template/${type}`);
    let file = FS.readFileSync(`${path}/${fileName}`, {encoding: 'utf8', flag: 'r'})
        .toString();

    return file;
};

module.exports = (type, data) => {
    let fileType = UNIT_TYPE[type];
    let path = process.cwd() + '/' + data.name;

    if (FS.existsSync(data.component)) {
        console.log(CHALK.bold.red(`\n × \`${data.component}\` is already exit!`));
        process.exit();
    }

    FS.mkdirSync(path);

    data = Object.assign({}, data, {date: (new Date()).toLocaleDateString()});

    fileType.forEach(item => {
        let file = readFile(type, item);
        let render = ETPL.compile(file);
        let text = render(data);
        let fileName = item;

        if (fileName.indexOf('.') === -1) {
            fileName = `${data.name}.${item}`;
        }

        FS.writeFileSync(path + '/' + fileName, text, {encoding: 'utf8', flag: 'w'});
    });

    console.log(CHALK.green('\n √ Generation completed!'));
    process.exit();
};
