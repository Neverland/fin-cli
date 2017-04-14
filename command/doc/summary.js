/**
 * @file index.js
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/11/21
 */

'use strict';

const PATH = require('path');
const FS = require('fs');
const RUN = require('exec-cmd');

const LOG = require('../../util/log');

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

    let path = PATH.join(__dirname, '../../template/doc/gitbook.html');
    let template = FS.readFileSync(path, 'utf8');
    let render = ETPL.compile(template);
    let text = render({data: summary, url: 'gitbook/components/'});

    text = text.replace(/^[\s\t]*(\r\n|\n|\r)/gm,'');

    RUN('cp', ['./README.md', `${DOC_SOURCE}/README.md`])
        .catch(response => {
            console.log(response[0]);
            process.exit();
        });

    FS.writeFileSync(`${DOC_SOURCE}/SUMMARY.md`, text);

    LOG('√ Generation summary completed!', 'green');
    LOG('Wait for a moment! Doc generating...', 'gray');
};
