// ==UserScript==
// @name            KitScript Test 3 - Resource API
// @namespace       kitscript/test/3/resource-api
// @description     Flag and anchor images are resources of the user script
// @require         http://code.jquery.com/jquery-1.6.4.min.js
// @resource        flag http://silk-icons.cyb3r.ca/flag_red.png
// @resource        anchor http://silk-icons.cyb3r.ca/anchor.png
// ==/UserScript==

jQuery(function ($) {
    
    $("a").prepend("<img src='"+GM_getResourceText("anchor")+"' alt='anchor' />");
    $("a").after("<img src='"+GM_getResourceText("flag")+"' alt='flag' />");
});