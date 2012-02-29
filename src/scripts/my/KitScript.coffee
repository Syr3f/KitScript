# KitScript - A User Script Manager For Safari
#
# @author Seraf Dos Santos <webmaster@cyb3r.ca>
# @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
# @license MIT License
# @version 2.0
#
# KitScript.js - Javascript file containing base classes used globally in the 
# extension.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.V_PanelContainer extends Backbone.View
  
  initialize: ->
    @id = "panelcontainer"
    @el = "#panelcontainer"
    @tagname = "div"
    @classname = "container"
    
    @topOffset = 200
    @bottomOffset = 50
    @prevPanelId = null
    @currPanelId = KSApp.initPanelId
    @prevNavItemId = null
    @currNavItemId = NavBarContainer.menuItemBaseId+KSApp.initPanelId
  
  render: =>
    $('#'+@prevPanelId).hide()
    $('#'+@currPanelId).show()
    $('#'+@prevNavItemId).removeClass 'active'
    $('#'+@currNavItemId).addClass 'active'
    @setTabTitle()
    @
  
  setTabTitle: =>
    document.title = KSApp.getLocaleDictKey('app','name')+' • '+KSApp.getLocaleDictKey(@currPanelId,'title')
  
  transitTo: (toPanelId) =>
    @prevPanelId = @currPanelId
    @currPanelId = toPanelId
    @prevNavItemId = @currNavItemId
    @currNavItemId = NavBarContainer.menuItemBaseId+toPanelId
    @render()
  
  getAvailContentHeight: =>
    _offset = $(@el).offset()
    KSApp.getWindowHeight()-_offset.top-@topOffset-@bottomOffset


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.M_KitScriptPreferencesModel extends Backbone.Model

  localStorage: "KitScript"
  
  initialize: ->
    

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.V_GlobalSettingsPanel extends Backbone.View
  
  initialize: ->
    @id = "globalsettings"
    @el = "#globalsettings"
    @tagname = "section"
    @classname = "content"
  
  render: =>
    @setContentHeight()
    @
  
  setContentHeight: =>
    $(@el).css "height", PanelContainer.getAvailContentHeight()+"px"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.V_UserScriptManagerPanel extends Backbone.View
  
  initialize: =>
    @id = "userscriptmanager"
    @el = "#userscriptmanager"
    @tagname = "section"
    @classname = "content"
  
  render: =>
    @setContentHeight()
    @
  
  setContentHeight: =>
    $(@el).css "height", PanelContainer.getAvailContentHeight()+"px"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.V_UserScriptSettingsPanel extends Backbone.View
  
  initialize: ->
    @id = "userscriptsettings"
    @el = "#userscriptsettings"
    @tagname = "section"
    @classname = "content"
  
  render: =>
    @setContentHeight()
    @
  
  setContentHeight: =>
    $(@el).css "height", PanelContainer.getAvailContentHeight()+"px"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.V_NewUserScriptPanel extends Backbone.View
  
  initialize: ->
    @id = "newuserscript"
    @el = "#newuserscript"
    @tagname = "section"
    @classname = "content"
  
  render: =>
    @setContentHeight()
    @
  
  setContentHeight: =>
    $(@el).css "height", PanelContainer.getAvailContentHeight()+"px"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.V_KitScriptPreferencesPanel extends Backbone.View
  
  initialize: ->
    @id = "preferences"
    @el = "#preferences"
    @tagname = "section"
    @classname = "content"
    
    @initLocaleId = 'en_US'
  
  render: =>
    @setContentHeight()
    @
  
  setContentHeight: =>
    $(@el).css "height", PanelContainer.getAvailContentHeight()+"px"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.V_AboutKitScriptPanel extends Backbone.View
  
  initialize: ->
    @id = "aboutkitscript"
    @el = "#aboutkitscript"
    @tagname = "section"
    @classname = "content"
  
  render: =>
    @setContentHeight()
    @
  
  setContentHeight: =>
    $(@el).css "height", PanelContainer.getAvailContentHeight()+"px"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.O_PanelsCollection

  constructor: (@views) ->
    

  getPanelInstanceById: (panelId) =>
    for _v in @views
      return _v if _v.id is panelId


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.V_NavBarContainer extends Backbone.View
  
  initialize: ->
    @id = "topmenucontainer"
    @el = "#topmenucontainer"
    @tagname = "nav"
    @classname = "container"
    
    @menuItemBaseId = 'topmenu-nav-'
  
  render: =>
    templata =
      app_name:           KSApp.getLocaleDictKey KSApp.id, 'name'
      app_version:        KSApp.getLocaleDictKey KSApp.id, 'version'
      gs_link_face:       KSApp.getLocaleDictKey GlobalSettingsPanel.id, 'name'
      usm_link_face:      KSApp.getLocaleDictKey UserScriptManagerPanel.id, 'name'
      nus_link_face:      KSApp.getLocaleDictKey NewUserScriptPanel.id, 'name'
      pref_link_face:     KSApp.getLocaleDictKey KSPreferencesPanel.id, 'name'
      aks_link_face:      KSApp.getLocaleDictKey AboutKSPanel.id, 'name'
    $(@el).Macho templata
    @


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.V_KitScriptApp extends Backbone.View
  
  #events:
  #  'toolbarClick':       "onOpenApp"
  
  initialize: ->
    @id = 'app'
    @el = 'body'
    @tagname = 'body'
    
    @windowHeight = $(window).height()
    @windowWidth = $(window).width()
    @screenHeight = screen.height
    @screenWidth = screen.width
    
    @rootHtmlFolder = 'markups/'
    
    @initPanelId = 'userscriptmanager'
    @initFile = @rootHtmlFolder+'MainContainer.html'
    
    @on 'toolbarClick', @onOpenApp, @
  
  render: =>
    # Render Both Containers
    PanelsCollection.getPanelInstanceById(PanelContainer.currPanelId).render()
    NavBarContainer.render()
    # Render Footer
    @
  
  onOpenApp: =>
    SEController.openTab @initFile
    @render()
  
  getLocaleDictKey: (viewId, key) =>
    _locId = @getCurrentLocaleId()
    I18nLexicon.getDictKeyValue _locId, viewId, key
  
  getCurrentLocaleId: =>
    KSPreferencesPanel.initLocaleId
  
  getCurrentPanelId: =>
    @initPanelId
  
  getCurrentFile: =>
    @initFile
  
  getWindowHeight: =>
    @windowHeight
  
  getWindowWidth: =>
    @windowWidth
  
  getScreenHeight: =>
    @screenHeight
  
  getScreenWidth: =>
    @screenWidth


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.C_SafariExtensionController extends C_Utils
  
  constructor: ->
    super()
    @s = safari
    @tab = undefined
  
  openTab: (filePath) =>
    @tab = @s.application.activeBrowserWindow.openTab 'foreground', -1
    @tab.url = @s.extension.baseURI+filePath
  
  regEventListeners: =>
    @s.application.addEventListener "validate", @onValidateEvent, false
    @s.application.addEventListener "menu", @onMenuEvent, false
    @s.application.addEventListener "command", @onCommandEvent, false
    @s.application.addEventListener "beforeNavigate", @onBeforeNavigateEvent, false
    @s.application.addEventListener "navigate", @onNavigateEvent, false
    @s.application.addEventListener "message", @onProxyMessageEvent, false
  
  onValidateEvent: (event) =>
    
  
  onMenuEvent: (event) =>
    
  
  onCommandEvent: (event) =>
    switch event.command
       when 'open_tab' then KSApp.trigger "toolbarClick"
  
  onBeforeNavigateEvent: (event) =>
    
  
  onNavigateEvent: (event) =>
    
  
  onProxyMessageEvent: (event) =>
    
