/**
 *  KitScript - A User Script Manager For Safari
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
        
        this._md_name = '';
        this._md_namespace = '';
        this._md_description = '';
        this._md_requires = [];
        this._md_includes = [];
        this._md_excludes = [];
        this._md_version = '';
    },
    loadScript: function (scriptStr) {
        
        this._script = scriptStr;
        
        if (!this.isHeaderValid())
            throw new KSGMException("User script metadata block is invalid.");
        else
            this.parseMetadataBlock();
    },
    isHeaderValid: function () {
        
        this._isValid = /[\/]{2} ==UserScript==[^=]*==[\/]{1}UserScript==/m.test(this._script);
        
        return this._isValid;
    },
    parseMetadataBlock: function () {
        
        var _matches = /[\/]{2} ==UserScript==([^=]*)==[\/]{1}UserScript==/m.exec(this._script);
        
        var _lines = _matches[1].split("\n");
        
        for (var i=0; i<_lines.length; i++) {
            var _line = _lines[i].trim();
            
            if (/[\/]{2} \@name (.*)/g.test(_line) === true) {
                
                this._md_name = /[\/]{2} \@name (.*)/g.exec(_line)[1].trim();
            } else if (/[\/]{2} \@namespace (.*)/g.test(_line) === true) {
                
                this._md_namespace = /[\/]{2} \@namespace (.*)/g.exec(_line)[1].trim();
            } else if (/[\/]{2} \@description (.*)/g.test(_line) === true) {
                
                this._md_description = /[\/]{2} \@description (.*)/g.exec(_line)[1].trim();
            } else if (/[\/]{2} \@match (.*)/g.test(_line) === true) {
                
                this._md_requires.push(/[\/]{2} \@require (.*)/g.exec(_line)[1].trim());
            } else if (/[\/]{2} \@include (.*)/g.test(_line) === true) {
                
                this._md_includes.push(/[\/]{2} \@include (.*)/g.exec(_line)[1].trim());
            } else if (/[\/]{2} \@exclude (.*)/g.test(_line) === true) {
                
                this._md_excludes.push(/[\/]{2} \@exclude (.*)/g.exec(_line)[1].trim());
            } else if (/[\/]{2} \@version (.*)/g.test(_line) === true) {
                
                this._md_version = /[\/]{2} \@version (.*)/g.exec(_line)[1].trim();
            }
        }
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
        
        return this._md_name;
    },
    /**
     *  @namespace string – KS Mandatory
     *
     *  - The combination of namespace and name is the unique identifier for a Greasemonkey script.
     *
     *  @returns String
     */
    getNamespace: function () {
        
        return this._md_namespace;
    },
    /**
     *  @description string – KS Mandatory
     *
     *  @returns String
     */
    getDescription: function () {
        
        return this._md_description;
    },
    /**
     *  @requires url – Optional
     *
     *  @returns Array
     */
    getRequires: function () {
        
        return this._md_requires;
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
        
        return this._md_includes;
    },
    /**
     *  @excludes pattern – Optional
     *
     *  - There can be any number of @exclude rules in a script.
     *
     *  @returns Array
     */
    getExcludes: function () {
        
        return this._md_excludes;
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
        
        return this._md_version;
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
