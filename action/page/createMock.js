/**
 * @file create mock
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/13
 */

const FS = require('fs');

const FSE = require('fs-extra');
const STRING = require('string');

const LOG = require('../../util/log');

const PAGE = require('./page');

module.exports = (data) => {
    let {
        MODULE_NAME,
    } = data.ENV;

    if (!MODULE_NAME) {
        return false;
    }

    let {file, filePath} = PAGE.getMockPath(data);

    if (FS.existsSync(file)) {

        LOG(`${STRING(data.type).capitalize().s} \`${data.name}\`'s mock is already exist!`, 'gray');
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
        LOG('${error.message}', 'white');
    }
};
