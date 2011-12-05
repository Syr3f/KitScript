

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
    settings: function (id) {
        
        ks.scriptSettingsPanel.open(id);
    },
    disable: function (id) {
        
        db.disableScript(id);
        
        $('user-script-'+id).addClass('');
    },
    remove: function (id) {
        
        db.remove(id);
        
        $('user-script-'+id).remove();
    }
});


var NewUserScriptPanel = Class.create(KS, {
    
    initialize: function () {
        
        this._id = "KS_PNU1";
    },
    open: function ($super) {
        
        $super(this._id)
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
    showEditScript: function () {
        
        
    },
    saveScript: function () {
        
        
    }
});


var KS = Class.create({
    
    initialize: function () {
        
        this._previousPopoverId = 'KS_PMP1';
        
        this._currentPopoverId = null;
        
        this._popovers = safari.extension.popovers;
        this._tbItems = safari.extension.toolbarItems;
    },
    getCurrentPopoverId: function () {
        
        return this._currentPopoverId;
    },
    getPopovers: function () {
        
        return this._popovers;
    },
    getToolbarItems: function () {
        
        return this._tbItems;
    },
    open: function (popoverId) {
        
        for (var i = 0; this._popovers.length > i; i++) {
            
            if (popoverId == this._popovers[i].identifier) {
                
                this._tbItems[0].popover = this._popovers[i];
            }
        }
        
        this._tbItems.showPopover();
        
        this._previousPopoverId = this._currentPopoverId;
        
        this._currentPopoverId = popoverId;
    },
    close: function (popoverId) {
        
        safari.extension.removePopover(popoverId);
    }
});


var ks = {
    
    this.managementPanel = new ManagementPanel();
    this.newUserScriptPanel = new NewUserScriptPanel();
    this.scriptSettingsPanel = new ScriptSettingsPanel();
};


function ksCommandHandler(event) {
    
    switch (event.command)
    {
        case "click-btn":
            
            ks.managementPanel.open(event);
            break;
    }
}


function ksValidateHandler(event) {
    
    switch (event.command)
    {
        case "click-btn":
            
            // 
            break;
    }
}


safari.application.addEventListener("command", ksCommandHandler, false);

safari.application.addEventListener("validate", ksValidateHandler, false);


