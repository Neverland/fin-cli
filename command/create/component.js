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
    console.log(1234);
    let path = __dirname + '/../template/component/';
    console.log(`${path}${fileName}`);
    let file = fs.readFileSync(`${path}${fileName}`, 'utf8').toString();

    return file;
};

module.exports = data => {
    data = {component: 'text', autho: 'text', email: 'email@text.com'};
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

    fileType.forEach(item => {
        let file = readFile(item);
        let render = ETPL.compile(file);
        let text = render(data);
        let fileName = item;

        if (item === 'vue') {
            fileName = `${data.component}.vue`;
        }

        fs.writeFileSync(fileName, text, 'utf8');
    });

    console.log(CHALK.green('\n √ Generation completed!'));
    process.exit();
};
