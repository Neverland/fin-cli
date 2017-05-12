/**
 * @file format.js
 * @author tangciwei(tangciwei@qq.com)
 *
 * @since 2017-05-12
 */

const PROGRAM = require('commander');
const BEAUTIFY_VUE = require('beautify-vue');

module.exports = () => {
    let {type = 'vue', path} = PROGRAM.args[0];

    if ('vue' === type) {
        BEAUTIFY_VUE(path);
    }
}
