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

const CHALK = require('chalk');

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
            console.log(CHALK.bold.red('\n × `uri` does not exist!'));
            process.exit();
        }

        const ROOT_URI = `ssh://git@${uri}:8235`;

        let projectName = yield PROMPT('Project name: ');

        if (!projectName) {
            console.log(CHALK.bold.red('\n × `Project` name does not exist!'));
            process.exit();
        }

        // record project name
        initProjectName(projectName);

        console.log(CHALK.white('\n Start generating...'));

        let cloneInit = () => {
            let command = `git clone ${ROOT_URI}/baidu/finland/init ${projectName}`;

            EXEC(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(CHALK.bold.red(`\n × Command failed: ${error.cmd}`));
                    process.exit();
                }
                console.log(stderr);

                npmInstall();
            });
        };

        let npmInstall = () => {
            console.log(CHALK.bold.yellow(`\n npm install... \n`));

            EXEC(`cd ${projectName} && npm install --production`,  (error, stdout, stderr) => {
                if (error) {
                    console.log(CHALK.bold.red(`\n × ${error}`));
                    process.exit();
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

            console.log(CHALK.bold.yellow(`\n add submodule... \n`));

            modules.forEach(item => {
                command.push(`git submodule add ${ROOT_URI}/baidu/finland/${item[0]} components/${item[1]}`);
            });

            command = `cd ${projectName} && ${command.join(' && ')} && git remote rm origin`;

            EXEC(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(CHALK.bold.red(`\n × ${error}`));
                    process.exit();
                }
                console.log(stdout, stderr);


                if (pathName) {
                    createBuild();
                }
                else {
                    console.log(CHALK.green('\n √ Generation completed!'));
                    process.exit();
                }

            });
        };

        let createBuild = () => {
            let command = [];
            let purePath = PATH.join(pathName.slice(1));

            const ORIGIN_URL = ROOT_URI + PATH.join(pathName);

            let publishCommand = `echo 'BUILD_SUBMITTER -u . -x -e FIS -m ${purePath} -c "cd ${purePath} && sh`;
            command.push(`cd ${projectName}`);
            command.push(`${publishCommand} build.sh"' > BCLOUD`);
            command.push(`${publishCommand} build-qa.sh"' > BCLOUD.qa`);
            command.push('git add BCLOUD');
            command.push('git add BCLOUD.qa');
            command.push('git commit -m "init finland"');

            console.log(CHALK.bold.yellow(`\n create build file... \n`));

            EXEC(command.join(' && '), (error, stdout, stderr) => {
                if (error) {
                    console.log(CHALK.bold.red(`\n × ${error}`));
                    process.exit();
                }
                console.log(stdout, stderr);

                if (pathName) {
                    pushToURepertory(purePath, ORIGIN_URL);
                }
                else {
                    console.log(CHALK.green('\n √ Generation completed!'));
                    process.exit();
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
                    console.log(CHALK.bold.red(`\n × ${error}`));
                    process.exit();
                }
                console.log(stdout, stderr);

                console.log(CHALK.green('\n √ Generation completed!'));
                process.exit();
            });
        };

        cloneInit();
    })
};
