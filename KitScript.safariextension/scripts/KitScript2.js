/**
 *  KitScript - A User Script Safari Extension
 */





 /**
  *  KSUtils (KitScript Utilitary Class)
  */
 var KSUtils = Class.create({

     initialize: function () {

         this._vl = 0;
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
var KSBase = Class.create({

    initialize: function () {

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
    },
    isEnabled: function () {
    
        return this._isEnabled;
    },
    toggleEnable: function () {
    
        this._isEnabled = !this._isEnabled;
    
        //_triggerNotEnabled();
    }
});





var KSContentManager = Class.create({
    
    initialize: function () {
        
        this.contents = [
            {
                id: "userscript-manager",
                title: "User Script Manager"
            },
            {
                id: "global-settings",
                title: "KitScript Settings"
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
    },
    _fadeOutContent: function (contentId) {
        
        ks.$(contentId).fadeOut('fast');
    },
    _fadeInContent: function (contentId) {
        
        ks.$(contentId).fadeIn('slow');
    },
    _setDocumentTitle: function (newTitle) {
        
        ks.$(document).title = "KitScript | "+newTitle;
    },
    getTitleByContentId: function (contentId) {
        
        for (var i=0; i < this.contents.length; i++) {
            
            if ('#'+this.contents[i].id == contentId)
                return this.contents[i].title;
        }
    },
    initContent: function () {
        
        this._fadeInContent(this.defaultContentId);
        this._setDocumentTitle(this.getTitleByContentId(this.defaultContentId));
    },
    transitContent: function (newContentId) {
        
        this._previousContentId = this._currentContentId;
        this._currentContentId = newContentId;
        
        this._fadeOutContent(this._previousContentId);
        this._fadeInContent(this._currentContentId);
        
        this._setDocumentTitle(this.getTitleByContentId(newContentId));
    }
});





/**
 *  KSPanel (KitScript User Scripts Main Panel Class)
 */
var KSMainPanel = Class.create(KSBase, {
    
    initialize: function ($super) {
        
        this._pageName = "MainPanel.html";
        
        $super();
        
        this.contentManager = new KSContentManager();
    },
    openPage: function ($super) {
        
        $super(this._pageName);
    }
});



/*


openUserScriptSettings: function (id) {
    
    //ks.scriptSettingsPanel.openPage(id);
},
disableUserScript: function (id) {
    
    //db.disableScript(id);
    
    //$('#user-script-'+id).addClass('disabled');
    //$('button','#us-list tbody tr td').attr('disabled','disabled');
},
deleteUserScript: function (id) {
    
    //db.remove(id);
    
    //$('#user-script-'+id).remove();
}

*/





/**
 *  KSNewPanel (KitScript New User Script Panel Class)
 *
var KSNewPanel = Class.create(KSBase, {
    
    initialize: function () {
        
        this._pageName = "newUserScriptPanel.html";
    },
    openPage: function ($super) {
        
        $super(this._pageName);
    },
    save: function (newUserScriptForm) {
        /*
        code = newUserScriptForm.us-code;
        
        us = new UserScript(code);
        
        name = us.getName();
        desc = us.getDescription();
        includes = us.getIncludes().join(",");
        excludes = us.getExcludes().join(",");
        disabled = 0;
        
        db.create(name, desc, includes, excludes, code, disabled);
        *
    },
    autoSave: function () {
        
        
    }
});
*/




/**
 *  KSSettingsPanel (KitScript User Script Settings Panel Class)
 *
var KSSettingsPanel = Class.create(KSBase, {
    
    initialize: function () {
        
        this._pageName = "scriptSettingsPanel.html";
    },
    openPage: function ($super, scriptId) {
        
        this._scriptId = scriptId;
        
        $super(this._pageName);
        
        //this.showUserSettings();
    },
    close: function ($super) {
        
        //$super();
    },
    showUserSettings: function () {
        
        
    },
    showScriptSettings: function () {
        
        
    },
    showScriptEdition: function () {
        
        
    },
    saveUserSettings: function () {
        
        
    },
    saveScriptSettings: function () {
        
        
    },
    saveScriptEdition: function (userScriptForm) {
        /*
        id = userScriptForm.us-id;
        
        code = userScriptForm.us-code;
        
        us = new UserScript(code);
        
        name = us.getName();
        desc = us.getDescription();
        includes = us.getIncludes().join(",");
        excludes = us.getExcludes().join(",");
        disabled = userScriptForm.isDisabled;
        
        db.update(name, desc, includes, excludes, code, disabled, id);
        *
    }
});
*/




/**
 *  KSStorage (KitScript Storage Class)
 */
var KSStorage = Class.create(Storage, {
    
    initialize: function ($super) {
        
        this._dbName = 'KitScript';
        this._dbVersion = '1.0';
        this._dbDisplayName = 'KitScript';
        this._dbSize = 10 * 1024 * 1024; // 10 MB in bytes
        
        this._dbTable = "UserScripts";
        
        this._isDbExistant = false;
        
        $super(this._dbName, this._dbVersion, this._dbDisplayName, this._dbSize);
    },
    connect: function ($super) {
        
        _db = $super();
        
        this._verifyDb();
        
        return _db;
    },
    isDbExistant: function () {
        
        return this._isDbExistant;
    },
    _verifyDb: function () {
        
        this._isDbExistant = false;
        
        _fH = function (transaction, resultSet) {
            
            var _db = transaction.storageInstance;
            
            _statementCallback(transaction, resultSet);
            
            if (resultSet.rows.length > 0) {
                
                var _row = resultSet.rows.item(0);
                
                if (_row['name'] == _db._dbTable) {
                    
                    _db._isDbExistant = true;
                }
            }
            
            return this._isDbExistant;
        }
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT name FROM sqlite_master WHERE type=? AND name=?;", ["table",this._dbTable], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    createTable: function (isDropAllowed) {
        
        if (isDropAllowed === true) {
            
            _fH = function () { console.log("Table dropped."); };
            
            sqlArray = new SQLStatementsArray();
            
            sqlArray.push(this, 'DROP TABLE '+this._dbTable+';', [], _fH, _errorHandler);
            
            this.transact(sqlArray);
        }
        
        _fH = function () { console.log("Table created."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS '+this._dbTable+' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL, whitelist TEXT NOT NULL, blacklist TEXT NOT NULL, script TEXT NOT NULL, disabled INT NOT NULL DEFAULT 0);', [], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    insert: function (name, desc, includes, excludes, code, disabled) {
        
        _fH = function () { console.log("Data inserted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "INSERT INTO "+this._dbTable+" (name, description, whitelist, blacklist, script, disabled) VALUES (?, ?, ?, ?, ?, ?);", [name, desc, includes, excludes, code, disabled], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    update: function (id, name, desc, includes, excludes, code, disabled) {
        
        _fH = function () { console.log("Data updated."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "UPDATE "+this._dbTable+" SET name = ?, description = ?, whitelist = ?, blacklist = ?, script = ?, disabled = ? WHERE id = ?;", [name, desc, includes, excludes, code, disabled, id], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetch: function (id, fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT * FROM "+this._dbTable+" WHERE id = ?;", [id], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetchAll: function (offset, limit, fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT * FROM "+this._dbTable+" LIMIT ?, ?;", [offset, limit], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    remove: function (id) {
        
        _fH = function () { console.log("Data deleted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "DELETE FROM "+this._dbTable+" WHERE id = ?;", [id], _fH, _killTransaction);
        
        this.transact(sqlArray);
    },
    disableScript: function (id) {
        
        _fH = function () { console.log("Script disabled."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "UPDATE "+this._dbTable+" SET disabled = 1 WHERE id = ?;", [id], _fH, _errorHandler);
        
        this.transact(sqlArray);
    }
});





var KitScript = Class.create(KSUtils, {
    
    initialize: function ($super) {
        
        this.db = new KSStorage();
        this.$ = jQuery;
        this.mainPanel = new KSMainPanel();
        
        try {
            
            this.db.connect();
        } catch (e) {
            
            ks.log(e.getMessage());
        }
        
        $super();
        
        this.setVerboseLevel(1);
    }
});





function _ksCommandHandler(event) {
    
    switch (event.command)
    {
        case "close":
            
            ks.log("Something closed.");
            //ks.mainPanel.close();
            break;
        case "toggle_enable":
            
            
            break;
        case "open_tab":
            
            ks.mainPanel.openTab();
            ks.mainPanel.setTabPage(ks.mainPanel.defaultPage);
            ks.mainPanel.contentManager.initContent();
            break;
        case "goto_manage":
            
            
            break;
        case "goto_new":
            
            
            break;
        case "goto_globsettings":
            
            
            break;
    }
}





function _ksValidateHandler(event) {
    
    switch (event.command)
    {
        case "close":
            
            
            break;
        case "toggle_enable":
            
            
            break;
        case "open_panel":
            
            //if (ks.mainPanel.isTabOpen() === true) {
                
            //    ks.mainPanel.openPage(ks.mainPanel.defaultPage);
            //}
            break;
        case "goto_manage":
            
            
            break;
        case "goto_new":
            
            
            break;
        case "goto_globsettings":
            
            
            break;
    }
}





safari.application.addEventListener("command", _ksCommandHandler, false);
safari.application.addEventListener("validate", _ksValidateHandler, false);


