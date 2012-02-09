// ==UserScript==
// @name            KitScript Test 3 - Resource API
// @namespace       kitscript/test/3/resource-api
// @description     Requires jQuery to turn anchors in bold-green easily
// @resource        flag http://silk-icons.cyb3r.ca/flag_red.png
// @resource        anchor http://silk-icons.cyb3r.ca/anchor.png
// ==/UserScript==

jQuery(function ($) {
    
    $("a").prepend("<img src='"+GM_getResourceText("anchor")+"' alt='anchor' />");
    $("a").after("<img src='"+GM_getResourceText("flag")+"' alt='flag' />");
});