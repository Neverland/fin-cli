/**
 * @file <% name %>.js
 * @author <% author %>(<% email %>@baidu.com)
 *
 * @since <% ENV.TIME_STRING_CN %>
 */

'use strict';

/* eslint-disable */
export default '<% data %>'
    .replace(/&amp;/g,"&")
    .replace(/&lt;/g,"<")
    .replace(/&gt;/g,">")
    .replace(/&nbsp;/g," ")
    .replace(/&#39;/g,"\'")
    .replace(/&quot;/g,"\"");
/* eslint-enable */
