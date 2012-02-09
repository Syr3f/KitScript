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
        this._md_runat = KSGreasemonkeyMetadata.RUNAT_END;
        
        this._md_icon = '';
        this._md_matches = [];
        this._md_resources = [];
        this._md_hasUnwrap = false;
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
            
            if (/^[\/]{2} \@name (.*)$/gi.test(_line) === true) {
                
                this._md_name = /^[\/]{2}\s+\@name\s+(.*)$/gi.exec(_line)[1].trim();
            } else if (/^[\/]{2}\s+\@namespace\s+(.*)$/gi.test(_line) === true) {
                
                this._md_namespace = /^[\/]{2}\s+\@namespace\s+(.*)$/gi.exec(_line)[1].trim();
            } else if (/^[\/]{2}\s+\@description\s+(.*)$/gi.test(_line) === true) {
                
                this._md_description = /^[\/]{2}\s+\@description\s+(.*)$/gi.exec(_line)[1].trim();
            } else if (/^[\/]{2}\s+\@require\s+(.*)$/gi.test(_line) === true) {
                
                this._md_requires.push(/^[\/]{2}\s+\@require\s+(.*)$/gi.exec(_line)[1].trim());
            } else if (/^[\/]{2}\s+\@include\s+(.*)$/gi.test(_line) === true) {
                
                this._md_includes.push(/^[\/]{2}\s+\@include\s+(.*)$/gi.exec(_line)[1].trim());
            } else if (/^[\/]{2}\s+\@exclude\s+(.*)$/gi.test(_line) === true) {
                
                this._md_excludes.push(/^[\/]{2}\s+\@exclude\s+(.*)$/gi.exec(_line)[1].trim());
            } else if (/^[\/]{2}\s+\@version\s+(.*)$/gi.test(_line) === true) {
                
                this._md_version = /^[\/]{2}\s+\@version\s+(.*)$/gi.exec(_line)[1].trim();
            } else if (/^[\/]{2}\s+\@run\-at\s+(.*)$/gi.test(_line) === true) {
                
                this._md_runat = /^[\/]{2}\s+\@run\-at\s+(.*)$/gi.exec(_line)[1].trim();
            } else if (/^[\/]{2}\s+\@icon\s+(.*)$/gi.test(_line) === true) {
                
                this._md_icon = /^[\/]{2}\s+\@icon\s+(.*)$/gi.exec(_line)[1].trim();
            } else if (/^[\/]{2}\s+\@match\s+(.*)$/gi.test(_line) === true) {
                
                this._md_matches.push(/^[\/]{2}\s+\@match\s+(.*)$/gi.exec(_line)[1].trim());
            } else if (/^[\/]{2}\s+\@resource\s+(.*)\s+(.*)$/gi.test(_line) === true) {
                
                var _matches = /^[\/]{2}\s+\@resource\s+(.*)\s+(.*)$/gi.exec(_line);
                var _name = matches[1].trim();
                var _res = matches[2].trim()
                this._md_resources.push({"name":_name,"resource":_res});
            } else if (/^[\/]{2}\s+\@unwrap$/gi.test(_line) === true) {
                
                this._md_hasUnwrap = true;
            }
        }
    },
    
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
        
        if (this._md_includes.length > 0)
            return this._md_includes;
        else
            return ['*'];
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
     *  @run-at "document-end" | "document-start"
     *
     *  - Supports two values: document-end and document-start.
     *  - "document-end" is the standard behavior that Greasemonkey has always had.
     *
     *  @returns String
     */
    getRunAt: function () {
        
        if (this._md_runat.length > 0 && (this._md_runat.toLowerCase() == KSGreasemonkeyMetadata.RUNAT_END.toLowerCase() || this._md_runat.toLowerCase() == KSGreasemonkeyMetadata.RUNAT_START.toLowerCase()))
            return this._md_runat;
        else
            return KSGreasemonkeyMetadata.RUNAT_END;
    },
    /**
     *  @icon url
     *
     *  @returns String
     */
    getIcon: function () {
        
        return this._md_icon;
    },
    /**
     *  @match pattern
     *
     *  @returns Array
     */
    getMatches: function () {
        
        return this._md_matches;
    },
    /**
     *  @resource name url
     *
     *  @returns Array
     */
    getResources: function () {
        
        return this._md_resources;
    },
    /**
     *  @unwrap void
     *
     *  - This key is strongly recommended to only be used for debugging purposes.
     *
     *  @returns Boolean
     */
    hasUnwrap: function () {
        
        return this._md_hasUnwrap;
    }
});

KSGreasemonkeyMetadata.RUNAT_END = 'document-end';
KSGreasemonkeyMetadata.RUNAT_START = 'document-start';





/**
 *  KSGreasemonkeyAPI (KitScript Greasemonkey API Class)
 */
