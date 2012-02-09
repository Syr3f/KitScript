/**
 *  GMAPI-Injected.js – Injected Greasemonkey API Proxy messenger.
 *
 *
 */





function KSGreasemonkeyProxyAPI() {
    
    this._ksi = KSInstance;
    
    this.DELETEVALUE = 0;
    this.GETVALUE = 1;
    this.LISTVALUES = 2;
    this.SETVALUE = 3;
    this.GETRESOURCETEXT = 4;
    this.GETRESOURCEURL = 5;
    this.ADDSTYLE = 6;
    this.XMLHTTPREQUEST = 7;
    this.LOG = 8;
    this.OPENINTTAB = 9;
    this.REGISTERMENUCOMMAND = 10;
    
    this._APIFuncs = [];
    
    this._APIFuncs[this.DELETEVALUE] = 'GM_deleteValue';
    this._APIFuncs[this.GETVALUE] = 'GM_getValue';
    this._APIFuncs[this.LISTVALUES] = 'GM_listValues';
    this._APIFuncs[this.SETVALUE] = 'GM_setValue';
    this._APIFuncs[this.GETRESOURCETEXT] = 'GM_getResourceText';
    this._APIFuncs[this.GETRESOURCEURL] = 'GM_getResourceURL';
    this._APIFuncs[this.ADDSTYLE] = 'GM_addStyle';
    this._APIFuncs[this.XMLHTTPREQUEST] = 'GM_xmlhttpRequest';
    this._APIFuncs[this.LOG] = 'GM_log';
    this._APIFuncs[this.OPENINTTAB] = 'GM_openInTab';
    this._APIFuncs[this.REGISTERMENUCOMMAND] = 'GM_registerMenuCommand';
    
    this._proxyRequests = [];
    
    this._proxyRequests[this.DELETEVALUE] = [];
    this._proxyRequests[this.GETVALUE] = [];
    this._proxyRequests[this.LISTVALUES] = [];
    this._proxyRequests[this.SETVALUE] = [];
    this._proxyRequests[this.GETRESOURCETEXT] = [];
    this._proxyRequests[this.GETRESOURCEURL] = [];
    this._proxyRequests[this.ADDSTYLE] = [];
    this._proxyRequests[this.XMLHTTPREQUEST] = [];
    this._proxyRequests[this.LOG] = [];
    this._proxyRequests[this.OPENINTTAB] = [];
    this._proxyRequests[this.REGISTERMENUCOMMAND] = [];
    
    this._deleteValue = undefined;
    this._getValue = undefined;
    this._listValues = undefined;
    this._setValue = undefined;
    this._getResourceText = undefined;
    this._getResourceURL = undefined;
    this._addStyle = undefined;
    this._xmlhttpRequest = undefined;
    this._log = undefined;
    this._openIntTab = undefined;
    this._registerMenuCommand = undefined;
}

KSGreasemonkeyProxyAPI.prototype.deleteValue = function (name) {
    var _reqId = this.dispatchMessage('GM_deleteValue',[name]);
    return this.getReturnOnProcessWait(_reqId);
    
    //this.onProcessResponse('GM_deleteValue', _reqId, function (returnValue) {
    //    
    //});
}

KSGreasemonkeyProxyAPI.prototype.getValue = function (name, defaultVal) {
    var _reqId = this.dispatchMessage('GM_getValue',[name, defaultVal]);
    return this.getReturnOnProcessWait(_reqId);
}

KSGreasemonkeyProxyAPI.prototype.listValues = function () {
    var _reqId = this.dispatchMessage('GM_listValues',[]);
    return this.getReturnOnProcessWait(_reqId);
}

KSGreasemonkeyProxyAPI.prototype.setValue = function (name, value) {
    var _reqId = this.dispatchMessage('GM_setValue',[name, value]);
    return this.getReturnOnProcessWait(_reqId);
}

KSGreasemonkeyProxyAPI.prototype.getResourceText = function (resourceName) {
    var _reqId = this.dispatchMessage('GM_getResourceText',[resourceName]);
    return this.getReturnOnProcessWait(_reqId);
}

KSGreasemonkeyProxyAPI.prototype.getResourceURL = function (resourceName) {
    var _reqId = this.dispatchMessage('GM_getResourceURL',[resourceName]);
    return this.getReturnOnProcessWait(_reqId);
}

KSGreasemonkeyProxyAPI.prototype.addStyle = function (css) {
    var _reqId = this.dispatchMessage('GM_addStyle',[css]);
    return this.getReturnOnProcessWait(_reqId);
}

KSGreasemonkeyProxyAPI.prototype.xmlhttpRequest = function (binary,data,headers,method,onAbort,onError,onLoad,onProgress,onReadyStateChange,overideMimeType,password,synchronous,upload,url,user) {
    var _reqId = this.dispatchMessage('GM_xmlhttpRequest',[binary,data,headers,method,onAbort,onError,onLoad,onProgress,onReadyStateChange,overideMimeType,password,synchronous,upload,url,user]);
    return this.getReturnOnProcessWait(_reqId);
}

