/**
 *  KitScript - A User Script Safari Extension
 *
 *  KitScript.js - Javascript file containing base classes (by Prototype.js)
 *  used globally in the extension.
 *
 *  @author Seraf Dos Santos
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */





 /**
  *  KSUtils (KitScript Utilitary Class)
  */
 var KSUtils = Class.create({

     initialize: function () {

         this._vl = 0;
         this.db = new KSStorage();
         this.gm = new KSGMUS();
         this.$ = jQuery;
     },
     /**
      *  @param int verboseLevel (0=Silenced,1=Console,2=BrowserAlert)
      */
     setVerboseLevel: function (verboseLevel) {

         this._vl = verboseLevel;
     },
     log: function (msg) {

         switch (this._vl) {

             case 2:
                 alert(msg);
             case 1:
                 console.log(msg);
                 break;
             case 0:
             default:
                 // Silence
         }
     }
 });





/**
*  KSBase (KitScript Base Object Class)
*/
var KSBase = Class.create(KSUtils, {

    initialize: function ($super) {
        
        $super();
        
        this._isTabOpen = false;
        
        this.defaultPage = 'MainPanel.html';
        
        this._previousPage = null;
        this._currentPage = this.defaultPage;
        
        this._tab = null;
        this._url = null;
        
        this._isEnabled = true;
    },
    openPage: function (page) {
        
        if (this._isTabOpen === false)
            this.openTab();
            
        this.setTabPage(page);
    },
    closePage: function () {
        
        this.setTabPage(this.defaultPage);
        this.closeTab();
    },
    setTabPage: function (page) {
        
        this._previousPage = this._currentPage;
        this._currentPage = page;
        
        this._tab.url = location.href.replace(this._previousPage, this._currentPage);
    },
    openTab: function () {
        
        this._tab = safari.application.activeBrowserWindow.openTab('foreground',-1);
        this._isTabOpen = true;
    },
    closeTab: function () {
        
        if (this._tab !== null) {
            
            this._tab.close();
            this._tab = null;
            this._isTabOpen = false;
        }
    },
    isTabOpen: function () {
        
        return this._isTabOpen;
    }
});





/**
 *  KSMainPanel (KitScript User Scripts Main Panel Class)
 */
var KSMainPanel = Class.create(KSBase, {
    
    initialize: function ($super) {
        
        this._pageName = "MainPanel.html";
        this.contentManager = null;
        this.globalSettingsForm = null;
        
        $super();
    },
    openPage: function ($super) {
        
        $super(this._pageName);
    }
});





var KSGlobalSettingsForm = Class.create(KSUtils, {
    
    initialize: function ($super) {
        
        $super();
    },
    addExclude: function () {
        
        this.$('#ks-gs-add-modal').modal('show');
    },
    editExclude: function () {
        
        
    },
    removeExclude: function () {
        
        
    }
});





var KSNewUserScriptForm = Class.create(KSUtils, {
    
    initialize: function ($super) {
        
        $super();
        
        this._formId = 'ks-aus-form';
        this._textareaId = 'ks-aus-script';
    },
    addUserScript: function () {
        
        var _script = this.$('#'+this._textareaId).val();
        
        
    }
});





var KSUserScriptsManagerForm = Class.create(KSUtils, {
    
    initialize: function ($super) {
        
        $super();
    },
    openUserScriptSettings: function (id) {
        
        
    },
    disableUserScript: function (id) {
        
        
    },
    deleteUserScript: function (id) {
        
        
    }
});





var KSUserScriptSettingsForm = Class.create(KSUtils, {
    
    initialize: function ($super) {
        
        $super();
    }
});




/**
 *  KSContentManager (KitScript Content Manager for the Main Panel)
 */
