/**
 * @file create mock
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/13
 */

const PATH = require('path');
const FS = require('fs');

const FSE = require('fs-extra');
const STRING = require('string');

const LOG = require('../../util/log');

module.exports = (data) => {
    let {
        PROJECT_NAME,
        ROOT_DIR,
        MODULE_NAME,
        TRUE_PATH,
        NAME
    } = data.ENV;

    let filePath = PATH.join(ROOT_DIR, PROJECT_NAME, MODULE_NAME, 'test/page', TRUE_PATH, NAME);
    let file = `${filePath}/${NAME}.php`;

    if (FS.existsSync(file)) {

        LOG(`${STRING(data.type).capitalize().s} \`${data.name}\`'s mock is already exist!`, 'red');
        return false;
    }

    let text = `<?php
        require_once  realpath(dirname(__FILE__) . '/../../') . '/public.php';
        $fis_data = array_merge($publicTestData, array(
            data => array(

            ),
        ));
        `;

    if (!FS.existsSync(filePath)) {
        FSE.ensureDirSync(filePath);
    }

    try {
        FS.writeFileSync(
            file,
            text, {encoding: 'utf8', flag: 'w'}
        );
    }
    catch (error) {
        console.log(error);
    }
};
