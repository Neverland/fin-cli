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

const PROGRESS = require('../util/progress')();

const LOG = require('../util/log');

const USER = require('./user');

let initProjectName = function (name) {
    let data = USER.getRcData();

    data.project.name = name;
    USER.upgradeRC(data);
};

module.exports = () => {
    CO(function *() {
        let {uri, path} = PROGRAM.args[0];
        let pathName = path;

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

            PROGRESS.set('text', 'Finland SDK installing!')
                .start();

            EXEC(command, (error, stdout, stderr) => {
                if (error) {
                    LOG(`Command failed: ${error.cmd}`, 'fail');
                }
                console.log(`\n\n ${stdout} \n`, `\n\n ${stderr} \n\n`);

                PROGRESS.succeed('Finland sdk installed! \n')
                    .clear();

                npmInstall();
            });
        };

        let npmInstall = () => {

            PROGRESS.set('text', 'Npm install...')
                .start();

            EXEC(`cd ${projectName} && npm install --production`,  (error, stdout, stderr) => {
                if (error) {
                    LOG(`${error}`, 'fail');
                }
                console.log(`\n\n ${stdout} \n`, `\n\n ${stderr} \n\n`);

                PROGRESS.succeed('Node modules installed! \n')
                    .clear();

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

            // LOG('\n add submodule... \n', 'yellow');

            PROGRESS.set('text', 'Add git submodule...')
                .start();

            modules.forEach(item => {
                command.push(`git submodule add ${ROOT_URI}/baidu/finland/${item[0]} components/${item[1]}`);
            });

            command = `cd ${projectName} && ${command.join(' && ')} && git remote rm origin`;

            EXEC(command, (error, stdout, stderr) => {
                if (error) {
                    LOG(`${error}`, 'fail');
                }
                console.log(`\n\n ${stdout} \n`, `\n\n ${stderr} \n\n`);

                if (pathName) {
                    createBuild();
                }
                else {
                    LOG('Generation completed! \n', 'success');
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

            PROGRESS.set('text', 'Create build file... \n')
                .start();

            EXEC(command.join(' && '), (error, stdout, stderr) => {
                if (error) {
                    LOG(`${error}`, 'fail');
                }
                console.log(`\n\n ${stdout} \n`, `\n\n ${stderr} \n\n`);

                if (pathName) {
                    pushToURepertory(purePath, ORIGIN_URL);
                }
                else {
                    LOG('Generation completed! \n', 'success');
                }
            });
        };

        let pushToURepertory = (purePath, ORIGIN_URL) => {
            let command = [];

            command.push(`cd ${projectName}`);
            command.push(`git remote add origin ${ORIGIN_URL}`);
            command.push(`scp -p -P 8235 git@${uri}:hooks/commit-msg .git/hooks/`);
            command.push('git push -u origin --all');

            PROGRESS.set('text', 'Push code to repository...')
                .start();

            EXEC(command.join(' && '), (error, stdout, stderr) => {
                if (error) {
                    LOG(`${error}`, 'fail');
                }
                console.log(`\n\n ${stdout} \n`, `\n\n ${stderr} \n\n`);

                LOG('Generation completed! \n', 'success');
            });
        };

        cloneInit();
    })
};