var KSGreasemonkeyAPI = Class.create(KSGreasemonkeyMetadata, {
    
    initialize: function ($super) {
        
        $super();
        
        this._currentUserScriptHashId = '';
    },
    
    loadScript: function ($super) {
        
        $super();
        
        this._currentUserScriptHashId;
    },
    
    // Values
    /**
     *  GM_deleteValue(name)
     *
     *  This deletes a value from chrome that was previously set.
     *
     *  @param string name
     */
    deleteValue: function () {
        
    },
    /**
     *  GM_getValue(name, defaultVal)
     *
     *  A function intended to get stored values, see GM_setValue below.
     *
     *  @param string name
     *  @param mixed defaultVal Default result to be returned
     */
    getValue: function () {
        
    },
    /**
     *  GM_listValues()
     *
     *  This API method retrieves an array of names that are stored with the
     *  script's hash id.
     */
    listValues: function () {
        
    },
    /**
     *  GM_setValue(name, value)
     *
     *  A function that accepts the name and value to store, persistently. This 
     *  value can be retrieved later, even on a different invocation of the script,
     *  with GM_getValue.
     *
     *  @param string name
     *  @param string value
     */
    setValue: function (name, value) {
        var _data = localStorage.getItem(this._currentUserScriptHashId);
        _data[name] = value;
        localStorage.setItem(this._currentUserScriptHashId,JSON.strignify(_data));
    },
    
    // Resources
    /**
     *  GM_getResourceText(resource)
     *
     *  Given a defined @resource, this method returns it as a string.
     *
     *  @param string resource Resource name
     */
    getResourceText: function (resourceName) {
        var _resrcs = this.getResources();
        for (var i=0; i<_resrcs.length; i++) {
            var _resrc = _resrcs[i];
            if (_resrc.name===resourceName)
                return _resrc.resource;
        }
    },
    /**
     *  GM_getResourceURL(resource)
     *
     *  Given a defined @resource, this method returns it as a URL.
     *
     *  @param string resource Resource name
     */
    getResourceURL: function (resourceName) {
        var _resrcs = this.getResources();
        for (var i=0; i<_resrcs.length; i++) {
            var _resrc = _resrcs[i];
            if (_resrc.name===resourceName) break;
        }
        // get current injected userscript hashid
        // load resource by hashid and name
        // assemble base64 data: URL
        // return data
    },
    // Common Task Helpers
    /**
     *  GM_addStyle(css)
     *
     *  @param string css String of CSS
     */
    addStyle: function (css) {
        $('head').append('<style type="css/text" rel="stylesheet">'+css+'</style>');
        return true;
    },
    /**
     *  GM_xmlhttpRequest(binary,data,headers,method,onAbort,onError,onLoad,onProgress,onReadyStateChange,overideMimeType,password,synchronous,upload,url,user)
     *
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
    xmlhttpRequest: function (binary,data,headers,method,onAbort,onError,onLoad,onProgress,onReadyStateChange,overideMimeType,password,synchronous,upload,url,user) {
        
    },
    /**
     *  Unsupported
     */
    unsafeWindow: function () {
        
    },
    
    // Other
    /**
     *  GM_log(message)
     *
     *  @param string message
     */
    log: function (message) {
        console.log(message);
        return true;
    },
    /**
     *  GM_openInTab(url)
     *
     *  @param string url
     */
    openInTab: function (url) {
        var _tab = safari.application.activeBrowserWindow.openTab('foreground');
        _tab.url = url;
        return true;
    },
    /**
     *  GMregisterMenuCommand(caption,commandFunc,accessKey)
     *
     *  @param string caption
     *  @param function commandFunc
     *  @param string accessKey
     */
    registerMenuCommand: function () {
        
    }
});





/**
 *  KSGreasemonkeyProxyAPI (KitScript Greasemonkey Proxy API Class)
 */
