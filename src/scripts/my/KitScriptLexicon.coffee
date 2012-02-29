# KitScript - A User Script Manager For Safari
#
# @author Seraf Dos Santos <webmaster@cyb3r.ca>
# @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
# @license MIT License
# @version 2.0
#
# KitScriptLexicon.js - Javascript file containing the main extension's lexicon





lexicon =
  locales: [
    {
      id: 'en_US'
      language: 'english'
      dictIndex: 0
    }
    {
      id: 'fr_FR'
      language: 'français'
      dictIndex: 1
    }
    {
      id: 'pt_BR'
      language: 'português'
      dictIndex: 2
    }
  ]
  
  views: [
    {
      id: 'app'
      dict:
        name: [
          'KitScript'
          'KitScript'
          'KitScript'
        ]
        version: [
          '2.0'
          '2.0'
          '2.0'
        ]
        desc: [
          'A User Script Manager For Safari'
          ''
          ''
        ]
        websiteFace: [
          'KitScript Website'
          'Site de KitScript'
          ''
        ]
        copyright: [
          'All rights reserved.'
          'Touts droits réservés.'
          ''
        ]
    }
    {
      id: 'topmenu-container'
      #dict:
        
    }
    {
      id: 'globalsettings'
      dict:
        name: [
          'Global Settings'
          'Configurations globales'
          'Configurações globais'
        ]
        title: [
          ''
          ''
          ''
        ]
        desc: [
          ''
          ''
          ''
        ]
    }
    {
      id: 'userscriptmanager'
      dict:
        name: [
          'User Script Manager'
          'Gestionnaire des userscripts'
          'O userscript gerente'
        ]
        title: [
          'User Script Manager'
          ''
          ''
        ]
        desc: [
          'Manage your user scripts on this panel'
          ''
          ''
        ]
        subtitle: [
          'User Scripts'
          'Userscripts'
          ''
        ]
        alertTitle: [
          'Achtung!'
          'Achtung!'
          'Achtung!'
        ]
        alertText: [
          'You are about to delete a user script. You can\'t recuperate a deleted user script.'
          ''
          ''
        ]
        alertQuestion: [
          'Are you shure you want to delete it?'
          ''
          ''
        ]
        alertYesButton: [
          'Yes, delete it!'
          ''
          ''
        ]
        alertNoButton: [
          'No, I\'ll keep it.'
          ''
          ''
        ]
    }
    {
      id: 'userscriptsettings'
      dict:
        name: [
          'User Script Settings'
          'Préférences du userscript'
          'Preferências do userscript'
        ]
        title: [
          ''
          ''
          ''
        ]
        desc: [
          ''
          ''
          ''
        ]
    }
    {
      id: 'newuserscript'
      dict:
        name: [
          'New User Script'
          'Nouveau userscript'
          'Novo userscript'
        ]
        title: [
          'New User Script'
          ''
          ''
        ]
        desc: [
          'Paste your new user script below'
          ''
          ''
        ]
        subtitle: [
          'Add a User Script'
          ''
          ''
        ]
        editorHelp: [
          'Enter or paste the user script code in the field above and press the "Add" button below to add the script in KitScript\'s database.'
          ''
          ''
        ]
        editorButtonAdd: [
          'Add'
          ''
          ''
        ]
        panelTipTitle: [
          'Paneltip'
          ''
          ''
        ]
        panelTipText1: [
          'You can code your user script directly in the text area or write it in an external editor and paste it in.'
          ''
          ''
        ]
        panelTipText2: [
          'Later on, you\'ll be able to make changes and update it in the <em><b>User Script Settings</b></em> panel.'
          ''
          ''
        ]
    }
    {
      id: 'preferences'
      dict:
        name: [
          'KitScript Preferences'
          'Préférences de KitScript'
          'Preferências do KitScript'
        ]
        title: [
          ''
          ''
          ''
        ]
        desc: [
          ''
          ''
          ''
        ]
    }
    {
      id: 'aboutkitscript'
      dict:
        name: [
          'About KitScript'
          'À propos de KitScript'
          'Sobre o KitScript'
        ]
        title: [
          'About KitScript'
          ''
          ''
        ]
        desc: [
          'Stuff about the User Script Safari Extension'
          ''
          ''
        ]
        mdText: [
          "## About The Safari Extension

          **KitScript** is an open source Safari Extension initially developed by Seraf Dos Santos and hosted on [GitHub](https://github.com/Syr3f/KitScript).

          The project was started in the fall of 2011 and was/is mainly inspired by the defunct (or no more maintained) User Script Safari Extensions/Add-Ons: *GreaseKit* &amp; *NinjaKit*.

          The open source **[KitScript](https://syr3fgithub.com/KitScript)** project is to be developed and thouroughly maintained by the open source community and we'll always be looking for developers for its evolutive and maintenance process.

          For any bugs, [open an issue on GitHub](https://github.com/Syr3f/KitScript/issues). There's a [Wiki](http://www.kitscript.com/wiki/) being assembled for **KitScript**, we're always welcoming any help or pull requests; keep'em coming.

          Enjoy!"
          ""
          ""
        ]
        panelTipTitle1: [
          'Links &amp; References'
          ''
          ''
        ]
        panelTipTitle2: [
          'Other Relevant Links'
          ''
          ''
        ]
    }
  ]

class window.C_I18nLexicon extends C_Utils
  
  constructor: ->
    super()
  
  getLocalesCount: =>
    lexicon.locales.length
  
  getLocaleByIndex: (idx) =>
    for _loc in lexicon.locales
      return _loc.id if _loc.dictIndex is idx
  
  getDictIndexByLocaleId: (id) =>
    for _loc in lexicon.locales
      return _loc.dictIndex if _loc.id is id
  
  getDictKeyValue: (localeId, viewId, key) =>
    _idx = @getDictIndexByLocaleId localeId
    _dict = @getDictByViewId viewId
    for _key of _dict
      return eval "_dict."+key+"[_idx]" if _key is key
  
  getDictByViewId: (viewId) =>
    for _view in lexicon.views
      return _view.dict if _view.id is viewId

