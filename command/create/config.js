/**
 * @file config
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2016/10/11
 */

'use strict';

module.exports = function(type, extra) {
    let option = extra || {};

    return {
        component: [
            ['index.js'],
            ['package.json'],
            ['README.md'],
            [(option.input ? 'input/vue' : 'vue'), 'vue']
        ],
        page: [
            ['js'],
            ['less'],
            ['tpl']
        ]
    }[type]
};
