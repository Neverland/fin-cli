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

const PROGRAM = require('commander');
const CO = require('co');

const CHALK = require('chalk');

const ROOT_DIR = 'components';
const TARGET_DIR = PATH.join('./', ROOT_DIR);
const DOC_DIR = PATH.join('./', 'doc');
const DOC_SOURCE = PATH.join(DOC_DIR, '/source');
const GITBOOK_DIR = PATH.join(DOC_SOURCE, '/gitbook');

const CREATE_SUMMARY = require('./summary');

let fileTree = [];
let createGitBookCopy = path => {
    path = path || TARGET_DIR;

    FS.readdirSync(path)
        .filter(item => !/^\./i.test(item))
        .sort()
        .forEach(item => {
            let target = PATH.join(path, item);
            let isDir = false;

            try {
                isDir = FS.statSync(target).isDirectory();
            }
            catch(e) {}

            if (isDir) {

                createGitBookCopy(target);
            }
            else if (/.+\.md$/gi.test(target)) {

                fileTree.push(target);
                moveFile(target);

            }
        });
};
let moveFile = (target) => {
    let path = PATH.join(GITBOOK_DIR, '/', target);
    let text = FS.readFileSync(target);
    let dir = path.slice(0, path.lastIndexOf('/'));

    try {
        EXEC(`mkdir -p ${dir}`);
        FS.writeFileSync(path, text);
    }
    catch (e) {
        // console.log(e);
    }
};

module.exports = () => {
    CO(function *() {

        if (!FS.existsSync(TARGET_DIR)) {
            console.log(CHALK.bold.red(`\n × The components directory is not exit!`));
            process.exit();
        }

        let args = PROGRAM.args[0];
        let create = args.create;

        // create doc!
        if (create) {
            if (FS.existsSync(DOC_DIR)) {
                EXEC(`rm -rf ${DOC_DIR}`);
            }

            try {
                createGitBookCopy();
                CREATE_SUMMARY(fileTree);
            }
            catch (e) {
                // console.log(e);
            }

            console.log(CHALK.green('\n √ Collection documentation complete!'));
            process.exit();
        }
    });
};
