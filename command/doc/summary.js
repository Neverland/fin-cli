/**
 * @file documentation.js
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2016/11/21
 */

'use strict';

const PATH = require('path');
const FS = require('fs');
const EXEC = require('child_process').execSync;

const CHALK = require('chalk');
const ETPL = require('etpl');

const DOC_DIR = PATH.join('./', 'doc');
const DOC_SOURCE = PATH.join(DOC_DIR, '/source');


let summary = {};
module.exports = fileTree => {

    fileTree.map(item => {
        let path = item.split('/')
            .slice(1, -1);
        let key = path[0];
        if (!summary[key]) {
            summary[key] = [];
        }
        let value = path.slice(1);

        value.length && summary[key].push(value);

        return path;
    });

    let template = FS.readFileSync(__dirname + '/doc.html', 'utf8');
    let render = ETPL.compile(template);
    let text = render({data: summary, url: 'gitbook/components/'});

    text = text.replace(/^[\s\t]*(\r\n|\n|\r)/gm,'');

    try {
        EXEC(`cp ./README.md ${DOC_SOURCE}/README.md`);
    }
    catch(e) {
        console.log(e);
    }

    FS.writeFileSync(`${DOC_SOURCE}/SUMMARY.md`, text);

    console.log(CHALK.green('\n √ Generation summary completed!'));
};