KSGreasemonkeyProxyAPI.prototype.log = function (message) {
    var _reqId = this.dispatchMessage('GM_log',[message]);
    return this.getReturnOnProcessWait(_reqId);
}

KSGreasemonkeyProxyAPI.prototype.openInTab = function (url) {
    var _reqId = this.dispatchMessage('GM_openInTab',[url]);
    return this.getReturnOnProcessWait(_reqId);
}

KSGreasemonkeyProxyAPI.prototype.registerMenuCommand = function (caption,commandFunc,accessKey) {
    var _reqId = this.dispatchMessage('GM_registerMenuCommand',[caption,commandFunc,accessKey]);
    return this.getReturnOnProcessWait(_reqId);
}



KSGreasemonkeyProxyAPI.prototype._genReqId = function () {
    return Date.now()+'-'+Math.floor(Math.random()*Date.now()+1);
}

KSGreasemonkeyProxyAPI.prototype.dispatchMessage = function (funcName,argsArray) {
    var _reqId = this._genReqId();
    argsArray.unshift(_reqId);
    this._proxyResponses[reqId] = undefined;
    safari.self.tab.dispatchMessage(funcName,argsArray);
    return _reqId;
}

KSGreasemonkeyProxyAPI.prototype.hasReqestIdResponse = function (reqId) {
    if (this._proxyResponses[reqId] !== undefined)
        return true;
    return false;
}

KSGreasemonkeyProxyAPI.prototype.getReturnOnProcessWait = function (reqId) {
    if (!this.hasReqestIdResponse(reqId))
        setTimeout(this.getReturnOnProcessWait,125,reqId);
    else {
        return this._proxyResponses[reqId];
    }
}

KSGreasemonkeyProxyAPI.prototype.onProcessResponse = function (funcName, reqId, callback) {
    var _pr = {
        id: reqId,
        name: funcName,
        callback: callback
    }
    this._proxyRequests[eval('this.'+funcName.substr(3).toUpperCase())].push(_pr);
}

KSGreasemonkeyProxyAPI.prototype.triggerProcessResponse = function (event) {
    var _funcName = event.name.substr(3).toUpperCase();
    var _reqId = event.message.shift();
    for (var i=0; i<this._proxyRequests[eval('this.'+_funcName)].length; i++) {
        var _req = this._proxyRequests[eval('this.'+_funcName)][i];
        if (_req.id===_reqId) {
            this._proxyResponses[_req.id] = event.message;
            if (_req.callback) _req.callback(event);
        }
    }
}

KSGreasemonkeyProxyAPI.processAPIResponse = function (event) {
    this.triggerProcessResponse(event);
}

window.gmpapi = new KSGreasemonkeyProxyAPI();





/**
 *  @param string name
 */
function GM_deleteValue(name) {
    return gmpapi.deleteValue(name);
}

/**
 *  @param string name
 *  @param mixed defaultVal Default result to be returned
 */
function GM_getValue(name,defaultVal) {
    return gmpapi.getValue(name,defaultVal);
}

function GM_listValues() {
    return gmpapi.listValues();
}

/**
 *  @param string name
 *  @param string value
 */
function GM_setValue(name, value) {
    return gmpapi.setValue(name,value);
}

/**
 *  @param string resource Resource name
 */
function GM_getResourceText(resource) {
    return gmpapi.getResourceText(resource);
}

/**
 *  @param string resource Resource name
 */
function GM_getResourceURL(resource) {
    return gmpapi.getResourceURL(resource);
}

/**
 *  @param string css String of CSS
 */
function GM_addStyle(css) {
    return gmpapi.addStyle(css);
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
    return gmpapi.xmlhttpRequest(binary,data,headers,method,onAbort,onError,onLoad,onProgress,onReadyStateChange,overideMimeType,password,synchronous,upload,url,user);
}

/**
 *  @param string message
 */
function GM_log(message) {
    return gmpapi.log(message);
}

/**
 *  @param string url
 */
function GM_openInTab(url) {
    return gmpapi.openInTab(url);
}

/**
 *  @param string caption
 *  @param function commandFunc
 *  @param string accessKey
 */
function GM_registerMenuCommand(caption,commandFunc,accessKey) {
    return gmpapi.registerMenuCommand(caption,commandFunc,accessKey);
}



/**
 *  KSIGMAPIMFH_* (KitScript Injected Greasemonkey API Messaging Function Handler)
 */
function KSIGMAPIMFH_processAPIResponse(event) {
    
    KSGreasemonkeyProxyAPI.processAPIResponse(event);
}



safari.self.addEventListener("message", KSIGMAPIMFH_processAPIResponse, false);
