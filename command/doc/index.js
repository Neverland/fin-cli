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
const SPAWN = require('child_process').spawn;
const OS = require('os');

const PROGRAM = require('commander');
const CO = require('co');
const RUN = require('exec-cmd');

const PROGRESS = require('../../util/progress')();

const LOG = require('../../util/log');

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
        .then(() => {
            FS.writeFileSync(path, text);
        })
        .catch(error => {
            LOG(`${error}!`);
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
    catch (error) {
        LOG(`${error.message}`, 'red');
    }

    let command = [];

    command.push(`cd ${DOC_SOURCE}`);
    command.push('gitbook build');

    EXEC(command.join(' && '), (error, stdout, stderr) => {
        if (error) {
            LOG(`${error[0]}`);
        }

        console.log(stdout, stderr);

        PROGRESS.clear();
        LOG('Generation documentation completed!', 'success');
    });
};

module.exports = () => {
    CO(function *() {
        if (!FS.existsSync(TARGET_DIR)) {
            LOG('The `components` directory is not exist!');
        }

        let args = PROGRAM.args[0];
        let gitbook = args.gitbook;

        // create doc!

        PROGRESS.set('text', 'Start generating...')
            .start();

        if (gitbook) {
            RUN('gitbook', ['-h'])
                .catch(error => {
                    let message = 'The gitbook command is not exit! \n Please run `npm i gitbook-cli -g` !';

                    console.log(error);

                    LOG(message);
                });
            createGitBook();
        }

        let server = args.server;

        if (server) {
            let commmand = OS.platform() === 'win32'
                ? `${__dirname}/doc.cmd`
                : ['sh', [`${__dirname}/doc.sh`]];

            let gitbookServer = SPAWN(...commmand);

            gitbookServer.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            gitbookServer.stderr.on('data', (data) => {
                console.log(data.toString());
            });
        }
    });
};
