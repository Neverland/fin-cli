#!/usr/bin/env node --harmony
/**
 * @file index.js
 * @author ienix(enix@foxmail.com)
 *
 * @since 2016/9/29
 */

'use strict';

process.env.NODE_PATH = __dirname + '/../node_modules/';

const FS = require('fs');

const PROGRAM = require('commander');
const USER = require('../command/user');

if (!FS.existsSync(USER.finrc)) {
    USER.createRC();
}

PROGRAM
    .version(require('../package').version );

PROGRAM
    .usage('[option] [...value]');

PROGRAM
    .command('init')
    .option('-u, --uri <string>', 'icode Uri')
    .option('-p, --path <string>', 'Your project icode patch `/baidu/${path}`')
    .option('-t, --type <string>', 'NORMAL: FE + PHP; NODE: Full stack；Default: `NORMAL`')
    .description('Generate a new fin project')
    .alias('i')
    .action(() => {
        require('../command/init')();
    });

PROGRAM
    .command('create')
    .option('-t, --type <string>', 'create')
    .option('-T, --title <string>', 'page title')
    .option('-x, --extra <string>', 'page|webpage')
    .description('Generate a new fin unit [component, page, batch, index, widget, webpage ...]')
    .alias('c')
    .action(() => {
        require('../command/create')();
    });

PROGRAM
    .command('config')
    .option('-e, --email <string>', 'email prefix')
    .option('-a, --author <string>', 'author name')
    .option('-N, --pName <string>', 'project name(`local work space` or `git dir`)')
    .option('-I, --pId <string>', 'project id')
    .option('-l, --list [boolean]', 'list config')
    .description('Generate fin user config')
    .alias('C')
    .action(() => {
        require('../command/config')();
    });

PROGRAM
    .command('documentation')
    .description('Generate fin documentation')
    .option('-g, --gitbook [boolean]', 'create gitbook doc')
    .option('-s, --server [boolean]', 'server start')
    .alias('d')
    .action(() => {
        require('../command/doc/index')();
    });

PROGRAM
    .command('live')
    .description('Browser live load')
    .option('-p, --port <string>', 'monitor port `default 8080`')
    .option('-u, --url <string>', 'url `default localhost`')
    .option('-d, --dir <string>', 'watch directory')
    .alias('l')
    .action(() => {
        require('../command/live')();
    });

PROGRAM
    .command('format')
    .description('Format a vue file')
    .option('-t, --type <string>', '[vue|...]')
    .option('-p, --path <string>', 'directory path')
    .alias('f')
    .action(() => {
        require('../command/format')();
    });

PROGRAM
    .command('remove')
    .description('Remove a fin unit')
    .option('-t, --type <string>', '[page|...]')
    .option('-n, --name <string>', 'unit name')
    .alias('r')
    .action(() => {
        require('../command/remove')();
    });

PROGRAM
    .command('proxy')
    .description('Http(s) proxy')
    .alias('p')
    .action(() => {
        require('../command/proxy')();
    });

PROGRAM.parse(process.argv);

if (!PROGRAM.args.length) {
    PROGRAM.help();
}
