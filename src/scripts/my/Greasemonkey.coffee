# KitScript - A User Script Manager For Safari
#
# @author Seraf Dos Santos <webmaster@cyb3r.ca>
# @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
# @license MIT License
# @version 2.0
#
# Greasemonkey.js - Javascript file containing Greasemonkey classes
# used globally in the extension & implementing core Greasemonkey API.





class KSGMException
  
  constructor: (@msg) ->

  getMessage: =>
    @msg





class KSGreasemonkeyMetadata extends C_Utils
  
  constructor: ->
    super()
    
    @_isHeaderValid = false
    @_script = ""
    
    @_md_name = ''
    @_md_namespace = ''
    @_md_description = ''
    @_md_requires = []
    @_md_includes = []
    @_md_excludes = []
    @_md_version = ''
    @_md_runat = KSGreasemonkeyMetadata.RUNAT_END
    
    @_md_icon = ''
    @_md_matches = []
    @_md_resources = []
    @_md_hasUnwrap = false
  
  loadScript: (@_script) =>
    if @isHeaderValid is not true
      throw new KSGMException "User script metadata block is invalid."
    else
      @parseMetadataBlock();
  
  isHeaderValid: =>
    /[\/]{2} ==UserScript==[^=]*==[\/]{1}UserScript==/m.test @_script
  
  parseMetadataBlock: =>
    _matches = /[\/]{2} ==UserScript==([^=]*)==[\/]{1}UserScript==/m.exec @_script
    
    for _line in _matches[1].split "\n"
      _line = _line.trim()
      
      if /^[\/]{2} \@name (.*)$/gi.test _line is true
        @_md_name = /^[\/]{2}\s+\@name\s+(.*)$/gi.exec(_line)[1].trim()
        
      else if /^[\/]{2}\s+\@namespace\s+(.*)$/gi.test _line is true
        @_md_namespace = /^[\/]{2}\s+\@namespace\s+(.*)$/gi.exec(_line)[1].trim()
        
      else if /^[\/]{2}\s+\@description\s+(.*)$/gi.test _line is true
        @_md_description = /^[\/]{2}\s+\@description\s+(.*)$/gi.exec(_line)[1].trim()
        
      else if /^[\/]{2}\s+\@require\s+(.*)$/gi.test _line is true
        @_md_requires.push /^[\/]{2}\s+\@require\s+(.*)$/gi.exec(_line)[1].trim()
        
      else if /^[\/]{2}\s+\@include\s+(.*)$/gi.test _line is true
        @_md_includes.push /^[\/]{2}\s+\@include\s+(.*)$/gi.exec(_line)[1].trim()
        
      else if /^[\/]{2}\s+\@exclude\s+(.*)$/gi.test _line is true
        @_md_excludes.push /^[\/]{2}\s+\@exclude\s+(.*)$/gi.exec(_line)[1].trim()
        
      else if /^[\/]{2}\s+\@version\s+(.*)$/gi.test _line is true
        @_md_version = /^[\/]{2}\s+\@version\s+(.*)$/gi.exec(_line)[1].trim()
        
      else if /^[\/]{2}\s+\@run\-at\s+(.*)$/gi.test _line is true
        @_md_runat = /^[\/]{2}\s+\@run\-at\s+(.*)$/gi.exec(_line)[1].trim()
        
      else if /^[\/]{2}\s+\@icon\s+(.*)$/gi.test _line is true
        @_md_icon = /^[\/]{2}\s+\@icon\s+(.*)$/gi.exec(_line)[1].trim()
        
      else if /^[\/]{2}\s+\@match\s+(.*)$/gi.test _line is true
        @_md_matches.push /^[\/]{2}\s+\@match\s+(.*)$/gi.exec(_line)[1].trim()
        
      else if /^[\/]{2}\s+\@resource\s+(.*)\s+(.*)$/gi.test _line is true
        _matches = /^[\/]{2}\s+\@resource\s+(.*)\s+(.*)$/gi.exec _line
        _name = _matches[1].trim()
        _res = _matches[2].trim()
        @_md_resources.push {"name":_name,"resource":_res}
        
      else if /^[\/]{2}\s+\@unwrap$/gi.test _line is true
        @_md_hasUnwrap = true

  #
  #  @name string – KS Mandatory
  #
  #  - The combination of namespace and name is the unique identifier for a Greasemonkey script.
  #
  #  @returns String
  #
  getName: =>
    @_md_name

  #
  #  @namespace string – KS Mandatory
  #
  #  - The combination of namespace and name is the unique identifier for a Greasemonkey script.
  #
  #  @returns String
  #
  getNamespace: =>
    @_md_namespace

  #
  #  @description string – KS Mandatory
  #
  #  @returns String
  #
  getDescription: =>
    @_md_description
  
  #
  #  @requires url – Optional
  #
  #  @returns Array
  #
  getRequires: =>
    @_md_requires
  
  #
  #  @includes pattern – Optional
  #
  #  - There can be any number of @include rules in a script.
  #  - If no include rule is provided, @include# is assumed.
  #
  #  @returns Array
  #
  getIncludes: =>
    if @_md_includes.length > 0
      @_md_includes
    else
      ['*']
  
  #
  #  @excludes pattern – Optional
  #
  #  - There can be any number of @exclude rules in a script.
  #
  #  @returns Array
  #
  getExcludes: =>
    @_md_excludes
  
  #
  #  @version float – Optional
  #
  #  - This is the version of the script, which should be treated like a
  #      firefox extension version, and maintain the same syntax.
  #
  #  KS v0.1:
  #  - No auto-update implemented
  #
  #  @returns String
  #
  getVersion: =>
    @_md_version
  
  #
  #  @run-at "document-end" | "document-start"
  #
  #  - Supports two values: document-end and document-start.
  #  - "document-end" is the standard behavior that Greasemonkey has always had.
  #
  #  @returns String
  #
  getRunAt: =>
    if @_md_runat.length > 0 and (@_md_runat.toLowerCase() is KSGreasemonkeyMetadata.RUNAT_END.toLowerCase() or @_md_runat.toLowerCase() is KSGreasemonkeyMetadata.RUNAT_START.toLowerCase())
      @_md_runat
    else
      KSGreasemonkeyMetadata.RUNAT_END;
  
  #
  #  @icon url
  #
  #  @returns String
  #
  getIcon: =>
    @_md_icon
  
  #
  #  @match pattern
  #
  #  @returns Array
  #
  getMatches: =>
    @_md_matches
  
  #
  #  @resource name url
  #
  #  @returns Array
  #
  getResources: =>
    @_md_resources
  
  #
  #  @unwrap void
  #
  #  - This key is strongly recommended to only be used for debugging purposes.
  #
  #  @returns Boolean
  #
  hasUnwrap: =>
    @_md_hasUnwrap

