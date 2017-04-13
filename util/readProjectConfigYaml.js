/**
 * @file readProjectConfigYaml
 * @author ienix(ienx@foxmail.com)
 *
 * @since 2017/4/13
 */

const FS = require('fs');
const PATH = require('path');

const YAML = require('js-yaml');

module.exports = (root) => {
    const ymlPath = PATH.join(root, 'index.yml');

    if (!FS.existsSync(ymlPath)) {
        console.log(CHALK.bold.red('\n × `index.yml` does not exist!'));
        process.exit();
    }

    return YAML.safeLoad(FS.readFileSync(ymlPath, 'utf8'));
};
