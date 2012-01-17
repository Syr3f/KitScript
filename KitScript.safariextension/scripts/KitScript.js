/**
 *  KitScript - A User Script Manager For Safari
 *
 *  KitScript.js - Javascript file containing base classes (by Prototype.js)
 *  used globally in the extension.
 *
 *  @author Seraf Dos Santos <webmaster@cyb3r.ca>
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */

//"use strict";





/**
 *  KSBase (KitScript Base Object Class)
 */
var KSBase = Class.create(_Utils, {

    initialize: function ($super) {
        
        $super();
        
        this._isTabOpen = false;
        
        this.defaultPage = 'MainContainer.html';
        
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
 *  KSMainContainer (KitScript User Scripts Main Container Class)
 */
var KSMainContainer = Class.create(KSBase, {
    
    initialize: function ($super) {
        
        this._pageName = "MainContainer.html";
        this.contentManager = null;
        this.globalSettingsForm = null;
        
        $super();
    },
    openPage: function ($super) {
        
        $super(this._pageName);
    }
});





/**
 *  KSContentManager (KitScript Content Manager for the Main Container)
 */
var KSContentManager = Class.create(_Utils, {
    
    regisForms: [],
    initialize: function ($super,formIdObj) {
        
        this._maxAlert = 7000;
        
        $super();
        
        this.regisForms.push(formIdObj);
        
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
    transitContent: function (newContentId) {
        
        _contentId = this._cleanContentIdStr(newContentId);
        
        KSContentManager.previousContentId = KSContentManager.currentContentId;
        KSContentManager.currentContentId = _contentId;
        
        this._hideContent(KSContentManager.previousContentId);
        this._showContent(KSContentManager.currentContentId);
        
        var _ttl = this._getTitleByContentId(_contentId);
        
        this._setDocumentTitle(_ttl);
    },
    showMainContainer: function () {
        
        this.transitContent('userscript-manager');
        
        // User Scripts Manager
        ks.mainContainer.userScriptsManagerForm.drawTable();
        
        // Global Settings
        ks.mainContainer.globalSettingsForm.emptyList();
        ks.mainContainer.globalSettingsForm.fillList();
        
        // About
        ks.mainContainer.aboutProjectForm.convertMdTxt();
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
        
        if (this.$(_ab).hasClass('hide'))
            this.$(_ab).removeClass('hide');
        else
            this.$(_ab).show();
        
        this.hideAlertMsg(_ab);
    },
    hideAlertMsg: function (alertBoxId) {
        
        var _f = function (_abId) { jQuery(_abId).fadeOut('slow') };
        
        setTimeout(_f,this._maxAlert,alertBoxId);
    }
});

KSContentManager.regisForms = [];
KSContentManager.currentContentId = 'userscript-manager';
KSContentManager.previousContentId = null;





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
        
        this._tableId = this._formIdObj.formBaseId+'-list';
    },
    drawTable: function () {
        
        var _sC1 = function (trsct,rs) {
            
            var _this = trsct.objInstance;
            var _html = "";
            
            var _sttOn = 'Enabled', _sttOff = 'Disabled';
            
            if (rs.rows.length > 0) {
                
                for (var i=0; i<rs.rows.length; i++) {
                    
                    var _row = rs.rows.item(i);
                    
                    if (parseInt(_row['disabled']) === 1)
                        var _lbl = 'important', _stt = "OFF";
                    else
                        var _lbl = 'notice', _stt = "ON";
                    
                    var _sttCmd = (_stt==="ON"?_sttOff.substr(0,_sttOff.length-1):_sttOn.substr(0,_sttOn.length-1));
                    
                    _html += '<tr id="ks-us-'+_row['id']+'">\n';
                    
                        _html += '<td><h3>'+_row['name']+' <span class="label '+_lbl+'">'+_stt+'</span></h3><span>'+_row['description']+'</span></td>';
                        _html += '<td><a href="#ks-usm-btn-settings-'+_row['id']+'" class="btn small primary">Settings</a></td>';
                        _html += '<td><a href="#ks-usm-btn-'+_sttCmd.toLowerCase()+'-'+_row['id']+'" class="btn small info">'+_sttCmd+'</a></td>';
                        _html += '<td><a href="#ks-usm-btn-remove-'+_row['id']+'" class="btn small danger">Delete</a></td>\n';
                    
                    _html += '</tr>\n';
                }
            } else {
                
                _html += '<tr>\n';
                
                    _html += '<td><h3>No user scripts installed.</h3></td>';
                
                _html += '</tr>\n';
            }
            
            _this.$('#'+_this._tableId+' tbody').html(_html);
            
            _this.$("#ks-usm-list * a").click({_form:_this}, function (evt) {
                
                var _req = _this.$(this).attr('href');
                
                if (/#ks-usm-btn-settings-[0-9]+/.test(_req))
                    evt.data._form.openUserScriptSettings(_req);
                else if (/#ks-usm-btn-disable-[0-9]+/.test(_req))
                    evt.data._form.disableUserScript(_req);
                else if (/#ks-usm-btn-enable-[0-9]+/.test(_req))
                    evt.data._form.enableUserScript(_req);
                else if (/#ks-usm-btn-remove-[0-9]+/.test(_req))
                    evt.data._form.deleteUserScript(_req);
            });
        }
        
        this.$('#'+this._tableId+' tbody').empty();
        
        db.fetchAllUserScriptsMetadata(0,25,_sC1,this);
    },
    openUserScriptSettings: function (btnId) {
        
        var _usid = this._extractId(btnId);
        
        this.transitContent('userscript-settings');
        
        this.$("#ks-uss-us-id").val(_usid);
    },
    disableUserScript: function (btnId) {
        
        var _usid = this._extractId(btnId);
        
        var _fC = function (trsct, rs) {
            
            var _this = trsct.objInstance;
            
            _this.drawTable();
            _this.showSuccessAlert('User script has been disabled.');
        }
        
        try {
            db.disableUserScript(_usid, _fC, this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    enableUserScript: function (btnId) {
        
        var _usid = this._extractId(btnId);
        
        var _fC = function (trsct, rs) {
            
            var _this = trsct.objInstance;
            
            _this.drawTable();
            _this.showSuccessAlert('User script has been enabled.');
        }
        
        try {
            db.enableUserScript(_usid, _fC, this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    deleteUserScript: function (btnId) {
        
        var _usid = this._extractId(btnId);
        
        alert(_usid);
        
        var _fC = function (trsct, rs) {
            
            alert("_fC");
            
            var _this = trsct.objInstance;
            
            var _fC2 = function (trsct2, rs2) {
                
                alert("_fC");
                
                var _this2 = trsct2.objInstance;
                
                _this2.drawTable();
                _this2.showSuccessAlert('User script has been deleted.');
            }
            
            _this._db.deleteUserScriptMetadata(_this._usid, _fC2, _this);
            delete _this._db;
        }
        
        try {
            
            this.__proto__._db = db;
            this.__proto__._usid = _usid;
            
            db.deleteUserScriptFile(_usid, _fC, this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    _extractId: function (btnId) {
        
        return btnId.substr(btnId.lastIndexOf('-')+1,btnId.length);
    },
    showSuccessAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.successLevel,strMsg);
    },
    showWarningAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.warnLevel,strMsg);
    },
    showFailureAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.errorLevel,strMsg);
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
        
        this._addModalId = this._formIdObj.formBaseId+'-add-modal';
        this._editModalId = this._formIdObj.formBaseId+'-edit-modal';
        
        this._listId = this._formIdObj.formBaseId+'-list';
        this._inNewId = this._formIdObj.formBaseId+'-input-new';
        this._inEditId = this._formIdObj.formBaseId+'-input-edit-url';
        this._editId = this._formIdObj.formBaseId+'-edit-id';
    },
    addGlobalExclude: function () {
        
        this.$('#'+this._addModalId).modal({
            keyboard: true,
            backdrop: true,
            show: true
        });
    },
    registerGlobalExclude: function () {
        
        this.$('#'+this._addModalId).modal('hide');
        
        var _val = this.$('#'+this._inNewId).val();
        
        this.$('#'+this._inNewId).val("");
        
        if (_val.length > 0) {
            
            var _fn = function (trsct,rs) {
                
                var _this = trsct.objInstance;
                
                _this.emptyList();
                _this.fillList();
            }
            
            try {
                
                db.insertGlobalExclude(_val,_fn,this);
                this.showSuccessAlert("URL has been registered.");
            } catch (e) {
                
                this.showFailureAlert(e.getMessage());
            }
        }
    },
    editGlobalExclude: function () {
        
        if (this.$('#'+this._listId+' option:selected').val() !== null) {
            
            this.$('#'+this._editModalId).modal({
                keyboard: true,
                backdrop: true,
                show: true
            });
            
            var _id = this.$('#'+this._listId+' option:selected').val();
            var _url = this.$('#'+this._listId+' option:selected').text();
            
            this.$('#'+this._editId).val(_id);
            this.$('#'+this._inEditId).val(_url);
        } else {
            
            this._a('Please select a URL to edit it.');
        }
    },
    updateGlobalExclude: function () {
        
        this.$('#'+this._editModalId).modal('hide');
        
        this.$("#ks-gs-btn-edit").addClass('disabled');
        this.$("#ks-gs-btn-remove").addClass('disabled');
        
        var _id = this.$('#'+this._editId).val();
        var _url = this.$('#'+this._inEditId).val();
        
        this.$('#'+this._editId).val("");
        this.$('#'+this._inEditId).val("");
        
        if (_url.length > 0) {
            
            var _fn = function (trsct,rs) {
                
                var _this = trsct.objInstance;
                
                _this.emptyList();
                _this.fillList();
            }
            
            try {
                
                db.updateGlobalExclude(_id, _url,_fn,this);
                this.showSuccessAlert("URL has been updated.");
            } catch (e) {
                
                this.showFailureAlert(e.getMessage());
            }
        }
    },
    removeGlobalExclude: function () {
        
        this.$("#ks-gs-btn-edit").addClass('disabled');
        this.$("#ks-gs-btn-remove").addClass('disabled');
        
        var _id = this.$('#'+this._listId+' option:selected').val();
        
        var _fn = function (trsct,rs) {
            
            var _this = trsct.objInstance;
            
            _this.emptyList();
            _this.fillList();
        }
        
        try {
            
            db.deleteGlobalExclude(_id,_fn,this);
            this.showSuccessAlert("URL has been deleted.");
        } catch (e) {
            
            this.showFailureAlert(e.getMessage());
        }
    },
    emptyList: function () {
        
        this.$('#'+this._listId).empty();
    },
    fillList: function () {
        
        var _fn = function (trsct,rs) {
            
            var _this = trsct.objInstance;
            
            if (rs.rows.length > 0) {
                
                for (var i=0; i<rs.rows.length; i++) {
                    
                    var _row = rs.rows.item(i);
                    
                    var _html = '<option value="'+_row['id']+'">'+_row['url']+'</option>';
                    
                    _this.$('#'+_this._listId).append(_html);
                }
            }
        }
        
        db.fetchAllGlobalExcludes(0,1000,_fn,this);
    },
    showSuccessAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.successLevel,strMsg);
    },
    showWarningAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.warnLevel,strMsg);
    },
    showFailureAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.errorLevel,strMsg);
    }
});





/**
 *  KSNewUserScriptForm (KitScript New User Script Form Class)
 */
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
            
            ks.gmmd.loadScript(_script);
            
            var _rec = this._getHeaderValues();
            
            this._storeUserScript(_rec[0],_rec[1],_rec[2],_rec[3],_rec[4],_script);
        } catch (e) {
            
            this.showErrorAlert(e.getMessage());
        }
    },
    _getHeaderValues: function () {
        
        var _name = ks.gmmd.getName();
        var _space = ks.gmmd.getNamespace();
        var _desc = ks.gmmd.getDescription();
        var _incs = ks.gmmd.getIncludes();
        var _excs = ks.gmmd.getExcludes();
        
        return [_name,_space,_desc,_incs.join(','),_excs.join(',')];
    },
    _storeUserScript: function (name, space, desc, excludes, includes, code) {
        
        _fH = function () {};
        
        db.insertUserScriptFile(KSSHF_blobize(code),_fH,this);
        
        var _sC1 = function (trsct,rs) {
            
            var _this = trsct.objInstance;
            
            if (rs.rows.length > 0) {
                
                var _row = rs.rows.item(0);
                
                var _sC2 = function (trsct,rs) {
                    
                    var _this2 = trsct.objInstance;
                    
                    _this2.transitContent('#userscript-manager');
                    
                    ks.mainContainer.userScriptsManagerForm.showSuccessAlert("The user script has been added.");
                    
                    ks.mainContainer.userScriptsManagerForm.drawTable();
                }
                
                db.insertUserScriptMetadata(_this._fname, _this._fspace, _this._escQuot(_this._fdesc), _this._fincludes, _this._fexcludes, parseInt(_row[_this._liria]), 0, _sC2, _this);
            } else {
                
                _this.showErrorAlert("The user script couldn't be stored.");
            }
        }
        
        this._liria = 'LastInsertId';
        
        this._fname = name;
        this._fspace = space;
        this._fdesc = desc;
        this._fexcludes = excludes;
        this._fincludes = includes;
        
        db.getLastInsertRowId(this._liria, _sC1, this);
    },
    _escQuot: function (str) {
        
        return str.replace("'","\\'","gm");
    },
    showSuccessAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.successLevel,strMsg);
    },
    showWarningAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.warnLevel,strMsg);
    },
    showFailureAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.errorLevel,strMsg);
    }
});





