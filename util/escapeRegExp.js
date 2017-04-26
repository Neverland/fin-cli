/**
 * @file escapeRegExp
 * @author ienix(guoaimin01@baidu.com)
 *
 * @since 2017/4/26
 */

module.exports = string => {
    return string.replace(/[$.*+?()\|\[\]\\^]/g, char => `\\${char}`);
};
