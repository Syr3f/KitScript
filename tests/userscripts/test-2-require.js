// ==UserScript==
// @name            KitScript Test 2 - Require
// @namespace       kitscript/test/2/require
// @description     Requires jQuery to turn anchors in bold-green easily
// @require         http://code.jquery.com/jquery-1.6.4.min.js
// ==/UserScript==

jQuery(function ($) {
    
    $("a").css('font-weight', "bold").css('color', "green");
});