var KSGreasemonkeyProxyAPI = Class.create(KSGreasemonkeyAPI, {
    
    initialize: function ($super) {
        
        $super();
    },
    
    // Values
    /**
     *  GM_deleteValue(name)
     *  @param string name
     */
    proxyDeleteValue: function (event) {
        var _reqId = event.message.shift();
        var _ret = this.deleteValue(eval(event.message.join(',')));
        _ret.unshift(_reqId);
        this.dispatchResponse(event.name,_ret);
    },
    /**
     *  GM_getValue(name, defaultVal)
     *  @param string name
     *  @param mixed defaultVal Default result to be returned
     */
    proxyGetValue: function (event) {
        var _reqId = event.message.shift();
        var _ret = this.getValue(eval(event.message.join(',')));
        _ret.unshift(_reqId);
        this.dispatchResponse(event.name,_ret);
    },
    /**
     *  GM_listValues()
     */
    proxyListValues: function (event) {
        var _reqId = event.message.shift();
        var _ret = this.listValues();
        _ret.unshift(_reqId);
        this.dispatchResponse(event.name,_ret);
    },
    /**
     *  GM_setValue(name, value)
     *  @param string name
     *  @param string value
     */
    proxySetValue: function (event) {
        var _reqId = event.message.shift();
        var _ret = this.setValue(eval(event.message.join(',')));
        _ret.unshift(_reqId);
        this.dispatchResponse(event.name,_ret);
    },
    
    // Resources
    /**
     *  GM_getResourceText(resource)
     *  @param string resource Resource name
     */
    proxyGetResourceText: function (event) {
        var _reqId = event.message.shift();
        var _ret = this.getResourceText(eval(event.message.join(',')));
        _ret.unshift(_reqId);
        this.dispatchResponse(event.name,_ret);
    },
    /**
     *  GM_getResourceURL(resource)
     *  @param string resource Resource name
     */
    proxyGetResourceURL: function (event) {
        var _reqId = event.message.shift();
        var _ret = this.getResourceURL(eval(event.message.join(',')));
        _ret.unshift(_reqId);
        this.dispatchResponse(event.name,_ret);
    },
    // Common Task Helpers
    /**
     *  GM_addStyle(css)
     *  @param string css String of CSS
     */
    proxyAddStyle: function (event) {
        var _reqId = event.message.shift();
        var _ret = this.addStyle(eval(event.message.join(',')));
        _ret.unshift(_reqId);
        this.dispatchResponse(event.name,_ret);
    },
    /**
     *  GM_xmlhttpRequest(binary,data,headers,method,onAbort,onError,onLoad,onProgress,onReadyStateChange,overideMimeType,password,synchronous,upload,url,user)
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
    proxyXmlhttpRequest: function (event) {
        var _reqId = event.message.shift();
        var _ret = this.xmlhttpRequest(eval(event.message.join(',')));
        _ret.unshift(_reqId);
        this.dispatchResponse(event.name,_ret);
    },
    /**
     *  Unsupported
     */
    proxyUnsafeWindow: function (event) {
        //this.dispatchResponse('',);
    },
    
    // Other
    /**
     *  GM_log(message)
     *  @param string message
     */
    proxyLog: function (event) {
        var _reqId = event.message.shift();
        var _ret = this.log(eval(event.message.join(',')));
        _ret.unshift(_reqId);
        this.dispatchResponse(event.name,_ret);
    },
    /**
     *  GM_openInTab(url)
     *  @param string url
     */
    proxyOpenInTab: function (event) {
        var _reqId = event.message.shift();
        var _ret = this.openInTab(eval(event.message.join(',')));
        _ret.unshift(_reqId);
        this.dispatchResponse(event.name,_ret);
    },
    /**
     *  GMregisterMenuCommand(caption,commandFunc,accessKey)
     *  @param string caption
     *  @param function commandFunc
     *  @param string accessKey
     */
    proxyRegisterMenuCommand: function (event) {
        var _reqId = event.message.shift();
        var _ret = this.registerMenuCommand(eval(event.message.join(',')))
        _ret.unshift(_reqId);
        this.dispatchResponse(event.name,_ret);
    },
    
    dispatchResponse: function (name, value) {
        
        event.target.page.dispatchMessage(name, value);
    }
});





/**
 *  KSGMAPIMF_* (KitScript Greasemonkey API Messaging Function Handlers)
 */
function KSGMAPIMFH_processAPIRequest(event) {
    switch (event.name) {
        case "GM_deleteValue":
            gmapi.proxyDeleteValue(event);
            break;
        case "GM_getValue":
            gmapi.proxyGetValue(event);
            break;
        case "GM_listValues":
            gmapi.proxyListValues(event);
            break;
        case "GM_setValue":
            gmapi.proxySetValue(event);
            break;
        
        case "GM_getResourceText":
            gmapi.proxyGetResourceText(event);
            break;
        case "GM_getResourceURL":
            gmapi.proxyGetResourceURL(event);
            break;
        
        case "GM_addStyle":
            gmapi.proxyAddStyle(event);
            break;
        case "GM_log":
            gmapi.proxyLog(event);
            break;
        case "GM_openInTab":
            gmapi.proxyOpenInTab(event);
            break;
        
        case "GM_registerMenuCommand":
            gmapi.proxyRegisterMenuCommand(event);
            break;
        case "GM_xmlhttpRequest":
            gmapi.proxyXmlhttpRequest(event);
            break;
        
        //case "unsafeWindow":
            //gmapi.proxy(event);
            //break;
        
        default:
            throw new Error("Unknown Greasemonkey API: "+event.name);
    }
}

safari.application.activeBrowserWindow.addEventListener("message", KSGMAPIMFH_processAPIRequest, false);
