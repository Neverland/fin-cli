/**
 * @file readProjectConfigYaml
 * @author ienix(ienx@foxmail.com)
 *
 * @since 2017/4/13
 */

const FS = require('fs');
const PATH = require('path');

const YAML = require('js-yaml');

const LOG = require('./log');

module.exports = (root) => {
    const ymlPath = PATH.join(root, 'index.yml');

    if (!FS.existsSync(ymlPath)) {
        LOG('`index.yml` does not exist!', 'fail');
    }

    return YAML.safeLoad(FS.readFileSync(ymlPath, 'utf8'));
};
