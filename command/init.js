/**
 * @file init
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/9/29
 */

'use strict';

const PATH = require('path');

const EXEC = require('child_process').exec;

const PROGRAM = require('commander');
const CO = require('co');
const PROMPT = require('co-prompt');

const LOG = require('../util/log');

const USER = require('./user');

let initProjectName = function (name) {
    let data = USER.getRcData();

    data.project.name = name;
    USER.upgradeRC(data);
};

module.exports = () => {
    CO(function *() {
        let args = PROGRAM.args[0];
        let uri = args.uri;
        let pathName = args.path;

        if (!uri) {
            LOG('`uri` does not exist!');
        }

        const ROOT_URI = `ssh://git@${uri}:8235`;

        let projectName = yield PROMPT('Project name: ');

        if (!projectName) {
            LOG('`Project` name does not exist!');
        }

        // record project name
        initProjectName(projectName);

        LOG('Start generating... \n', 'yellow');

        let cloneInit = () => {
            let command = `git clone ${ROOT_URI}/baidu/finland/init ${projectName}`;

            EXEC(command, (error, stdout, stderr) => {
                if (error) {
                    LOG(`Command failed: ${error.cmd}`, 'fail');
                }
                console.log(stderr);

                npmInstall();
            });
        };

        let npmInstall = () => {
            LOG('\n npm install... \n', 'yellow');

            EXEC(`cd ${projectName} && npm install --production`,  (error, stdout, stderr) => {
                if (error) {
                    LOG(`${error}`, 'fail');
                }
                console.log(stdout, stderr);

                addComponent();
            });
        };

        let addComponent = () => {
            let modules = [
                ['FinanceGeneral', 'fin-fg'],
                ['UserInterface', 'fin-ui'],
                ['RiskManagement', 'fin-rm'],
                ['ResultState', 'fin-rs'],
                ['InstitutionServices', 'fin-is'],
                ['FinanceKernel', 'fin-fk'],
                ['CustomerServices', 'fin-cs']
            ];
            let command = [];

            LOG('\n add submodule... \n', 'yellow');

            modules.forEach(item => {
                command.push(`git submodule add ${ROOT_URI}/baidu/finland/${item[0]} components/${item[1]}`);
            });

            command = `cd ${projectName} && ${command.join(' && ')} && git remote rm origin`;

            EXEC(command, (error, stdout, stderr) => {
                if (error) {
                    LOG(`${error}`, 'fail');
                }
                console.log(stdout, stderr);


                if (pathName) {
                    createBuild();
                }
                else {
                    LOG('Generation completed!', 'success');
                }

            });
        };

        let createBuild = () => {
            let command = [];
            let purePath = PATH.join(pathName.slice(1));

            const ORIGIN_URL = ROOT_URI + PATH.join(pathName);

            let publishCommand = `echo 'BUILD_SUBMITTER -u . -x -e FIS -m ${purePath} -c "cd ${purePath} && sh`;
            command.push(`cd ${projectName}`);
            command.push(`${publishCommand} build.sh prod"' > BCLOUD`);
            command.push(`${publishCommand} build.sh qa"' > BCLOUD.qa`);
            command.push('git add BCLOUD BCLOUD.qa');
            command.push('git commit -m "init finland sdk"');

            LOG('\n create build file... \n', 'yellow');

            EXEC(command.join(' && '), (error, stdout, stderr) => {
                if (error) {
                    LOG(`${error}`, 'fail');
                }
                console.log(stdout, stderr);

                if (pathName) {
                    pushToURepertory(purePath, ORIGIN_URL);
                }
                else {
                    LOG('Generation completed!', 'success');
                }
            });
        };

        let pushToURepertory = (purePath, ORIGIN_URL) => {
            let command = [];

            command.push(`cd ${projectName}`);
            command.push(`git remote add origin ${ORIGIN_URL}`);
            command.push(`scp -p -P 8235 git@${uri}:hooks/commit-msg .git/hooks/`);
            command.push('git push -u origin --all');

            EXEC(command.join(' && '), (error, stdout, stderr) => {
                if (error) {
                    LOG(`${error}`, 'fail');
                }
                console.log(stdout, stderr);

                LOG('Generation completed!', 'success');
            });
        };

        cloneInit();
    })
};
