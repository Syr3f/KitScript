
var ManagementPanel = Class.create({
    
    initialize: function () {
        this._tab = null;
        this._url = null;
    },
    open: function (event) {
        
        this._tab = safari.application.activeBrowserWindow.openTab('foreground',-1);
        this._tab.url = location.href.replace('main.html', 'managementPanel.html');
        this._url = this._tab.url;
    }
});

var KS = Class.create({
    initialize: function () {
        this.managementPanel = new ManagementPanel();
    }
});

function ksCommandHandler(event) {
    
    switch (event.command)
    {
        case "open-tab":
            ks.managementPanel.open(event);
            break;
    }
}

function ksValidateHandler(event) {
    
    switch (event.command)
    {
        case "open-tab":
            // 
            break;
    }
}

var ks = new KS();