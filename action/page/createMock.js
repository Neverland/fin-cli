/**
 * @file create mock
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/13
 */

const PATH = require('path');
const FS = require('fs');

const FSE = require('fs-extra');

module.exports = (ENV) => {
    let {
        PROJECT_NAME,
        ROOT_DIR,
        MODULE_NAME,
        TRUE_PATH,
        NAME
    } = ENV;

    let filePath = PATH.join(ROOT_DIR, PROJECT_NAME, MODULE_NAME, 'test/page', TRUE_PATH, NAME);
    let file = `${filePath}/${NAME}.php`;
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
