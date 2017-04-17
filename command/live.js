/**
 * @file live
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/1
 */

// const HOME_PATH = require('os').homedir();
// const PATH = require('path');

const PROGRAM = require('commander');
const BS = require('browser-sync').create();

module.exports = () => {
    let {url = 'http://localhost', port = '8080', dir = ''} = PROGRAM.args[0];
    // TODO: need path?
    // let path = PATH.join(HOME_PATH, '/', '.fis3-tmp');
    let files = ['**'];

    if (dir) {
        files.push(dir);
    }

    BS.init({
        proxy: {
            target: url + ':' + port,
            ws: true
        },
        files: files,
        reloadDelay: 500
    });
};
