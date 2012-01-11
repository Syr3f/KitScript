/**
 *  KitScript - A User Script Safari Extension
 *
 *  _Utils.js - Javascript file containing utilitary classes (by Prototype.js)
 *  used globally in the extension.
 *
 *  @author Seraf Dos Santos <webmaster@cyb3r.ca>
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */

"use strict";




/**
 *  _Utils Class
 *
 *  Offers basic methods for child classes.
 */
var _Utils = Class.create({

    initialize: function () {
        
        this.$ = jQuery;
    },
    /**
     *  @param int verboseLevel (0=Silenced,1=Console,2=BrowserAlert)
     */
    setVerbosityLevel: function (verboseLevel) {

        this.vl = verboseLevel;
    },
    log: function (msg) {

        switch (this.vl) {

            case 2:
                alert(msg);
            case 1:
                console.log(msg);
                break;
            case 0:
            default:
                // Silence
        }
    },
    _: function (msg) {
        
        alert(msg);
    }
});

_Utils.vl = 0;
