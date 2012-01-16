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
    initPanel: function () {
        
        this.transitContent('userscript-manager');
        
        // User Scripts Manager
        ks.mainPanel.userScriptsManagerForm.drawTable();
        
        // Global Settings
        ks.mainPanel.globalSettingsForm.emptyList();
        ks.mainPanel.globalSettingsForm.fillList();
        
        // About
        ks.mainPanel.aboutProjectForm.convertMdTxt();
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
            
            if (rs.rows.length > 0) {
                
                for (var i=0; i<rs.rows.length; i++) {
                    
                    var _row = rs.rows.item(i);
                    
                    _html += '<tr id="ks-us-'+_row['id']+'">\n';
                    
                        _html += '<td><h3>'+_row['name']+'</h3><span>'+_row['description']+'</span></td>';
                        _html += '<td><a href="#ks-usm-btn-settings-'+_row['id']+'" class="btn small primary">Settings</a></td>';
                        _html += '<td><a href="#ks-usm-btn-disable-'+_row['id']+'" class="btn small info">Disable</a></td>';
                        _html += '<td><a href="#ks-usm-btn-remove-'+_row['id']+'" class="btn small danger">Remove</a></td>\n';
                    
                    _html += '</tr>\n';
                }
                
                _this.$("#ks-usm-list * a").click(function (evt) {
                    
                    var _req = _this.$(this).attr('href');
                    
                    var _ptrns = [
                        /#ks-usm-settings-[0-9]+/,
                        /#ks-usm-disable-[0-9]+/,
                        /#ks-usm-remove-[0-9]+/
                    ];
                    
                    if (_ptrns[0].test(_req)) {
                        
                        ks.mainPanel.userScriptsManagerForm.openUserScriptSettings(_req);
                    } else if (_ptrns[1].test(_req)) {
                        
                        ks.mainPanel.userScriptsManagerForm.disableUserScript(_req);
                    } else if (_ptrns[2].test(_req)) {
                        
                        ks.mainPanel.userScriptsManagerForm.deleteUserScript(_req);
                    }
                });
                
            } else {
                
                _html += '<tr>\n';
                
                    _html += '<td><h3>No user scripts installed.</h3></td>';
                
                _html += '</tr>\n';
            }
            
            _this.$('#'+_this._tableId+' tbody').html(_html);
        }
        
        this.$('#'+this._tableId+' tbody').empty();
        
        db.fetchAllUserScriptsMetadata(0,25,_sC1,this);
    },
    openUserScriptSettings: function (btnId) {
        
        var _usid = this._extractId(btnId);
        
        
    },
    disableUserScript: function (btnId) {
        
        var _usid = this._extractId(btnId);
        
        
    },
    deleteUserScript: function (btnId) {
        
        var _usid = this._extractId(btnId);
        
        
    },
    _extractId: function (btnId) {
        
        return btnId.substr(btnId.lastIndexOf('-')+1,btnId.length);
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
            
            db.insertGlobalExclude(_val,_fn,this);
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
            
            db.updateGlobalExclude(_id, _url,_fn,this);
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
        
        db.deleteGlobalExclude(_id,_fn,this)
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
                    
                    ks.mainPanel.userScriptsManagerForm.showSuccessAlert("The user script has been added.");
                    
                    ks.mainPanel.userScriptsManagerForm.drawTable();
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
    showWarningAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.warnLevel,strMsg);
    },
    showErrorAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.errorLevel,strMsg);
    },
    showSuccessAlert: function (strMsg) {
        
        this.showAlertMsg(this._formIdObj.formBaseId,this.successLevel,strMsg);
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
        
        this.mainPanel = new KSMainPanel();
        this.mainPanel.contentManager = new KSContentManager();
        this.mainPanel.userScriptsManagerForm = new KSUserScriptsManagerForm();
        this.mainPanel.globalSettingsForm = new KSGlobalSettingsForm();
        this.mainPanel.newUserScriptForm = new KSNewUserScriptForm();
        this.mainPanel.userScriptSettingsForm = new KSUserScriptSettingsForm();
        this.mainPanel.aboutProjectForm = new KSAboutProjectForm();
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
            ks.mainPanel.openTab();
            ks.mainPanel.setTabPage(ks.mainPanel.defaultPage);
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