KSGreasemonkeyMetadata.RUNAT_END = 'document-end';
KSGreasemonkeyMetadata.RUNAT_START = 'document-start';





#
#  KSGreasemonkeyAPI (KitScript Greasemonkey API Class)
#
class KSGreasemonkeyAPI extends KSGreasemonkeyMetadata
  
  constructor: ->
    super()
    @_currentUserScriptHashId = ''
  
  loadScript: =>
    super()
    @_currentUserScriptHashId
  
  ## Values
  
  #
  #  GM_deleteValue(name)
  #
  #  This deletes a value from chrome that was previously set.
  #
  #  @param string name
  #
  deleteValue: =>
    
  
  #
  #  GM_getValue(name, defaultVal)
  #
  #  A function intended to get stored values, see GM_setValue below.
  #
  #  @param string name
  #  @param mixed defaultVal Default result to be returned
  #
  getValue: =>
    
  
  #
  #  GM_listValues()
  #
  #  This API method retrieves an array of names that are stored with the
  #  script's hash id.
  #
  listValues: =>
    
  
  #
  #  GM_setValue(name, value)
  #
  #  A function that accepts the name and value to store, persistently. This 
  #  value can be retrieved later, even on a different invocation of the script,
  #  with GM_getValue.
  #
  #  @param string name
  #  @param string value
  #
  setValue: (name, value) =>
    _data = localStorage.getItem @_currentUserScriptHashId
    _data[name] = value
    localStorage.setItem @_currentUserScriptHashId, JSON.strignify(_data)
  
  ## Resources
  
  #
  #  GM_getResourceText(resource)
  #
  #  Given a defined @resource, this method returns it as a string.
  #
  #  @param string resource Resource name
  #
  getResourceText: (resourceName) =>
    for _resrc in @getResources()
      if _resrc.name is resourceName
        _resrc.resource;
  
  #
  #  GM_getResourceURL(resource)
  #
  #  Given a defined @resource, this method returns it as a URL.
  #
  #  @param string resource Resource name
  #
  getResourceURL: (resourceName) =>
    for _rsrc in @getResources()
      if _resrc.name is resourceName then break
      
    # get current injected userscript hashid
    # load resource by hashid and name
    # assemble base64 data: URL
    # return data
  
  ## Common Task Helpers
  
  #
  #  GM_addStyle(css)
  #
  #  @param string css String of CSS
  #
  addStyle: (css) =>
    $('head').append '<style type="css/text" rel="stylesheet">'+css+'</style>'
    true
  
  #
  #  GM_xmlhttpRequest(binary,data,headers,method,onAbort,onError,onLoad,onProgress,onReadyStateChange,overideMimeType,password,synchronous,upload,url,user)
  #
  #  @param boolean binary
  #  @param string data
  #  @param object headers
  #  @param string method
  #  @param function onAbort
  #  @param function onError
  #  @param function onLoad
  #  @param function onProgress
  #  @param function onReadyStateChange
  #  @param string overideMimeType
  #  @param string password
  #  @param boolean synchronous
  #  @param object upload
  #  @param string url
  #  @param string user
  #
  xmlhttpRequest: (binary,data,headers,method,onAbort,onError,onLoad,onProgress,onReadyStateChange,overideMimeType,password,synchronous,upload,url,user) =>
    
  
  #
  #  Unsupported
  #
  unsafeWindow: =>
    
  
  ## Other
  
  #
  #  GM_log(message)
  #
  #  @param string message
  #
  log: (message) =>
    console.log message
    true
  
  #
  #  GM_openInTab(url)
  #
  #  @param string url
  #
  openInTab: (url) =>
    _tab = safari.application.activeBrowserWindow.openTab 'foreground'
    _tab.url = url
    true
  
  #
  #  GMregisterMenuCommand(caption,commandFunc,accessKey)
  #
  #  @param string caption
  #  @param function commandFunc
  #  @param string accessKey
  #
  registerMenuCommand: =>
    





