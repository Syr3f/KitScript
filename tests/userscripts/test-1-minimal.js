// ==UserScript==
// @name            KitScript Test 1 - Minimal
// @namespace       ks/test/1/minimal
// @description     Changes anchors to green bold
// @include         *
// @require         http://code.jquery.com/jquery-1.6.4.min.js
// ==/UserScript==

jQuery(function ($) {
    
    $("a").css('font-weight', "bold").css('color', "green");
});