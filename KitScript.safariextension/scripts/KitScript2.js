

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
        
        this.previousPage = null;
        this.currentPage = 'main.html';
        
        this._tbItems = safari.extension.toolbarItems;
        
        this._tab = null;
        this._url = null;
    },
    openPage: function (page) {
       
        this._previousPage = this.currentPage;
        
        this._currentPage = page;
        
        if (this._tab === null)
        {
            this._tab = safari.application.activeBrowserWindow.openTab('foreground',-1);
        }
        
        this._tab.url = location.href.replace(this.previousPage, 'markups/'+this.currentPage);
        this._url = this._tab.url;
    },
    close: function () {
        
        //this._tab.close();
    }
});


var ks = {
    
    db: new KSStorage(),
    managementPanel: new ManagementPanel(),
    newUserScriptPanel: new NewUserScriptPanel(),
    scriptSettingsPanel: new ScriptSettingsPanel()
};


function _ksCommandHandler(event) {
    
    switch (event.command)
    {
        case "click-btn":
            
            // ks.managementPanel.open(event);
            break;
        case "close":
            console.log("Something closed.");
            break;
    }
}


function _ksValidateHandler(event) {
    
    switch (event.command)
    {
        case "click-btn":
            
            // 
            break;
    }
}


safari.application.addEventListener("command", _ksCommandHandler, false);

safari.application.addEventListener("validate", _ksValidateHandler, false);


