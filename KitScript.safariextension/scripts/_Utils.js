/**
 *  KitScript - A User Script Manager For Safari
 *
 *  _Utils.js - Javascript file containing utilitary classes (by Prototype.js)
 *  used globally in the extension.
 *
 *  @author Seraf Dos Santos <webmaster@cyb3r.ca>
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */

//"use strict";




/**
 *  _Utils Class
 *
 *  Offers basic methods & Objects for child classes.
 */
var _Utils = Class.create({

    initialize: function () {
        
        this.$ = jQuery;
        this.md = window.markdown;
        this.console = console;
    },
    /**
     *  @param int verboseLevel (0=Silenced,1=Console,2=BrowserAlert)
     */
    setVerbosityLevel: function (verbosityLevel) {

        _Utils.vl = verbosityLevel;
    },
    log: function (msg) {

        switch (_Utils.vl) {

            case 2:
                alert(msg);
            case 1:
                this.console.log(msg);
                break;
            case 0:
            default:
                // Silence
        }
    },
    _a: function (msg) {
        
        alert(msg);
    },
    _l: function (msg) {
        
        this.console.log(msg);
    },
    escQuote: function (str) {
        
        return str.replace("'","\\'","gm");
    },
    sqlClean: function (str) {
        
        return this.escQuote(str.trim());
    },
    MD5: function (str) {
        return hex_md5(str);
    }
});

_Utils.vl = 0;

if(!String.prototype.trim) {  
  String.prototype.trim = function () {  
    return this.replace(/^\s+|\s+$/g,'');  
  };  
}  
