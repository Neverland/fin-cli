/**
 * @file init
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/9/29
 */

'use strict';

const EXEC = require('child_process').exec;

const PROGRAM = require('commander');
const CO = require('co');
const PROMPT = require('co-prompt');

const CHALK = require('chalk');

module.exports = () => {
    CO(function *() {
        let args = PROGRAM.args[0];
        let uri = args.uri;
        let pathName = args.path;

        if (!uri) {
            console.log(CHALK.bold.red('\n × `uri` does not exit!'));
            process.exit();
        }

        const ROOT_URI = `ssh://git@${uri}:8235`;

        let projectName = yield PROMPT('Project name: ');

        if (!projectName) {
            console.log(CHALK.bold.red('\n × `Project` name does not exit!'));
            process.exit();
        }

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
                    pushToURepertory();
                }
            });
        };

        let pushToURepertory = () => {
            let command = [];

            command.push(`cd ${projectName}`);
            command.push(`git remote add origin ${ROOT_URI}${pathName}`);
            command.push (`scp -p -P 8235 git@${uri}:hooks/commit-msg .git/hooks/`);
            command.push ('git push -u origin --all');

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
