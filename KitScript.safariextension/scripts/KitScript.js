
var SqlArray = Create.create({
    
    initialize: function () {
        
        this._sqlArray = new Array();
    },
    push: function (sql, arguments, dataHandlerCallback, errorCallback) {
        
        this._sqlArray.push(new Array(sql, arguments, dataHandlerCallback, errorCallback));
    },
    getArray: function () {
        
        return this._sqlArray;
    }
});

var Storage = Class.create({
    
    initialize: function () {
        
        this._DB = null;
        
        this._shortName = 'KitScript';
        this._version = '1.0';
        this._displayName = 'KitScript';
        this._maxSize = 10485760; // in bytes
        
        this._dbIsCreated = false;
        
        try {
            
            if (!window.openDatabase) {
                alert('not supported');
            } else {
                this._DB = openDatabase(this._shortName, this._version, this._displayName, this._maxSize);
            
                this._dbIsCreated = true;
            }
        } catch(e) {
            
            // Error handling code goes here.
            if (e == INVALID_STATE_ERR) {
                // Version number mismatch.
                alert("Invalid database version.");
            } else {
                alert("Unknown error "+e+".");
            }
            
            return;
        }
        
        if (this._dbIsCreated === false) {
            
            this.createTables();
        }
    },
    isExistant: function () {
        
        return this._dbIsCreated;
    },
    createTables: function () {
        
        if (0) {
            
            sqlArray = new SqlArray();
            
            sqlArray.push('DROP TABLE UserScripts;', [], function () {}, function () { alert("Can't drop UserScripts table.") });
            //sqlArray.push('DROP TABLE ;');
            
            this.transact(sqlArray);
        }
        
        sqlArray = new SqlArray();
        
        sqlArray.push('CREATE TABLE IF NOT EXISTS UserScripts (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name VARCHAR(55) NOT NULL, description VARCHAR(155) NOT NULL, whitelist TEXT NOT NULL, blacklist TEXT NOT NULL, script TEXT NOT NULL);', [], function () {}, function () { alert("Can't create UserScripts table.") });
        
        this.transact(sqlArray);
        
        this._dbIsCreated = true;
    },
    transact: function (sqlArray) {
        
        this._DB.transaction(function (transaction) {
            
            for (var i = 0; i < sqlArray.length; i++) {
                
                transaction.executeSql(sqlArray[i][0], sqlArray[i][1], sqlArray[i][2], sqlArray[i][3]);
            }
        });
    }
});

var UserScript = Class.create({
    
    initialize: function (script) {
        
        this._script = script;
    },
    getIncludes: function () {
        
        var _includes = [];
        
        var matches = /\/\/[ ]+\@include (.*)/g.exec(this._script);
        
        for (var i = 1; i < matches.length; i++) {
            
            _includes.push(matches[i]);
        }
        
        return _includes;
    },
    getExcludes: function () {
        
        
    },
    getDescription: function () {
        
        
    },
    getIcon: function () {
        
        
    },
    getMatches: function () {
        
        
    },
    getName: function () {
        
        
    },
    getNamespace: function () {
        
        
    },
    getRequires: function () {
        
        
    },
    getResources: function () {
        
        
    },
    getRunAt: function () {
        
        
    },
    hasUnwrap: function () {
        
        
    },
    getVersion: function () {
        
        
    }
});

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
    settings: function () {
        
        
    },
    disable: function () {
        
        
    },
    remove: function () {
        
        
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
        
        //newUserScriptForm.userscriptname;
        //newUserScriptForm.userscriptdesc;
        //newUserScriptForm.userscriptcode;
    }
});


var ScriptSettingsPanel = Class.create(KS, {
    
    initialize: function () {
        
        this._id = "KS_PSS1";
    },
    open: function ($super) {
        
        $super(this._id);
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
        case "":
            
            
            break;
        case "":
            
            
            break;
        case "":
            
            
            break;
        default:
            
            
    }
}


function ksValidateHandler(event) {
    
    switch (event.command)
    {
        case "click-btn":
            
            
            break;
        case "":
            
            
            break;
        case "":
            
            
            break;
        case "":
            
            
            break;
        default:
            
            
    }
}


safari.application.addEventListener("command", ksCommandHandler, false);

safari.application.addEventListener("validate", ksValidateHandler, false);