/**
 *  KSUserScriptSettingsForm (KitScript User Script Settings Form Class)
 */
var KSUserScriptSettingsForm = Class.create(KSContentManager, {
    
    initialize: function ($super) {
        
        this._formIdObj = {
            id: "userscript-settings",
            title: "User Script Settings",
            formBaseId: "ks-uss"
        };
        
        $super(this._formIdObj);
    },
    showSuccessAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.successLevel,strMsg);
    },
    showWarningAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.warnLevel,strMsg);
    },
    showFailureAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.errorLevel,strMsg);
    }
});





/**
 *  KSAboutProjectForm (KitScript About Project Form Class)
 */
var KSAboutProjectForm = Class.create(KSContentManager, {
    
    initialize: function ($super) {
        
        this._formIdObj = {
            id: "about",
            title: "About KitScript",
            formBaseId: "ks-abt"
        };
        
        $super(this._formIdObj);
    },
    convertMdTxt: function () {
        
        var _txt = this.$('#ks-abt-md-txt').text();
        var _html = this.md.toHTML(_txt);
        
        this.$('#ks-abt-html-txt').html(_html);
    }
});





/**
 *  KitScript Class
 */
var KitScript = Class.create(_Utils, {
    
    initialize: function ($super) {
        
        $super();
        
        this._isEnabled = true;
        
        this.gmmd = new KSGreasemonkeyMetadata();
        
        this.mainContainer = new KSMainContainer();
        this.mainContainer.contentManager = new KSContentManager();
        this.mainContainer.userScriptsManagerForm = new KSUserScriptsManagerForm();
        this.mainContainer.globalSettingsForm = new KSGlobalSettingsForm();
        this.mainContainer.newUserScriptForm = new KSNewUserScriptForm();
        //this.mainContainer.userScriptSettingsForm = new KSUserScriptSettingsForm();
        this.mainContainer.aboutProjectForm = new KSAboutProjectForm();
    },
    isEnabled: function () {
        
        return this._isEnabled;
    },
    setEnable: function () {
        
        _sC = function (transaction, resultSet) {
            
            var _ks = transaction.objInstance;
            
            _ks.$('#toggle-enable-dropdown').text("KitScript is Enabled!");
            _ks._isEnabled = true;
        };
        
        if (!this.isEnabled()) {
            
            db.setKitScriptEnabled(_sC, this);
        }
    },
    setDisable: function () {
        
        _sC = function () {
            
            var _ks = transaction.objInstance;
            
            _ks.$('#toggle-enable-dropdown').text("KitScript is Disabled!");
            _ks._isEnabled = false;
        };
        
        if (this.isEnabled()) {
            
            db.setKitScriptDisabled(_sC, this);
        }
    },
    declareEnabled: function () {
        
        _sC = function (transaction, resultSet) {
            
            var _ks = transaction.objInstance;
            
            if (resultSet.rows.length > 0) {
                
                var _row = resultSet.rows.item(0);
                
                if (parseInt(_row['enabled']) == 1) {
                    
                    _ks._isEnabled = true;
                    
                    _ks.$('#toggle-enable-dropdown').text("KitScript is Enabled!");
                } else {
                    
                    _ks._isEnabled = false;
                    
                    _ks.$('#toggle-enable-dropdown').text("KitScript is Disabled!");
                }
            }
        }
        
        db.isKitScriptEnabled(_sC, this);
    }
});





/**
 *  =======================================================
 *  KSSEFH_* (KitScript Safari Extension Function Handlers)
 *  =======================================================
 */

function KSSEFH_CommandHandler(event) {
    
    switch (event.command)
    {
        case "open_tab":
            ks.mainContainer.openTab();
            ks.mainContainer.setTabPage(ks.mainContainer.defaultPage);
            break;
    }
}

function KSSEFH_ValidateHandler(event) {
    
    switch (event.command)
    {
        case "open_tab":
            //
            break;
    }
}

safari.application.addEventListener("command", KSSEFH_CommandHandler, false);
safari.application.addEventListener("validate", KSSEFH_ValidateHandler, false);

