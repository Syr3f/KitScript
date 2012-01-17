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
        this.userScriptsManagerForm = null;
        this.globalSettingsForm = null;
        this.newUserScriptForm = null;
        this.userScriptSettingsForm = null;
        this.aboutProjectForm = null;
        
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
    
    //regisForms: [], A TESTER
    initialize: function ($super,formIdObj) {
        
        this._maxAlert = 7000;
        
        $super();
        
        KSContentManager.regisForms.push(formIdObj);
        
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
        
        for (var i=1; i<KSContentManager.regisForms.length; i++) {
            
            if (KSContentManager.regisForms[i].id == _contentId)
                return KSContentManager.regisForms[i].title;
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
            formBaseId: "ks-usm",
            instance: this
        };
        
        $super(this._formIdObj);
        
        this._tableId = this._formIdObj.formBaseId+'-list';
    },
    drawTable: function () {
        
        this.$('#'+this._tableId+' tbody').empty();
        
        db.fetchAllUserScriptsMetadata(0,25,this._dbq_onFetchUserScripts,this);
    },
    _dbq_onFetchUserScripts: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        var _html = "";
        var _sttOn = 'Enabled', _sttOff = 'Disabled';
        
        if (resultSet.rows.length > 0) {
            
            for (var i=0; i<resultSet.rows.length; i++) {
                
                var _row = resultSet.rows.item(i);
                
                if (parseInt(_row['disabled']) === 1)
                    var _lbl = 'important', _stt = "OFF";
                else
                    var _lbl = 'notice', _stt = "ON";
                
                var _sttCmd = (_stt==="ON"?_sttOff.substr(0,_sttOff.length-1):_sttOn.substr(0,_sttOn.length-1));
                
                _html += '<tr id="ks-us-'+_row['id']+'">\n';
                
                    _html += '<td class="span8"><h3>'+_row['name']+' <span class="label '+_lbl+'">'+_stt+'</span></h3><span>'+_row['description']+'</span></td>';
                    _html += '<td class="span2"><a href="#ks-usm-btn-settings-'+_row['id']+'" class="btn small span2 primary">Settings</a></td>';
                    _html += '<td class="span2"><a href="#ks-usm-btn-'+_sttCmd.toLowerCase()+'-'+_row['id']+'" class="btn small span2 info">'+_sttCmd+'</a></td>';
                    _html += '<td class="span2"><a href="#ks-usm-btn-remove-'+_row['id']+'" class="btn small span2 danger">Delete</a></td>\n';
                
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
    },
    openUserScriptSettings: function (btnId) {
        
        var _metaId = this._extractId(btnId);
        
        ks.mainContainer.userScriptSettingsForm.setLoadedMetaId(_metaId);
        ks.mainContainer.userScriptSettingsForm.loadData(_metaId);
        this.transitContent('userscript-settings');
    },
    disableUserScript: function (btnId) {
        
        var _metaId = this._extractId(btnId);
        
        try {
            db.disableUserScript(_metaId, this._dbq_onDisableRequest, this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    _dbq_onDisableRequest: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        _this.drawTable();
        _this.showSuccessAlert('User script has been disabled.');
    },
    enableUserScript: function (btnId) {
        
        var _metaId = this._extractId(btnId);
        
        try {
            db.enableUserScript(_metaId, this._dbq_onEnableRequest, this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    _dbq_onEnableRequest: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        _this.drawTable();
        _this.showSuccessAlert('User script has been enabled.');
    },
    deleteUserScript: function (btnId) {
        
        var _metaId = this._extractId(btnId);
        
        this.__proto__._db = db;
        this.__proto__._metaId = _metaId;
        
        try {
            db.deleteUserScriptFile(_metaId, this._dbq_onDeleteUserScript, this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    _dbq_onDeleteUserScriptFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        _this._db.deleteUserScriptMetadata(_this._metaId, _this._dbq_onDeleteUserScriptMeta, _this);
        delete _this._db;
    },
    _dbq_onDeleteUserScriptMeta: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        _this.drawTable();
        _this.showSuccessAlert('User script has been deleted.');
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
            formBaseId: "ks-gs",
            instance: this
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
            
            try {
                db.insertGlobalExclude(_val,this._dbq_onQueryGlobalExcludes,this);
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
            
            try {
                db.updateGlobalExclude(_id, _url,this._dbq_onQueryGlobalExcludes,this);
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
        
        try {
            db.deleteGlobalExclude(_id,this._dbq_onQueryGlobalExcludes,this);
            this.showSuccessAlert("URL has been deleted.");
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    _dbq_onQueryGlobalExcludes: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        _this.emptyList();
        _this.fillList();
    },
    emptyList: function () {
        
        this.$('#'+this._listId).empty();
    },
    fillList: function () {
        
        db.fetchAllGlobalExcludes(0,1000,this._dbq_onFetchGlobalExcludes,this);
    },
    _dbq_onFetchGlobalExcludes: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            for (var i=0; i<resultSet.rows.length; i++) {
                
                var _row = resultSet.rows.item(i);
                
                var _html = '<option value="'+_row['id']+'">'+_row['url']+'</option>';
                
                _this.$('#'+_this._listId).append(_html);
            }
        }
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
            formBaseId: "ks-aus",
            instance: this
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
        
        this._liria = 'LastInsertId';
        
        this._fname = name;
        this._fspace = space;
        this._fdesc = desc;
        this._fexcludes = excludes;
        this._fincludes = includes;
        
        try {
            db.insertUserScriptFile(KSSHF_blobize(code),this._dbq_onCreateUserScriptFile,this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    _dbq_onCreateUserScriptFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        db.getLastInsertRowId(_this._liria, _this._dbq_onFetchLastInsertId, _this);
    },
    _dbq_onFetchLastInsertId: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            var _row = resultSet.rows.item(0);
            
            db.insertUserScriptMetadata(_this._fname, _this._fspace, _this._escQuot(_this._fdesc), _this._fincludes, _this._fexcludes, parseInt(_row[_this._liria]), 0, null, null, _this._dbq_onCreateUserScriptMeta, _this);
        } else
            _this.showErrorAlert("The user script couldn't be stored.");
    },
    _dbq_onCreateUserScriptMeta: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        _this.transitContent('#userscript-manager');
        
        ks.mainContainer.userScriptsManagerForm.showSuccessAlert("The user script has been added.");
        ks.mainContainer.userScriptsManagerForm.drawTable();
        
        _this.$('#ks-aus-script').val('');
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
        
        const _defaultTabId = "#ks-uss-tab-usersets";
        
        this._formIdObj = {
            id: "userscript-settings",
            title: "User Script Settings",
            formBaseId: "ks-uss",
            instance: this
        };
        
        $super(this._formIdObj);
        
        this._$previousTabId = null;
        this._$currentTabId = _defaultTabId;
    },
    getLoadedMetaId: function () {
        
        return this.$("#ks-uss-us-metaid").val();
    },
    setLoadedMetaId: function (metaId) {
        
        this.$("#ks-uss-us-metaid").val(metaId);
    },
    getLoadedScriptId: function () {
        
        return this.$("#ks-uss-us-scriptid").val();
    },
    setLoadedScriptId: function (usId) {
        
        this.$("#ks-uss-us-scriptid").val(usId);
    },
    loadData: function (metaId) {
        
        this._emptyAllFields();
        this.loadUserScriptMetadata(metaId);
    },
    loadUserScriptMetadata: function (metaId) {
        
        try {
            db.fetchUserScriptMetadata(metaId, this._dbq_onFetchUserScriptMetadata, this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    _dbq_onFetchUserScriptMetadata: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            var _row = resultSet.rows.item(0);
            
            _this._fillScriptSettingsExcludes(_row['excludes']);
            _this._fillScriptSettingsIncludes(_row['includes']);
            _this._fillUserSettingsExcludes(_row['user_excludes']);
            _this._fillUserSettingsIncludes(_row['user_includes']);
            
            _this.loadUserScriptFile(_row['userscript_id']);
        } else
            _this.showFailureAlert("Could not fetch the user script metadata.");
    },
    loadUserScriptFile: function (usId) {
        
        try {
            db.fetchUserScriptFile(usId, this._dbq_onFetchUserScriptFile, this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    _dbq_onFetchUserScriptFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            var _row = resultSet.rows.item(0);
            
            _this._fillScriptEditor(KSSHF_unblobize(_row['userscript']));
        } else
            _this.showFailureAlert("Could not fetch the user script file.");
    },
    
    switchTab: function ($tabId) {
        
        this._$previousTabId = this._$currentTabId;
        this._$currentTabId = $tabId;
        
        this.$(this._$previousTabId).hide();
        this.$(this._$currentTabId).show();
    },
    
    addUserExclusionUrl: function () {
        
    },
    editUserExclusionUrl: function () {
        
    },
    removeUserExclusionUrl: function () {
        
    },
    
    addUserInclusionUrl: function () {
        
    },
    editUserInclusionUrl: function () {
        
    },
    removeUserInclusionUrl: function () {
        
    },
    
    addToUserExclusion: function () {
        
    },
    addToUserInclusion: function () {
        
    },
    
    updateUserScript: function () {
        
        
    },
    
    _fillUserSettingsExcludes: function (excludesStr) {
        
        var _selId = '#ks-uss-us-excl-list';
        var _csv = excludesStr;
        
        this._fillSelector(_selId, _csv);
    },
    _fillUserSettingsIncludes: function (includesStr) {
        
        var _selId = '#ks-uss-us-incl-list';
        var _csv = includesStr;
        
        this._fillSelector(_selId, _csv);
    },
    _fillScriptSettingsExcludes: function (excludesStr) {
        
        var _selId = '#ks-uss-ss-excl-list';
        var _csv = excludesStr;
        
        this._fillSelector(_selId, _csv);
    },
    _fillScriptSettingsIncludes: function (includesStr) {
        
        var _selId = '#ks-uss-ss-incl-list';
        var _csv = includesStr;
        
        this._fillSelector(_selId, _csv);
    },
    _fillSelector: function (selId, csv) {
        
        var _tokens = csv.split(',');
        
        var _html = "";
        
        for (var i=0; i<_tokens.length; i++) {
            
            _html += '<option value="'+i+'">'+_tokens[i]+'</option>';
        }
        
        this.$(selId).html(_html);
    },
    _fillScriptEditor: function (scriptStr) {
        
        this.$('#ks-uss-script').val(scriptStr);
    },
    _emptyUserSettings: function () {
        
        this.$('#ks-uss-us-excl-list').empty();
        this.$('#ks-uss-us-incl-list').empty();
    },
    _emptyScriptSettings: function () {
        
        this.$('#ks-uss-ss-excl-list').empty();
        this.$('#ks-uss-ss-incl-list').empty();
    },
    _emptyScriptEditor: function () {
        
        this.$('#ks-uss-script').val('');
    },
    _emptyAllFields: function () {
        
        this._emptyUserSettings();
        this._emptyScriptSettings();
        this._emptyScriptEditor();
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
            formBaseId: "ks-abt",
            instance: this
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
        this.mainContainer.userScriptSettingsForm = new KSUserScriptSettingsForm();
        this.mainContainer.aboutProjectForm = new KSAboutProjectForm();
    },
    isEnabled: function () {
        
        return this._isEnabled;
    },
    setEnable: function () {
        
        if (!this.isEnabled()) {
            try {
                db.setKitScriptEnabled(this._dbq_onSetEnable, this);
            } catch (e) {
                this.showAlertOnCurrentForm(e.getMessage);
            }
        }
    },
    _dbq_onSetEnable: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        _this.$('#toggle-enable-dropdown').text("KitScript is Enabled!");
        _this._isEnabled = true;
        _this.showAlertOnCurrentForm("KitScript is now enabled.");
    },
    setDisable: function () {
        
        if (this.isEnabled()) {
            try {
                db.setKitScriptDisabled(this._dbq_onSetDisable, this);
            } catch (e) {
                this.showAlertOnCurrentForm(e.getMessage);
            }
            
        }
    },
    _dbq_onSetDisable: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        _this.$('#toggle-enable-dropdown').text("KitScript is Disabled!");
        _this._isEnabled = false;
        _this.showAlertOnCurrentForm("KitScript is now disabled.");
    },
    showAlertOnCurrentForm: function (strMsg) {
        
        var _contentId = KSContentManager.currentContentId;
        var _regis = KSContentManager.regisForms;
        
        for (var i=1; i<_regis.length; i++) {
            
            if (_regis[i].id == _contentId) {
                _regis[i].instance.showSuccessAlert(strMsg);
                break;
            }
        }
    },
    declareEnabled: function () {
        
        db.isKitScriptEnabled(this._dbq_onQueryEnabledState, this);
    },
    _dbq_onQueryEnabledState: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            var _row = resultSet.rows.item(0);
            
            if (parseInt(_row['enabled']) == 1) {
                
                _this._isEnabled = true;
                
                _this.$('#toggle-enable-dropdown').text("KitScript is Enabled!");
            } else {
                
                _this._isEnabled = false;
                
                _this.$('#toggle-enable-dropdown').text("KitScript is Disabled!");
            }
        }
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

