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





/**
 *  KSContentManager (KitScript Content Manager for the Main Panel)
 */
var KSContentManager = Class.create({
    
    initialize: function () {
        
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
    },
    _hideContent: function (contentId) {
        
        ks.$('#'+contentId).css('display','none');
    },
    _showContent: function (contentId) {
        
        ks.$('#'+contentId).css('display','block');
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





var KSGlobalSettingsForm = Class.create({
    
    initialize: function () {
        
        
    },
    addExclude: function () {
        
        ks.$('#ks-gs-add-modal').modal('show');
    },
    editExclude: function () {
        
        
    },
    removeExclude: function () {
        
        
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
 *  KSStorage (KitScript Storage Class)
 */
var KSStorage = Class.create(Storage, {
    
    initialize: function ($super) {
        
        this._dbName = 'KitScript';
        this._dbVersion = '1.0';
        this._dbDisplayName = 'KitScript';
        this._dbSize = 10 * 1024 * 1024; // 10 MB in bytes
        
        this._isDbExistant = false;
        
        $super(this._dbName, this._dbVersion, this._dbDisplayName, this._dbSize);
        
        this._dbTableUserScripts = "UserScripts";
        this._dbTableGlobalExcludes = "GlobalExcludes";
        this._dbTableKitScript = "KitScript";
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
        
        _fH = function (transaction, resultSet) {
            
            var _db = transaction.objInstance;
            
            if (resultSet.rows.length > 0) {
                
                var _row = resultSet.rows.item(0);
                
                if (_row['name'] == _db._dbTableUserScripts) {
                    
                    _db._isDbExistant = true;
                } else {
                    
                    //_db.createTables();
                    
                    _db._isDbExistant = false;
                }
            }
        }
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT name FROM sqlite_master WHERE type=? AND name=?;", ['table',this._dbTableUserScripts], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    createTables: function (doDrop) {
        
        if (doDrop === true) {
            
            _fH = function () { console.log("Table dropped."); };
            
            sqlArray = new SQLStatementsArray();
            
            sqlArray.push(this, 'DROP TABLE UserScripts;', [], _fH, _errorHandler);
            sqlArray.push(this, 'DROP TABLE GlobalExcludes;', [], _fH, _errorHandler);
            sqlArray.push(this, 'DROP TABLE KitScript;', [], _fH, _errorHandler);
            
            this.transact(sqlArray);
        }
        
        _fH1 = function () { console.log("Table created."); };
        _fH2 = function () { console.log("Data inserted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS UserScripts (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL, whitelist TEXT NOT NULL, blacklist TEXT NOT NULL, script TEXT NOT NULL, disabled INT NOT NULL DEFAULT 0);', [], _fH1, _errorHandler);
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS GlobalExcludes (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL);', [], _fH1, _errorHandler);
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS KitScript (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, enabled INT NOT NULL DEFAULT 1);', [], _fH1, _errorHandler);
        sqlArray.push(this, "INSERT INTO KitScript (enabled) VALUES (1);", [], _fH2, _errorHandler);
        
        this.transact(sqlArray);
    },
    insertUserScript: function (name, desc, includes, excludes, code, disabled) {
        
        _fH = function () { console.log("Data inserted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "INSERT INTO "+this._dbTableUserScripts+" (name, description, whitelist, blacklist, script, disabled) VALUES (?, ?, ?, ?, ?, ?);", [name, desc, includes, excludes, code, disabled], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    updateUserScript: function (id, name, desc, includes, excludes, code, disabled) {
        
        _fH = function () { console.log("Data updated."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "UPDATE "+this._dbTableUserScripts+" SET name = ?, description = ?, whitelist = ?, blacklist = ?, script = ?, disabled = ? WHERE id = ?;", [name, desc, includes, excludes, code, disabled, id], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetchUserScript: function (id, fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT * FROM "+this._dbTableUserScripts+" WHERE id = ?;", [id], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetchAllUserScripts: function (offset, limit, fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT * FROM "+this._dbTableUserScripts+" LIMIT ?, ?;", [offset, limit], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    removeUserScript: function (id) {
        
        _fH = function () { console.log("Data deleted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "DELETE FROM "+this._dbTableUserScripts+" WHERE id = ?;", [id], _fH, _killTransaction);
        
        this.transact(sqlArray);
    },
    disableUserScript: function (id) {
        
        _fH = function () { console.log("Script disabled."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "UPDATE "+this._dbTableUserScripts+" SET disabled = 1 WHERE id = ?;", [id], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    insertGlobalExclude: function (url) {
        
        _fH = function () { console.log("Data inserted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "INSERT INTO "+this._dbTableGlobalExcludes+" (url) VALUES (?);", [url], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    updateGlobalExclude: function (id, url) {
        
        _fH = function () { console.log("Data updated."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "UPDATE "+this._dbTableGlobalExcludes+" SET url = ? WHERE id = ?;", [url, id], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetchGlobalExclude: function (id, fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT * FROM "+this._dbTableGlobalExcludes+" WHERE id = ?;", [id], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetchAllGlobalExcludes: function (offset, limit, fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT * FROM "+this._dbTableGlobalExcludes+" LIMIT ?, ?;", [offset, limit], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    removeGlobalExclude: function (id) {
        
        _fH = function () { console.log("Data deleted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "DELETE FROM "+this._dbTableGlobalExcludes+" WHERE id = ?;", [id], _fH, _killTransaction);
        
        this.transact(sqlArray);
    },
    isKitScriptEnabled: function (obj, _fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(obj, "SELECT enabled FROM "+this._dbTableKitScript+" WHERE id = 1;", [], _fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    setKitScriptEnabled: function (_fH) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "UPDATE "+this._dbTableKitScript+" SET enabled = 1 WHERE id = 1;", [], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    setKitScriptDisabled: function (_fH) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "UPDATE "+this._dbTableKitScript+" SET enabled = 0 WHERE id = 1;", [], _fH, _errorHandler);
        
        this.transact(sqlArray);
    }
});





var KitScript = Class.create(KSUtils, {
    
    initialize: function ($super) {
        
        this._isEnabled = true;
        
        this.db = new KSStorage();
        this.$ = jQuery;
        this.mainPanel = new KSMainPanel();
        this.mainPanel.contentManager = new KSContentManager();
        
        this.mainPanel.globalSettingsForm = new KSGlobalSettingsForm();
        
        try {
            
            this.db.connect();
        } catch (e) {
            
            ks.log(e.getMessage());
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

