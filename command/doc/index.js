/**
 * @file documentation.js
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2016/11/21
 */

'use strict';

const PATH = require('path');
const FS = require('fs');
const EXEC_SYNC = require('child_process').execSync;
const EXEC = require('child_process').exec;

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
        EXEC_SYNC(`mkdir -p ${dir}`);
        FS.writeFileSync(path, text);
    }
    catch (e) {
        console.log(e);
    }
};

module.exports = () => {
    CO(function *() {

        try {
            EXEC_SYNC('gitbook -h');
        }
        catch (e) {
            console.log(CHALK.green('\n × The gitbook is not exit! \n Please run `npm i gitbook-cli -g` !'));
            process.exit();
        }


        if (!FS.existsSync(TARGET_DIR)) {
            console.log(CHALK.bold.red(`\n × The components directory is not exist!`));
            process.exit();
        }

        let args = PROGRAM.args[0];
        let create = args.create;
        let server = args.server;
        let port = args.port || 4000;

        // create doc!
        if (create) {

            if (FS.existsSync(DOC_DIR)) {
                EXEC_SYNC(`rm -rf ${DOC_DIR}`);
            }

            try {
                createGitBookCopy();
                CREATE_SUMMARY(fileTree);
            }
            catch (e) {
                console.log(e);
            }

            let command = [];

            command.push(`cd ${DOC_SOURCE}`);
            command.push('gitbook build');

            EXEC(command.join(' && '), (error, stdout, stderr) => {

                if (error) {
                    console.log(CHALK.bold.red(`\n × ${error}`));
                    process.exit();
                }

                console.log(stdout, stderr);

                console.log(CHALK.green('\n √ Generation completed!'));
                process.exit();
            });

        }

        if (server) {
            let command = [];

            command.push(`cd ${DOC_SOURCE}`);
            command.push(`gitbook serve -p ${port}`);

            console.log(CHALK.bold.yellow(`\n请粘贴该命令至Teminal 运行\n sh ${__dirname}/doc.sh`));
            process.exit();

            EXEC(command.join(' && '), (error, stdout, stderr) => {

                if (error) {
                    console.log(CHALK.bold.red(`\n × ${error}`));
                    process.exit();
                }

                console.log(stdout, stderr);

                console.log(CHALK.green('\n √ Server start!'));
                process.exit();
            });
        }
    });
};
