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
    let path = PATH.join(__dirname, '/../../template/', type);

    let file = FS.readFileSync(`${path}/${fileName}`, {encoding: 'utf8', flag: 'r'})
        .toString();

    return file;
};

module.exports = (type, data) => {
    let fileType = UNIT_TYPE(type);
    let path = PATH.join(process.cwd(), '/', data.name);

    if (FS.existsSync(data.name)) {
        console.log(CHALK.bold.red(`\n × \`${data.name}\` is already exit!`));
        process.exit();
    }

    FS.mkdirSync(path);

    data = Object.assign({}, data, {date: (new Date()).toLocaleDateString()});

    fileType.forEach(item => {
        let fileName = item[0];
        let file = readFile(type, item[0]);
        let render = ETPL.compile(file);
        let text = render(data);
        let extension = item[1];

        // [vue, vue]
        if (extension) {
            fileName = `${data.name}.${extension}`;
        }
        //['index.js']
        else if (PATH.extname(fileName)) {
            fileName = `${item}`;
        }
        // ['tpl', 'vue']
        else {
            fileName = `${data.name}.${item}`;
        }

        try {
            FS.writeFileSync(
                PATH.join(path, '/', fileName),
                text, {encoding: 'utf8', flag: 'w'}
            );
        }
        catch (error) {
            console.log(CHALK.green('\n × Generation failure!'));
            process.exit();
        }
    });

    console.log(CHALK.green('\n √ Generation completed!'));
    process.exit();
};
