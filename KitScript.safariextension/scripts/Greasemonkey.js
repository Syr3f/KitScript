




/**
 *  KSGMUS (KitScript Greasemonkey User Script Class)
 */
var KSGMUS = Class.create({
    
    initialize: function (script) {
        
        this._script = script;
    },
    hasValidHeader: function () {
        
        var _isValid = /\/\/[ ]+==UserScript==\n.*\/\/[ ]+==\/UserScript==/g.test(this._script);
        
        return _isValid;
    },
    getIncludes: function () {
        
        var _includes = [];
        
        var matches = /\/\/[ ]+\@include (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _includes.push(matches[i]);
        }
        
        return _includes;
    },
    getExcludes: function () {
        
        var _excludes = [];
        
        var matches = /\/\/[ ]+\@exclude (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _excludes.push(matches[i]);
        }
        
        return _excludes;
    },
    getDescription: function () {
        
        var matches = /\/\/[ ]+\@description (.*)/g.exec(this._script);
        
        return matches[1];
    },
    getIcon: function () {
        
        var matches = /\/\/[ ]+\@icon (.*)/g.exec(this._script);
        
        return matches[1];
    },
    getMatches: function () {
        
        var _matches = [];
        
        var matches = /\/\/[ ]+\@match (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _matches.push(matches[i]);
        }
        
        return _matches;
    },
    getName: function () {
        
        var matches = /\/\/[ ]+\@name (.*)/g.exec(this._script);
        
        return matches[1];
    },
    getNamespace: function () {
        
        var matches = /\/\/[ ]+\@namespace (.*)/g.exec(this._script);
        
        return matches[1];
    },
    getRequires: function () {
        
        var _requires = [];
        
        var matches = /\/\/[ ]+\@match (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _requires.push(matches[i]);
        }
        
        return _requires;
    },
    getResources: function () {
        
        var _resources = [];
        
        var matches = /\/\/[ ]+\@resource (.*) (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _resources.push(new Array(matches[i], matches[i+1]));
        }
        
        return _resources;
    },
    getRunAt: function () {
        
        var matches = /\/\/[ ]+\@run-at (.*)/g.exec(this._script);
        
        return matches[1];
    },
    hasUnwrap: function () {
        
        var _hasUnwrap = /\/\/[ ]+\@unwrap (.*)/g.test(this._script);
        
        return _hasUnwrap;
    },
    getVersion: function () {
        
        var matches = /\/\/[ ]+\@version (.*)/g.exec(this._script);
        
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
 *  @param mixed default Default result to be returned
 */
function GM_getValue(name, default) {
    
    
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
