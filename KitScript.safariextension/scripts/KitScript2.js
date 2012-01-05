
var KSUtils = Class.create({
    
    /**
     *  @param int verboseLevel (0=Silenced,1=Console,2=BrowserAlert)
     *
     */
    initialize: function () {
        
        this._vl = 0;
    },
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


var ManagementPanel = Class.create(KS, {
    
    initialize: function () {
        
        this._page = "managementPanel.html";
    },
    openPage: function ($super) {
        
        $super(this._page);
    },
    close: function ($super) {
        
        //$super();
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


var NewUserScriptPanel = Class.create(KS, {
    
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
    },
    autoSave: function () {
        
        
    }
});


var ScriptSettingsPanel = Class.create(KS, {
    
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
    }
});


var KS = Class.create({
    
    initialize: function () {
        
        this._isTabOpen = false;
        
        this.defaultPage = 'main.html';
        
        this._previousPage = null;
        this._currentPage = this.defaultPage;
        
        this._tbItems = safari.extension.toolbarItems;
        
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
        
        this._previousPage = this.currentPage;
        this._currentPage = page;
        
        this._tab.url = location.href.replace(this.previousPage, 'markups/'+this.currentPage);
        this._url = this._tab.url;
    },
    openTab: function () {
        
        this._tab = safari.application.activeBrowserWindow.openTab('foreground',-1);
        this._isTabOpen = true;
    },
    closeTab: function () {
        
        this._tab.close();
        
        this._isTabOpen = false;
    },
    isTabOpen: function () {
        
        return this._isTabOpen;
    }
});


var ks = Class.create(KSUtils, {
    
    initialize: function () {
        
        this.setVerboseLevel(1);
    },
    db: new KSStorage(),
    panels: {
        manageUserScripts: new ManagementPanel(),
        newUserScript: new NewUserScriptPanel(),
        UserScriptSettings: new ScriptSettingsPanel()
    }
});


function _ksCommandHandler(event) {
    
    switch (event.command)
    {
        case "open_main":
            
            ks.panels.manageUserScripts.openPage();
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
            
            if (ks.panels.manageUserScripts.isTabOpen() === true) {
                
                ks.panels.manageUserScripts.openPage(ks.panels.manageUserScripts.defaultPage);
            }
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


