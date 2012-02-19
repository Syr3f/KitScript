# KitScript - A User Script Manager For Safari
#
# @author Seraf Dos Santos <webmaster@cyb3r.ca>
# @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
# @license MIT License
# @version 2.0
#
# Routes.js - Javascript file containing the application routes.





class window.R_AppRouter extends Backbone.Router
  
  initialize: (options) ->
    
  
  routes:
    "globalsettings":               "onTransitToGlobalSettings"         # MainContainer.html#globalsettings
    "userscriptmanager":            "onTransitToUserScriptManager"      # MainContainer.html#userscriptmanager
    "newuserscript":                "onTransitToNewUserScript"          # MainContainer.html#newuserscript
    "userscriptsettings":           "onTransitToUserScriptSettings"     # MainContainer.html#userscriptsettings
    "preferences":                  "onTransitToKitScriptPreferences"   # MainContainer.html#preferences
    "aboutkitscript":               "onTransitToAboutKitScript"         # MainContainer.html#aboutkitscript
  
  onTransitToGlobalSettings: =>
    @pop 0
    PanelContainer.transitTo GlobalSettingsPanel.id
  
  onTransitToUserScriptManager: =>
    @pop "onTransitToUserScriptManager"
    PanelContainer.transitTo UserScriptManagerPanel.id
  
  onTransitToNewUserScript: =>
    @pop 0
    PanelContainer.transitTo NewUserScriptPanel.id
  
  onTransitToUserScriptSettings: =>
    @pop 0
    PanelContainer.transitTo UserScriptSettingsPanel.id
  
  onTransitToKitScriptPreferences: =>
    @pop 0
    PanelContainer.transitTo KSPreferencesPanel.id
  
  onTransitToAboutKitScript: =>
    @pop 0
    PanelContainer.transitTo AboutKSPanel.id
  
  test: =>
    @pop "test"