var KSContentManager = Class.create(KSUtils, {
    
    initialize: function ($super) {
        
        $super();
        
        this.contents = [
            {
                id: "userscript-manager",
                title: "User Script Manager"
            },
            {
                id: "global-settings",
                title: "Global Settings"
            },
            {
                id: "new-userscript",
                title: "User Script Editor"
            },
            {
                id: "about",
                title: "About KitScript"
            }
        ];
        
        this.defaultContentId = this.contents[0].id;
        
        this._currentContentId = this.defaultContentId;
        this._previousContentId = null;
        
        
        this.globalSettingsForm = new KSGlobalSettingsForm();
        this.newUserScriptForm = new KSNewUserScriptForm();
        this.userScriptsManager = new KSUserScriptsManagerForm();
        this.userScriptSettingsForm = new KSUserScriptSettingsForm();
    },
    _hideContent: function (contentId) {
        
        this.$('#'+contentId).css('display','none');
    },
    _showContent: function (contentId) {
        
        this.$('#'+contentId).css('display','block');
    },
    _setDocumentTitle: function (newTitle) {
        
        document.title = "KitScript | "+newTitle;
    },
    _cleanContentIdStr: function (contentId) {
        
        if (contentId.substr(0,1) == '#')
            return contentId.substr(1,contentId.length);
        else
            return contentId;
    },
    getTitleByContentId: function (contentId) {
        
        _contentId = this._cleanContentIdStr(contentId);
        
        for (var i=0; i < this.contents.length; i++) {
            
            if (this.contents[i].id == _contentId)
                return this.contents[i].title;
        }
    },
    initContent: function () {
        
        this._setDocumentTitle(this.getTitleByContentId(this.defaultContentId));
    },
    transitContent: function (newContentId) {
        
        _contentId = this._cleanContentIdStr(newContentId);
        
        this._previousContentId = this._currentContentId;
        this._currentContentId = _contentId;
        
        this._hideContent(this._previousContentId);
        this._showContent(this._currentContentId);
        
        this._setDocumentTitle(this.getTitleByContentId(_contentId));
    }
});





var KitScript = Class.create(KSUtils, {
    
    initialize: function ($super) {
        
        this._isEnabled = true;
        
        this.mainPanel = new KSMainPanel();
        this.mainPanel.contentManager = new KSContentManager();
        
        try {
            
            this.db.connect();
        } catch (e) {
            
            this.log(e.getMessage());
        }
        
        $super();
        
        this.setVerboseLevel(1);
    },
    isEnabled: function () {
        
        return this._isEnabled;
    },
    setEnable: function () {
        
        _fH = function (transaction, resultSet) {
            
            jQuery('#toggle-enable-dropdown').text("KitScript is Enabled!");
        };
        
        if (!this.isEnabled()) {
            
            this.db.setKitScriptEnabled(_fH);
            this._isEnabled = true;
            //this.$('#toggle-enable-dropdown').text("KitScript is Enabled!");
        }
    },
    setDisable: function () {
        
        _fH = function () {
            
            jQuery('#toggle-enable-dropdown').text("KitScript is Disabled!");
            
            console.log("KitScript is disabled.");
        };
        
        if (this.isEnabled()) {
            
            this.db.setKitScriptDisabled(_fH);
            this._isEnabled = false;
            //this.$('#toggle-enable-dropdown').text("KitScript is Disabled!");
        }
    },
    declareEnabled: function () {
        
        _fH = function (transaction, resultSet) {
            
            _ks = transaction.objInstance;
            
            if (resultSet.rows.length > 0) {
                
                _row = resultSet.rows.item(0);
                
                if (parseFloat(_row['enabled']) == 1) {
                    
                    _ks._isEnabled = true;
                    
                    _ks.$('#toggle-enable-dropdown').text("KitScript is Enabled!");
                } else {
                    
                    _ks._isEnabled = false;
                    
                    _ks.$('#toggle-enable-dropdown').text("KitScript is Disabled!");
                }
            }
            
        }
        
        this.db.isKitScriptEnabled(this, _fH);
    }
});





function _ksCommandHandler(event) {
    
    switch (event.command)
    {
        case "open_tab":
            ks.mainPanel.openTab();
            ks.mainPanel.setTabPage(ks.mainPanel.defaultPage);
            break;
    }
}

function _ksValidateHandler(event) {
    
    switch (event.command)
    {
        case "open_tab":
            break;
    }
}

safari.application.addEventListener("command", _ksCommandHandler, false);
safari.application.addEventListener("validate", _ksValidateHandler, false);

