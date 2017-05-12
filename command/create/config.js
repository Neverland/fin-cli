/**
 * @file index.js
 * @author ienix(enix@foxmail.com)
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
        widget: [
            ['js'],
            ['less'],
            ['tpl']
        ],
        page: [
            ['js'],
            ['less'],
            ['tpl']
        ],
        webpage: [
            ['js'],
            ['less'],
            ['tpl']
        ],
        index: [
            ['model.js'],
            ['js'],
            ['less'],
            ['tpl']
        ]
    }[type]
};
