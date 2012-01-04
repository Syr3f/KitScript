

var ManagementPanel = Class.create(KS, {
    
    initialize: function () {
        
        this._id = "KS_PMP1";
    },
    open: function ($super) {
        
        $super(this._id);
    },
    close: function ($super) {
        
        $super(this._id);
    },
    openSettings: function (id) {
        
        ks.scriptSettingsPanel.open(id);
    },
    disable: function (id) {
        
        db.disableScript(id);
        
        $('#user-script-'+id).addClass('disabled');
        $('button','#us-list tbody tr td').attr('disabled','disabled');
    },
    remove: function (id) {
        
        db.remove(id);
        
        $('#user-script-'+id).remove();
    }
});


var NewUserScriptPanel = Class.create(KS, {
    
    initialize: function () {
        
        this._id = "KS_PNU1";
    },
    open: function ($super) {
        
        $super(this._id);
    },
    close: function ($super) {
        
        $super(this._id);
    },
    save: function (newUserScriptForm) {
        
        code = newUserScriptForm.us-code;
        
        us = new UserScript(code);
        
        name = us.getName();
        desc = us.getDescription();
        includes = us.getIncludes().join(",");
        excludes = us.getExcludes().join(",");
        disabled = 0;
        
        db.create(name, desc, includes, excludes, code, disabled);
    }
});


var ScriptSettingsPanel = Class.create(KS, {
    
    initialize: function () {
        
        this._id = "KS_PSS1";
    },
    open: function ($super, scriptId) {
        
        this._scriptId = scriptId;
        
        $super(this._id);
        
        this.showUserSettings();
    },
    close: function ($super) {
        
        $super(this._id);
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
        
        id = userScriptForm.us-id;
        
        code = userScriptForm.us-code;
        
        us = new UserScript(code);
        
        name = us.getName();
        desc = us.getDescription();
        includes = us.getIncludes().join(",");
        excludes = us.getExcludes().join(",");
        disabled = userScriptForm.isDisabled;
        
        db.update(name, desc, includes, excludes, code, disabled, id);
    }
});


var KS = Class.create({
    
    initialize: function () {
        
        this._previousPopoverId = null;
        this._currentPopoverId = 'KS_PMP1';
        
        this._popovers = safari.extension.popovers;
        this._tbItems = safari.extension.toolbarItems;
    },
    getPopovers: function () {
        
        return this._popovers;
    },
    getToolbarItems: function () {
        
        return this._tbItems;
    },
    getPreviousPopoverId: function () {
        
        return this._previousPopoverId;
    },
    getCurrentPopoverId: function () {
        
        return this._currentPopoverId;
    },
    open: function (popoverId) {
        
        this.close(this._currentPopoverId);
        
        for (var i = 0; i < this._popovers.length; i++) {
            
            if (popoverId == this._popovers[i].identifier) {
                
                this._tbItems[0].popover = this._popovers[i];
            }
        }
        
        this._tbItems[0].showPopover();
        
        this._previousPopoverId = this._currentPopoverId;
        
        this._currentPopoverId = popoverId;
        
        //this._tab = safari.application.activeBrowserWindow.openTab('foreground',-1);
        //this._tab.url = location.href.replace('main.html', 'markups/managementPanel.html');
        //this._url = this._tab.url;
    },
    close: function (popoverId) {
        
        safari.extension.removePopover(popoverId);
    }
});


var ks = {
    
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


