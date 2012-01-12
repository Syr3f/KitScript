/**
 *  KitScript - A User Script Safari Extension
 *
 *  Greasemonkey.js - Javascript file containing Greasemonkey classes
 *  (by Prototype.js) used globally in the extension & implementing core
 *  Greasemonkey API.
 *
 *  @author Seraf Dos Santos <webmaster@cyb3r.ca>
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */

//"use strict";





/**
 *  KSGMException (KitScript Greasemonkey Exception Class)
 */
var KSGMException = Class.create({
    
    initialize: function (msg) {
        
        this._msg = msg;
    },
    getMessage: function () {
        
        return this._msg;
    }
});





/**
 *  KSGreasemonkeyMetadata (KitScript Greasemonkey Metadata Class)
 */
var KSGreasemonkeyMetadata = Class.create(_Utils, {
    
    initialize: function ($super) {
        
        $super();
        
        this._isHeaderValid = false;
        this._script = "";
    },
    loadScript: function (scriptStr) {
        
        this._script = scriptStr;
        
        if (!this.isHeaderValid())
            throw new KSGMException("User script metadata block is invalid.");
    },
    isHeaderValid: function () {
        
        this._isValid = /[\/]{2} ==UserScript==[^=]*==[\/]{1}UserScript==/m.test(this._script);
        
        return this._isValid;
    },
    
    
    
    /**
     *  =========================== SUPPORTED IN v0.1 ==========================
     *  === v === v === v === v === v === v === v === v === v === v === v === v 
     */
    
    
    
    /**
     *  @name string – KS Mandatory
     *
     *  - The combination of namespace and name is the unique identifier for a Greasemonkey script.
     *
     *  @returns String
     */
    getName: function () {
        
        if (/[\/]{2} \@name (.*)/g.test(this._script) === true) {
            
            var matches = /[\/]{2} \@name (.*)/g.exec(this._script);
            
            return matches[1];
        } else {
            
            throw new KSGMException("No mandatory @name in metadata block.");
        }
    },
    /**
     *  @namespace string – KS Mandatory
     *
     *  - The combination of namespace and name is the unique identifier for a Greasemonkey script.
     *
     *  @returns String
     */
    getNamespace: function () {
        
        if (/[\/]{2} \@namespace (.*)/g.test(this._script) === true) {
            
            var matches = /[\/]{2} \@namespace (.*)/g.exec(this._script);
            
            return matches[1];
        } else {
            
            throw new KSGMException("No mandatory @namesapce in metadata block.");
        }
    },
    /**
     *  @description string – KS Mandatory
     *
     *  @returns String
     */
    getDescription: function () {
        
        if (/[\/]{2} \@description (.*)/g.test(this._script) === true) {
            
            var matches = /[\/]{2} \@description (.*)/g.exec(this._script);
            
            return matches[1];
        } else {
            
            throw new KSGMException("No mandatory @description in metadata block.");
        }
    },
    /**
     *  @requires url – Optional
     *
     *  @returns Array
     */
    getRequires: function () {
        
        var _requires = [];
        
        if (/[\/]{2} \@match (.*)/g.test(this._script) === true) {
            
            var matches = /[\/]{2} \@require (.*)/g.exec(this._script);
            
            for (var i = 1; i < matches.length; i++) {
                
                _requires.push(matches[i]);
            }
        }
        
        return _requires;
    },
    /**
     *  @includes pattern – Optional
     *
     *  - There can be any number of @include rules in a script.
     *  - If no include rule is provided, @include * is assumed.
     *
     *  @returns Array
     */
    getIncludes: function () {
        
        var _includes = [];
        
        if (/[\/]{2} \@include (.*)/g.test(this._script) === true) {
            
            var matches = /[\/]{2} \@include (.*)/g.exec(this._script);
            
            if (matches.length > 0) {
                
                for (var i = 1; i < matches.length; i++) {
                    
                    _includes.push(matches[i]);
                }
            } else {
                
                _includes.push('*');
            }
        }
        
        return _includes;
    },
    /**
     *  @excludes pattern – Optional
     *
     *  - There can be any number of @exclude rules in a script.
     *
     *  @returns Array
     */
    getExcludes: function () {
        
        var _excludes = [];
        
        if (/[\/]{2} \@exclude (.*)/g.test(this._script) === true) {
            
            var matches = /[\/]{2} \@exclude (.*)/g.exec(this._script);
            
            if (matches.length > 0) {
                
                for (var i = 1; i < matches.length; i++) {
                    
                    _excludes.push(matches[i]);
                }
            }
        }
        
        return _excludes;
    },
    /**
     *  @version float – Optional
     *
     *  - This is the version of the script, which should be treated like a
     *      firefox extension version, and maintain the same syntax.
     *
     *  KS v0.1:
     *  - No auto-update implemented
     *
     *  @returns String
     */
    getVersion: function () {
        
        if (/[\/]{2} \@version (.*)/g.test(this._script) === true) {
            
            var matches = /[\/]{2} \@version (.*)/g.exec(this._script);
            
            return matches[1];
        } else {
            
            return "";
        }
    },
    
    
    
    /**
     *  ========================================================================
     *  ===================== SUPPORTED IN FUTUR VERSIONS ======================
     *  ========================================================================
     */
    
    
    
    /**
     *  @icon url
     *
     *  @returns String
     */
    getIcon: function () {
        
        var matches = /[\/]{2} \@icon (.*)/g.exec(this._script);
        
        return matches[1];
    },
    /**
     *  @match pattern
     *
     *  @returns Array
     */
    getMatches: function () {
        
        var _matches = [];
        
        var matches = /[\/]{2} \@match (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _matches.push(matches[i]);
        }
        
        return _matches;
    },
    /**
     *  @resource url
     *
     *  @returns Array
     */
    getResources: function () {
        
        var _resources = [];
        
        var matches = /[\/]{2} \@resource (.*) (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _resources.push(new Array(matches[i], matches[i+1]));
        }
        
        return _resources;
    },
    /**
     *  @run-at "document-end" | "document-start"
     *
     *  - Supports two values: document-end and document-start. 
     *
     *  @returns String
     */
    getRunAt: function () {
        
        var matches = /[\/]{2} \@run-at (.*)/g.exec(this._script);
        
        // throw Exception if no match one or the other
        
        return matches[1];
    },
    /**
     *  @unwrap void
     *
     *  - This key is strongly recommended to only be used for debugging purposes.
     *
     *  @returns Boolean
     */
    hasUnwrap: function () {
        
        var _hasUnwrap = /[\/]{2} \@unwrap (.*)/g.test(this._script);
        
        return _hasUnwrap;
    }
});





/**
 *  KSGreasemonkeyAPI (KitScript Greasemonkey API Class)
 */
var KSGreasemonkeyAPI = Class.create(_Utils, {
    
    initialize: function ($super) {
        
        $super();
    }
});





/**
 *  ============================================================================
 *  ======================== Greasemonkey API Functions ========================
 *  ======================== Supported In Futur Versions =======================
 *  ============================================================================
 */

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
