/**
 *  KitScript - A User Script Safari Extension
 *
 *  Greasemonkey.js - Javascript file containing Greasemonkey classes
 *  (by Prototype.js) used globally in the extension & implementing core
 *  Greasemonkey API.
 *
 *  @author Seraf Dos Santos
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */





/**
 *  KSGMException (KitScript Greasemonkey Exception Class)
 */
var KSGMException = Class.create({
    
    initialize: function (errorId) {
        
        this._msg = "";
        this._errorId = errorId;
        
        switch (errorId) {
            
            // user script errors (101-399)
            case 101:
                this._msg = "User script header is not valid.";
                break;
            
            // Greasemonkey API errors (701-999)
            case 701:
                break;
            default:
                this._msg = "Undefined user script error.";
        }
    },
    getMessage: function () {
        
        return this._msg;
    },
    getErrorId: function () {
        
        return this._errorId;
    }
});





/**
 *  KSGMUS (KitScript Greasemonkey User Script Class)
 */
var KSGMUS = Class.create({
    
    initialize: function () {
        
        this._isHeaderValid = false;
        this._script = "";
    },
    loadScript: function (scriptStr) {
        
        this._script = scriptStr;
        
        if (!this.isHeaderValid()) {
            
            var _errorId = 101;
            throw new KSGMException(_errorId);
        }
    },
    isHeaderValid: function () {
        
        this._isValid = /[\/]{2} ==UserScript==[^=]*==[\/]{1}UserScript==/m.test(this._script);
        
        return this._isValid;
    },
    getIncludes: function () {
        
        var _includes = [];
        
        var matches = /[\/]{2} \@include (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _includes.push(matches[i]);
        }
        
        return _includes;
    },
    getExcludes: function () {
        
        var _excludes = [];
        
        var matches = /[\/]{2} \@exclude (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _excludes.push(matches[i]);
        }
        
        return _excludes;
    },
    getDescription: function () {
        
        var matches = /[\/]{2} \@description (.*)/g.exec(this._script);
        
        return matches[1];
    },
    getIcon: function () {
        
        var matches = /[\/]{2} \@icon (.*)/g.exec(this._script);
        
        return matches[1];
    },
    getMatches: function () {
        
        var _matches = [];
        
        var matches = /[\/]{2} \@match (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _matches.push(matches[i]);
        }
        
        return _matches;
    },
    getName: function () {
        
        var matches = /[\/]{2} \@name (.*)/g.exec(this._script);
        
        return matches[1];
    },
    getNamespace: function () {
        
        var matches = /[\/]{2} \@namespace (.*)/g.exec(this._script);
        
        return matches[1];
    },
    getRequires: function () {
        
        var _requires = [];
        
        var matches = /[\/]{2} \@match (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _requires.push(matches[i]);
        }
        
        return _requires;
    },
    getResources: function () {
        
        var _resources = [];
        
        var matches = /[\/]{2} \@resource (.*) (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _resources.push(new Array(matches[i], matches[i+1]));
        }
        
        return _resources;
    },
    getRunAt: function () {
        
        var matches = /[\/]{2} \@run-at (.*)/g.exec(this._script);
        
        return matches[1];
    },
    hasUnwrap: function () {
        
        var _hasUnwrap = /[\/]{2} \@unwrap (.*)/g.test(this._script);
        
        return _hasUnwrap;
    },
    getVersion: function () {
        
        var matches = /[\/]{2} \@version (.*)/g.exec(this._script);
        
        return matches[1];
    }
});

//
// Greasemonkey
//

/**
 *  @param string name
 */
function GM_deleteValue(name) {
    
    
}

/**
 *  @param string name
 *  @param mixed defaultVal Default result to be returned
 */
function GM_getValue(name, defaultVal) {
    
    
}

function GM_listValues() {
    
    
}

/**
 *  @param string name
 *  @param string value
 */
function GM_setValues(name, value) {
    
    
}

/**
 *  @param string resource Resource name
 */
function GM_getResourceText(resource) {
    
    
}

/**
 *  @param string resource Resource name
 */
function GM_getResourceURL(resource) {
    
    
}

/**
 *  @param string css String of CSS
 */
function GM_addStyle(css) {
    
    
}

/**
 *  @param boolean binary
 *  @param string data
 *  @param object headers
 *  @param string method
 *  @param function onAbort
 *  @param function onError
 *  @param function onLoad
 *  @param function onProgress
 *  @param function onReadyStateChange
 *  @param string overideMimeType
 *  @param string password
 *  @param boolean synchronous
 *  @param object upload
 *  @param string url
 *  @param string user
 */
function GM_xmlhttpRequest(binary,data,headers,method,onAbort,onError,onLoad,onProgress,onReadyStateChange,overideMimeType,password,synchronous,upload,url,user) {
    
    
}

/**
 *  @param string message
 */
function GM_log(message) {
    
    
}

/**
 *  @param string url
 */
function GM_openInTab(url) {
    
    
}

/**
 *  @param string caption
 *  @param function commandFunc
 *  @param string accessKey
 */
function GMregisterMenuCommand(caption,commandFunc,accessKey) {
    
    
}