#
#  KSGreasemonkeyProxyAPI (KitScript Greasemonkey Proxy API Class)
#
class KSGreasemonkeyProxyAPI extends KSGreasemonkeyAPI
  
  constructor: ->
    super()
  
  ## Values
  
  #
  #  GM_deleteValue(name)
  #  @param string name
  #
  proxyDeleteValue: (event) =>
    _reqId = event.message.shift()
    _ret = @deleteValue window[event.message.join ',']
    _ret.unshift _reqId
    @dispatchResponse event.name, _ret
  
  #
  #  GM_getValue(name, defaultVal)
  #  @param string name
  #  @param mixed defaultVal Default result to be returned
  #
  proxyGetValue: (event) =>
    _reqId = event.message.shift()
    _ret = @getValue window[event.message.join ',']
    _ret.unshift _reqId
    @dispatchResponse event.name, _ret
  
  #
  #  GM_listValues()
  #
  proxyListValues: (event) =>
    _reqId = event.message.shift()
    _ret = @listValues()
    _ret.unshift _reqId
    @dispatchResponse event.name, _ret
  
  #
  #  GM_setValue(name, value)
  #  @param string name
  #  @param string value
  #
  proxySetValue: (event) =>
    _reqId = event.message.shift()
    _ret = @setValue window[event.message.join ',']
    _ret.unshift _reqId
    @dispatchResponse event.name, _ret
  
  
  ## Resources
  
  #
  #  GM_getResourceText(resource)
  #  @param string resource Resource name
  #
  proxyGetResourceText: (event) =>
    _reqId = event.message.shift()
    _ret = @getResourceText window[event.message.join ',']
    _ret.unshift _reqId
    @dispatchResponse event.name, _ret
  
  #
  #  GM_getResourceURL(resource)
  #  @param string resource Resource name
  #
  proxyGetResourceURL: (event) =>
    _reqId = event.message.shift()
    _ret = @getResourceURL window[event.message.join ',']
    _ret.unshift _reqId
    @dispatchResponse event.name, _ret
  
  ## Common Task Helpers
  
  #
  #  GM_addStyle(css)
  #  @param string css String of CSS
  #
  proxyAddStyle: (event) =>
    _reqId = event.message.shift()
    _ret = @addStyle window[event.message.join ',']
    _ret.unshift _reqId
    @dispatchResponse event.name, _ret
  
  #
  #  GM_xmlhttpRequest(binary,data,headers,method,onAbort,onError,onLoad,onProgress,onReadyStateChange,overideMimeType,password,synchronous,upload,url,user)
  #  @param boolean binary
  #  @param string data
  #  @param object headers
  #  @param string method
  #  @param function onAbort
  #  @param function onError
  #  @param function onLoad
  #  @param function onProgress
  #  @param function onReadyStateChange
  #  @param string overideMimeType
  #  @param string password
  #  @param boolean synchronous
  #  @param object upload
  #  @param string url
  #  @param string user
  #
  proxyXmlhttpRequest: (event) =>
    _reqId = event.message.shift()
    _ret = @xmlhttpRequest window[event.message.join ',']
    _ret.unshift _reqId
    @dispatchResponse event.name, _ret
  
  #
  #  Unsupported
  #
  proxyUnsafeWindow: (event) =>
    #@dispatchResponse('',)
  
  
  ## Other
  
  #
  #  GM_log(message)
  #  @param string message
  #
  proxyLog: (event) =>
    _reqId = event.message.shift()
    _ret = @log window[event.message.join ',']
    _ret.unshift _reqId
    @dispatchResponse event.name, _ret
  
  #
  #  GM_openInTab(url)
  #  @param string url
  #
  proxyOpenInTab: (event) =>
    _reqId = event.message.shift()
    _ret = @openInTab window[event.message.join ',']
    _ret.unshift _reqId
    @dispatchResponse event.name, _ret
  
  #
  #  GMregisterMenuCommand(caption,commandFunc,accessKey)
  #  @param string caption
  #  @param function commandFunc
  #  @param string accessKey
  #
  proxyRegisterMenuCommand: (event) =>
    _reqId = event.message.shift()
    _ret = @registerMenuCommand window[event.message.join ',']
    _ret.unshift _reqId
    @dispatchResponse event.name, _ret
  
  
  dispatchResponse: (name, value) =>
    event.target.page.dispatchMessage name, value





#
#  KSGMAPIMF_* (KitScript Greasemonkey API Messaging Function Handlers)
#
KSGMAPIMFH_processAPIRequest = (event) ->
  switch event.name
    when "GM_deleteValue" then gmapi.proxyDeleteValue event
    when "GM_getValue" then gmapi.proxyGetValue event
    when "GM_listValues" then gmapi.proxyListValues event
    when "GM_setValue" then gmapi.proxySetValue event
    
    when "GM_getResourceText" then gmapi.proxyGetResourceText event
    when "GM_getResourceURL" then gmapi.proxyGetResourceURL event
    
    when "GM_addStyle" then gmapi.proxyAddStyle event
    when "GM_log" then gmapi.proxyLog event
    when "GM_openInTab" then gmapi.proxyOpenInTab event
    
    when "GM_registerMenuCommand" then gmapi.proxyRegisterMenuCommand event
    when "GM_xmlhttpRequest" then gmapi.proxyXmlhttpRequest event
    
    #when "unsafeWindow" then gmapi.proxy event
    
    else
      throw new Error "Unknown Greasemonkey API: "+event.name

safari.application.activeBrowserWindow.addEventListener "message", KSGMAPIMFH_processAPIRequest, false
