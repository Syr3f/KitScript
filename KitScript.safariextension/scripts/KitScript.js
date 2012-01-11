/**
 *  KitScript - A User Script Safari Extension
 *
 *  KitScript.js - Javascript file containing base classes (by Prototype.js)
 *  used globally in the extension.
 *
 *  @author Seraf Dos Santos <webmaster@cyb3r.ca>
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */





/**
*  KSBase (KitScript Base Object Class)
*/
var KSBase = Class.create(_Utils, {

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





/**
 *  KSContentManager (KitScript Content Manager for the Main Panel)
 */
var KSContentManager = Class.create(_Utils, {
    
    regisForms: [],
    initialize: function ($super,formIdObj) {
        
        $super();
        
        this.regisForms.push(formIdObj);
        
        this.defaultContentId = 'userscript-manager';
        
        this._currentContentId = this.defaultContentId;
        this._previousContentId = null;
        
        this.errorLevel = 1;
        this.warnLevel = 2;
        this.successLevel = 3;
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
    _getTitleByContentId: function (contentId) {
        
        _contentId = this._cleanContentIdStr(contentId);
        
        for (var i=1; i<this.regisForms.length; i++) {
            
            if (this.regisForms[i].id == _contentId)
                return this.regisForms[i].title;
        }
    },
    initContent: function () {
        
        this._setDocumentTitle(this._getTitleByContentId(this.defaultContentId));
    },
    transitContent: function (newContentId) {
        
        _contentId = this._cleanContentIdStr(newContentId);
        
        this._previousContentId = this._currentContentId;
        this._currentContentId = _contentId;
        
        this._hideContent(this._previousContentId);
        this._showContent(this._currentContentId);
        
        this._setDocumentTitle(this.getTitleByContentId(_contentId));
    },
    /*
    popAlert: function (strMsg) {
        
        this.$('#'+this._alertModalId+' > h2').text(strMsg);
        
        this.showModalAlert();
    },
    showModalAlert: function (alertModalId) {
        
        this.$('#'+alertModalId).modal('show');
    },
    hideModalAlert: function (alertModalId) {
        
        this.$('#'+alertModalId).modal('hide');
    },
    */
    showAlertMsg: function (formBaseId,level,strMsg) {
        
        var _lvl = "";
        var _pre = "";
        
        switch (level) {
            case this.errorLevel:
                _lvl = "-error";
                _pre = "<b>Error!</b> ";
                break;
            case this.warnLevel:
                _lvl = "-warn";
                _pre = "<b>Warning!</b> ";
                break;
            case this.successLevel:
                _lvl = "-success";
                _pre = "<b>Hurray!</b> ";
                break;
        }
        
        var _ab = '#'+formBaseId+"-am"+_lvl;
        
        this.$(_ab).html(_pre+strMsg);
        
        this.$(_ab).removeClass('hide');
        
        this.hideAlertMsg(_ab);
    },
    hideAlertMsg: function (_ab) {
        
        var _sC = "function () {";
        _sC += "jQuery('"+_ab+"').addClass('hide').fadeOut('slow');";
        _sC += "}";
        
        setTimeout(10000,_sC);
    }
});

KSContentManager.regisForms = [];





/**
 *  KSUserScriptsManagerForm (KitScript User Scripts Manager For Class)
 */
var KSUserScriptsManagerForm = Class.create(KSContentManager, {
    
    initialize: function ($super) {
        
        this._formIdObj = {
            id: "userscript-manager",
            title: "User Script Manager",
            formBaseId: "ks-usm"
        };
        
        $super(this._formIdObj);
    },
    openUserScriptSettings: function (id) {
        
        
    },
    disableUserScript: function (id) {
        
        
    },
    deleteUserScript: function (id) {
        
        
    },
    showWarningAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.warnLevel,strMsg);
    },
    showErrorAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.errorLevel,strMsg);
    },
    showSuccess: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.successLevel,strMsg);
    }
});





/**
 *  KSGlobalSettingsForm (KitScript Global Settings Form Class)
 */
var KSGlobalSettingsForm = Class.create(KSContentManager, {
    
    initialize: function ($super) {
        
        this._formIdObj = {
            
            id: "global-settings",
            title: "Global Settings",
            formBaseId: "ks-gs"
        };
        
        $super(this._formIdObj);
    },
    addGlobalExclude: function () {
        
        this.$('#ks-gs-add-modal').modal('show');
    },
    editGlobalExclude: function () {
        
        
    },
    removeGlobalExclude: function () {
        
        
    },
    showWarningAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.warnLevel,strMsg);
    },
    showErrorAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.errorLevel,strMsg);
    },
    showSuccess: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.successLevel,strMsg);
    }
});





