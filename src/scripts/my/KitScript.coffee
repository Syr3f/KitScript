# KitScript - A User Script Manager For Safari
#
# @author Seraf Dos Santos <webmaster@cyb3r.ca>
# @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
# @license MIT License
# @version 2.0
#
# KitScript.js - Javascript file containing base classes used globally in the 
# extension.





class window.M_KitScriptPreferencesModel extends Backbone.Model
  
  localStorage: "KitScript"
  
  initialize: ->
    

class window.V_KitScriptPreferencesPanel extends Backbone.View
  
  initialize: ->
    
  
  render: =>
    
    @


# # # 


class window.V_GlobalSettingsPanel extends Backbone.View
  
  initialize: ->
    
  
  render: =>
    @setContentHeight()
    @
  
  setContentHeight: =>
    $(@el).css "height", PanelContainer.getAvailContentHeight()+"px"





class window.V_UserScriptManagerPanel extends Backbone.View
  
  initialize: ->
    
  
  render: =>
    @setContentHeight()
    @
  
  setContentHeight: =>
    $(@el).css "height", PanelContainer.getAvailContentHeight()+"px"





class window.V_UserScriptSettingsPanel extends Backbone.View
  
  initialize: ->
    
  
  render: =>
    @setContentHeight()
    @
  
  setContentHeight: =>
    $(@el).css "height", PanelContainer.getAvailContentHeight()+"px"





class window.V_NewUserScriptPanel extends Backbone.View
  
  initialize: ->
    
  
  render: =>
    @setContentHeight()
    @
  
  setContentHeight: =>
    $(@el).css "height", PanelContainer.getAvailContentHeight()+"px"





class window.V_AboutKitScriptPanel extends Backbone.View
  
  initialize: ->
    
  
  render: =>
    @setContentHeight()
    @
  
  setContentHeight: =>
    $(@el).css "height", PanelContainer.getAvailContentHeight()+"px"





class window.O_PanelsCollection extends Backbone.Collection
  
  initialize: ->
    
  
  getPanelInstanceById: (panelId) =>
    for _p in @models
      _p if _p.id is panelId

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.V_PanelContainer extends Backbone.View
  
  initialize: ->
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
    PanelsCollection.getPanelInstanceById(@currPanelId).render()
    PanelsCollection.getPanelInstanceById(NavBarContainer.id).render()
    @
  
  setTabTitle: () =>
    document.title = KSApp.getDictKeyValue('app','name')+' | '+KSApp.getDictKeyValue(@currPanelId,'title')
  
  transitTo: (toPanelId) =>
    @pop 1
    @prevPanelId = @currPanelId
    @currPanelId = toPanelId
    @prevNavItemId = @currNavItemId
    @currNavItemId = NavBarContainer.menuItemBaseId+toPanelId
    @render()
  
  getAvailContentHeight: =>
    _offset = $(@el).offset()
    KSApp.windowHeight-_offset.top-@topOffset-@bottomOffset





class window.V_NavBarContainer extends Backbone.View
  
  initialize: ->
    @menuItemBaseId = 'topmenu-nav-'
  
  render: =>
    templata =
      app_name:           KSApp.getDictKeyValue 'app', 'name'
      app_version:        KSApp.getDictKeyValue 'app', 'version'
      gs_link_face:       KSApp.getDictKeyValue GlobalSettingsPanel.id, 'name'
      usm_link_face:      KSApp.getDictKeyValue UserScriptManagerPanel.id, 'name'
      nus_link_face:      KSApp.getDictKeyValue NewUserScriptPanel.id, 'name'
      pref_link_face:     KSApp.getDictKeyValue KSPreferencesPanel.id, 'name'
      aks_link_face:      KSApp.getDictKeyValue AboutKSPanel.id, 'name'
    $(@el).Macho templata
    @


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


class window.V_KitScriptApp extends Backbone.View
  
  #events:
  #  'toolbarClick':       "onOpenApp"
  
  initialize: ->
    @windowHeight = $(window).height()
    @windowWidth = $(window).width()
    @screenHeight = screen.height
    @screenWidth = screen.width
    
    @rootHtmlFolder = 'markups/'
    
    @initPanelId = 'userscriptmanager'
    @initFile = @rootHtmlFolder+'MainContainer.html'
    @initLocaleId = 'en_US'
    
    @on 'toolbarClick', @onOpenApp, @
  
  onOpenApp: =>
    SEController.openTab @initFile
    AppRouter.navigate @initPanelId, {trigger: true}
  
  getLocaleDictKey: (viewId, key) =>
    _locId = @getCurrentLocaleId
    I18nLexicon.getDictKeyValue _locId, viewId, key
  
  getCurrentLocaleId: =>
    @initLocaleId


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
    
