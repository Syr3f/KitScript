# KitScript - A User Script Manager For Safari
#
# @author Seraf Dos Santos <webmaster@cyb3r.ca>
# @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
# @license MIT License
# @version 2.0
#
# Global.js - Javascript file containing global extension initial methods &
# function calls.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


window.SEController = new C_SafariExtensionController()
SEController.regEventListeners()

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 

window.KSApp = new V_KitScriptApp()
_.extend KSApp, _Utils

window.NavBarContainer = new V_NavBarContainer()
_.extend NavBarContainer, _Utils

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 

window.PanelContainer = new V_PanelContainer()
_.extend PanelContainer, _Utils

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 

window.AppRouter = new R_AppRouter()
_.extend AppRouter, _Utils

window.I18nLexicon = new C_I18nLexicon()

window.KSPreferences = new M_KitScriptPreferencesModel()
_.extend KSPreferences, _Utils

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 

window.GlobalSettingsPanel = new V_GlobalSettingsPanel()
_.extend GlobalSettingsPanel, _Utils

window.UserScriptManagerPanel = new V_UserScriptManagerPanel()
_.extend UserScriptManagerPanel, _Utils

window.UserScriptSettingsPanel = new V_UserScriptSettingsPanel()
_.extend UserScriptSettingsPanel, _Utils

window.NewUserScriptPanel = new V_NewUserScriptPanel()
_.extend NewUserScriptPanel, _Utils

window.KSPreferencesPanel = new V_KitScriptPreferencesPanel {
  'model': KSPreferences
}
_.extend KSPreferencesPanel, _Utils

window.AboutKSPanel = new V_AboutKitScriptPanel()
_.extend AboutKSPanel, _Utils

window.PanelsCollection = new O_PanelsCollection [GlobalSettingsPanel, UserScriptManagerPanel, UserScriptSettingsPanel, NewUserScriptPanel, KSPreferencesPanel, AboutKSPanel]
_.extend PanelsCollection, _Utils

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 

# Last Setting
Backbone.history.start {root: safari.extension.baseURI+'markups/'}

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 