/**
 * @file index.js
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/11/21
 */

'use strict';

const PATH = require('path');
const FS = require('fs');
const EXEC = require('child_process').exec;
const OS = require('os');

const PROGRAM = require('commander');
const CO = require('co');
const RUN = require('exec-cmd');

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

    RUN('mkdir', ['-p', dir])
        .then(response => {
            FS.writeFileSync(path, text);
        })
        .catch(error => {
            console.log(CHALK.bold.red(`\n × ${error}!`));
            process.exit();
        });
};
let createGitBook = () => {
    if (FS.existsSync(DOC_DIR)) {
        RUN('rm', ['-rf', 'DOC_DIR']);
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
                console.log(CHALK.bold.red(`\n × ${error[0]}`));
                process.exit();
            }

            console.log(stdout, stderr);
            console.log(CHALK.green('\n √ Generation documentation completed!'));
            process.exit();
        });
};

module.exports = () => {
    CO(function *() {
        if (!FS.existsSync(TARGET_DIR)) {
            console.log(CHALK.bold.red('\n × The `components` directory is not exist!'));
            process.exit();
        }

        let args = PROGRAM.args[0];
        let gitbook = args.gitbook;

        // create doc!
        if (gitbook) {
            RUN('gitbook', ['-h'])
                .catch(error => {
                    let message = '\n × The gitbook command is not exit! \n Please run `npm i gitbook-cli -g` !';

                    console.log(error);
                    console.log(CHALK.green(message));
                    process.exit();
                });
            createGitBook();
        }

        let server = args.server;

        if (server) {
            let message = OS.platform() === 'win32'
                ? `${__dirname}/doc.cmd`
                : `sh ${__dirname}/doc.sh`;


            console.log( ''
                + CHALK.bold.red('\n × Unexpected exception! Plz run this command on Terminal!')
                + CHALK.white(` \n\n ${message}`)
            );
            process.exit();
        }
    });
};
