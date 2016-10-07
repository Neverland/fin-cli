/**
 * @file component
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/10/7
 */

'use strict';

const FS = require('fs');
const PATH = require('path');

const ETPL = require('etpl');

const CHALK = require('chalk');

ETPL.config( {
    variableOpen: '<%',
    variableClose: '%>'
});

let readFile = (fileName) => {
    let path = PATH.resolve(__dirname + '/../../template/component');
    let file = FS.readFileSync(`${path}/${fileName}`, {encoding: 'utf8', flag: 'r'})
                .toString();

    return file;
};

module.exports = data => {
    let fileType = [
        'index.js',
        'package.json',
        'README.md',
        'vue'
    ];
    let path = process.cwd() + '/' + data.component;

    if (FS.existsSync(data.component)) {
        console.log(CHALK.bold.red(`\n × \`${data.component}\` is already exit!`));
        process.exit();
    }

    FS.mkdirSync(path);

    data = Object.assign({}, data, {date: (new Date()).toLocaleDateString()});

    fileType.forEach(item => {
        let file = readFile(item);
        let render = ETPL.compile(file);
        let text = render(data);
        let fileName = item;

        if (item === 'vue') {
            fileName = `${data.component}.vue`;
        }

        FS.writeFileSync(path + '/' + fileName, text, {encoding: 'utf8', flag: 'w'});
    });

    console.log(CHALK.green('\n √ Generation completed!'));
    process.exit();
};
