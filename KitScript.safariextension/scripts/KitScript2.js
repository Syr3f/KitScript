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
 *  KSManagementPanel (KitScript User Scripts Management Panel Class)
 */
var KSManagementPanel = Class.create(KSBase, {
    
    initialize: function () {
        
        this._pageName = "managementPanel.html";
    },
    openPanel: function () {
        
        this.openPage(this._pageName);
    },
    openSettings: function (id) {
        
        //ks.scriptSettingsPanel.openPage(id);
    },
    disable: function (id) {
        
        //db.disableScript(id);
        
        //$('#user-script-'+id).addClass('disabled');
        //$('button','#us-list tbody tr td').attr('disabled','disabled');
    },
    remove: function (id) {
        
        //db.remove(id);
        
        //$('#user-script-'+id).remove();
    }
});





/**
 *  KSNewPanel (KitScript New User Script Panel Class)
 */
/*
var KSNewPanel = Class.create(KSBase, {
    
    initialize: function () {
        
        this._page = "newUserScriptPanel.html";
    },
    openPage: function ($super) {
        
        $super(this._page);
    },
    close: function ($super) {
        
        //$super();
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
        */
        /*
    },
    autoSave: function () {
        
        
    }
});





/**
 *  KSSettingsPanel (KitScript User Script Settings Panel Class)
 */
/*
var KSSettingsPanel = Class.create(KSBase, {
    
    initialize: function () {
        
        this._page = "scriptSettingsPanel.html";
    },
    openPage: function ($super, scriptId) {
        
        this._scriptId = scriptId;
        
        $super(this._page);
        
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
        */
        /*
    }
});
*/





/**
 *  KSBase (KitScript Base Object Class)
 */
var KSBase = Class.create({
    
    initialize: function () {
        
        this._isTabOpen = false;
        
        this.defaultPage = 'main.html';
        
        this._previousPage = null;
        this._currentPage = this.defaultPage;
        
        this._tab = null;
        this._url = null;
    },
    openPage: function (page) {
        
        if (this._tab === null)
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
        
        this._tab.url = location.href.replace(this._previousPage, 'markups/'+this._currentPage);
        this._url = this._tab.url;
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
 *  KSStorage (KitScript Storage Class)
 *
var KSStorage = Class.create(Storage, {
    
    initialize: function ($super) {
        
        this._dbName = 'KitScript';
        this._dbVersion = '1.0';
        this._dbDisplayName = 'KitScript';
        this._dbSize = 10 * 1024 * 1024; // 10 MB in bytes
        
        $super(this._dbName, this._dbVersion, this._dbDisplayName, this._dbSize);
    },
    connect: function ($super) {
        
        return $super();
    },
    createTable: function (isDropAllowed) {
        
        if (isDropAllowed) {
            
            _fH = function () { console.log("Table dropped."); };
            
            sqlArray = new SQLStatementsArray();
            
            sqlArray.push('DROP TABLE UserScripts;', [], _fH, _errorHandler);
            
            this.transact(sqlArray);
        }
        
        _fH = function () { console.log("Table created."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push('CREATE TABLE IF NOT EXISTS UserScripts (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL, whitelist TEXT NOT NULL, blacklist TEXT NOT NULL, script TEXT NOT NULL, disabled INT NOT NULL DEFAULT 0);', [], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    insert: function (name, desc, includes, excludes, code, disabled) {
        
        _fH = function () { console.log("Data inserted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push("INSERT INTO UserScripts (name, description, whitelist, blacklist, script, disabled) VALUES (?, ?, ?, ?, ?, ?);", [name, desc, includes, excludes, code, disabled], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    update: function (id, name, desc, includes, excludes, code, disabled) {
        
        _fH = function () { console.log("Data updated."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push("UPDATE UserScripts SET name = ?, description = ?, whitelist = ?, blacklist = ?, script = ?, disabled = ? WHERE id = ?;", [name, desc, includes, excludes, code, disabled, id], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetch: function (id, fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push("SELECT * FROM UserScripts WHERE id = ?;", [id], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetchAll: function (offset, limit, fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push("SELECT * FROM UserScripts LIMIT ?, ?;", [offset, limit], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    remove: function (id) {
        
        _fH = function () { console.log("Data deleted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push("DELETE FROM UserScripts WHERE id = ?;", [id], _fH, _killTransaction);
        
        this.transact(sqlArray);
    },
    disableScript: function (id) {
        
        _fH = function () { console.log("Script disabled."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push("UPDATE UserScripts SET disabled = 1 WHERE id = ?;", [id], _fH, _errorHandler);
        
        this.transact(sqlArray);
    }
});
*/





var ks = Class.create(KSUtils, {
    
    initialize: function () {
        
        this.setVerboseLevel(1);
    },
    //db: new KSStorage(),
    manageUserScripts: new KSManagementPanel()//,
    //newUserScript: new KSNewPanel(),
    //UserScriptSettings: new KSSettingsPanel()
});



function _ksCommandHandler(event) {
    
    switch (event.command)
    {
        case "open_main":
            
            //ks.panels.manageUserScripts.openPage();
            //ks.manageUserScripts.openPage();
            break;
        case "close":
            
            ks.log("Something closed.");
            //ks.panels.manageUserScripts.close();
            break;
        case "toggle_enable":
            
            
            break;
        case "open_manage":
            
            
            break;
        case "open_new":
            
            
            break;
    }
}



function _ksValidateHandler(event) {
    
    switch (event.command)
    {
        case "open_main":
            
            //if (ks.manageUserScripts.isTabOpen() === true) {
                
            //    ks.manageUserScripts.openPage(ks.panels.manageUserScripts.defaultPage);
            //}
            break;
        case "close":
            
            
            break;
        case "toggle_enable":
            
            
            break;
        case "open_manage":
            
            
            break;
        case "open_new":
            
            
            break;
    }
}



safari.application.addEventListener("command", _ksCommandHandler, false);
safari.application.addEventListener("validate", _ksValidateHandler, false);


