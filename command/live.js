/**
 * @file live
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/1
 */

const HOME_PATH = require('os').homedir();
const PATH = require('path');

const PROGRAM = require('commander');
const BS = require('browser-sync').create();

module.exports = () => {
    let {url = 'http://localhost', port = '8080'} = PROGRAM.args[0];
    let path = PATH.join(HOME_PATH, '/', '.fis3-tmp');

    BS.init({
        proxy: {
            target: url + ':' + port,
            ws: true
        },
        files: [path],
        reloadDelay: 1000
    });
};