var KSNewUserScriptForm = Class.create(KSContentManager, {
    
    initialize: function ($super) {
        
        this._formIdObj = {
            id: "new-userscript",
            title: "New User Script",
            formBaseId: "ks-aus"
        };
        
        $super(this._formIdObj);
        
        this._textareaId = this._formIdObj.formBaseId+'-script';
    },
    addUserScript: function () {
        
        var _script = this.$('#'+this._textareaId).val();
        
        try {
            
            this.gm.loadScript(_script);
            
            var _rec = this._getHeaderValues();
            
            this._storeUserScript(_rec[0],_rec[1],_rec[2],_rec[3],_rec[4],_script);
        } catch (e) {
            
            this.showErrorAlert(e.getMessage());
        }
    },
    _getHeaderValues: function () {
        
        var _name = this.gm.getName();
        var _space = this.gm.getNamespace();
        var _desc = this.gm.getDescription();
        var _incs = this.gm.getIncludes();
        var _excs = this.gm.getExcludes();
        
        return [_name,_space,_desc,_incs.join(','),_excs.join(',')];
    },
    _storeUserScript: function (name, space, desc, excludes, includes, code) {
        
        this.log();
        
        this.db.insertUserScript(KSSHF_blobize(code));
        
        var _sC1 = function (trsct,rs) {
            
            var _this = trsct.objInstance;
            
            if (rs.rows.length > 0) {
                
                var _row = rs.rows.item(0);
                
                var _sC2 = function (trsct,rs) {
                    
                    var _this = trsct.objInstance;
                    
                    _this.showSuccessAlert("The user script has been added.");
                    
                    _this.transitContent('userscript-manager');
                }
                
                _this.db.insertUserScriptMetadata(this._escQuot(name), this._escQuot(space), this._escQuot(desc), this._escQuot(excludes), this._escQuot(includes), _row['LastRowId'], 0, _sC2, _this);
            } else {
                
                _this.showErrorAlert("The user script couldn't be stored.");
            }
        }
        
        this.db.getLastInsertRowId(_sC1, this);
    },
    _escQuot: function (str) {
        
        return str.replace("'","\'","gm");
    },
    showWarningAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.warnLevel,strMsg);
    },
    showErrorAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.errorLevel,strMsg);
    },
    showSuccessAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.successLevel,strMsg);
    }
});





var KSUserScriptSettingsForm = Class.create(KSContentManager, {
    
    initialize: function ($super) {
        
        this._formIdObj = {
            id: "userscript-settings",
            title: "User Script Settings",
            formBaseId: "ks-uss"
        };
        
        $super(this._formIdObj);
    },
    showWarningAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.warnLevel,strMsg);
    },
    showErrorAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.errorLevel,strMsg);
    },
    showSuccess: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.successLevel,strMsg);
    }
});





var KSAboutKitScriptForm = Class.create(KSContentManager, {
    
    initialize: function ($super) {
        
        this._formIdObj = {
            id: "about",
            title: "About KitScript",
            formBaseId: "ks-abt"
        };
        
        $super(this._formIdObj);
    },
    showWarningAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.warnLevel,strMsg);
    },
    showErrorAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.errorLevel,strMsg);
    },
    showSuccess: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.successLevel,strMsg);
    }
});





var KitScript = Class.create(_Utils, {
    
    initialize: function ($super) {
        
        $super();
        
        this._isEnabled = true;
        
        this.db = new KSStorage();
        this.gm = new KSGreasemonkeyMetadata();
        
        this.mainPanel = new KSMainPanel();
        this.mainPanel.contentManager = new KSContentManager();
        this.mainPanel.userScriptsManagerForm = new KSUserScriptsManagerForm();
        this.mainPanel.globalSettingsForm = new KSGlobalSettingsForm();
        this.mainPanel.newUserScriptForm = new KSNewUserScriptForm();
        this.mainPanel.userScriptSettingsForm = new KSUserScriptSettingsForm();
        this.mainPanel.aboutForm = new KSAboutKitScriptForm();
    },
    isEnabled: function () {
        
        return this._isEnabled;
    },
    setEnable: function () {
        
        _sC = function (transaction, resultSet) {
            
            jQuery('#toggle-enable-dropdown').text("KitScript is Enabled!");
        };
        
        if (!this.isEnabled()) {
            
            this.db.setKitScriptEnabled(_sC);
            this._isEnabled = true;
        }
    },
    setDisable: function () {
        
        _sC = function () {
            
            jQuery('#toggle-enable-dropdown').text("KitScript is Disabled!");
            
            this.log("KitScript is disabled.");
        };
        
        if (this.isEnabled()) {
            
            this.db.setKitScriptDisabled(_sC);
            this._isEnabled = false;
        }
    },
    declareEnabled: function () {
        
        _sC = function (transaction, resultSet) {
            
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
        
        this.db.isKitScriptEnabled(_sC, this);
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
            //
            break;
    }
}

safari.application.addEventListener("command", _ksCommandHandler, false);
safari.application.addEventListener("validate", _ksValidateHandler, false);

