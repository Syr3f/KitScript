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
        
        Object.getPrototypeOf(this).contentManager = null;
        Object.getPrototypeOf(this).userScriptsManagerForm = null;
        Object.getPrototypeOf(this).globalSettingsForm = null;
        Object.getPrototypeOf(this).newUserScriptForm = null;
        Object.getPrototypeOf(this).userScriptSettingsForm = null;
        Object.getPrototypeOf(this).aboutProjectForm = null;
        
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
        
        this.$('#ks-topmenu-nav-'+KSContentManager.previousContentId).removeClass('active');
        this.$('#ks-topmenu-nav-'+KSContentManager.currentContentId).addClass('active');
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

    activateBtns: function () {
        
        this.$("#ks-gs-btn-edit").removeClass('disabled');
        this.$("#ks-gs-btn-edit").addClass('info');
        this.$("#ks-gs-btn-remove").removeClass('disabled');
        this.$("#ks-gs-btn-remove").addClass('danger');
    },
    disactivateBtns: function () {
        
        this.$("#ks-gs-btn-edit").addClass('disabled');
        this.$("#ks-gs-btn-edit").removeClass('info');
        this.$("#ks-gs-btn-remove").addClass('disabled');
        this.$("#ks-gs-btn-remove").removeClass('danger');
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
            
            this.showWarningAlert('Please select a URL pattern to edit it.');
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
        delete transact.objInstance;
        
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
        delete transact.objInstance;
        
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
        delete transact.objInstance;
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
        delete transact.objInstance;
        
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
        delete transact.objInstance;
        
        _this.drawTable();
        _this.showSuccessAlert('User script has been enabled.');
    },
    
    deleteUserScript: function (btnId) {
        this.showWarningDeleteAlert(btnId);
    },
    confirmDeleteScript: function () {
        
        this.hideWarningDeleteAlert();
        
        var _id = this.$('#ks-usm-am-delete-id').val();
        
        var _metaId = this._extractId(_id);
        
        Object.getPrototypeOf(this)._db = db;
        Object.getPrototypeOf(this)._metaId = _metaId;
        
        db.fetchUserScriptFileIdByMetaId(_metaId, this._dbq_onFetchUserScriptFileId, this);
    },
    _dbq_onFetchUserScriptFileId: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            var _row = resultSet.rows.item(0);
            
            var _usId = _row['userscript_id'];
            
            try {
                db.deleteUserScriptFile(_usId, _this._dbq_onDeleteUserScriptFile, _this);
            } catch (e) {
                _this.showFailureAlert(e.getMessage());
            }
        } else {
            _this.showFailureAlert("Couldn't fetch the user script id.");
        }
    },
    _dbq_onDeleteUserScriptFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        db.deleteUserScriptMetadata(_this._metaId, _this._dbq_onDeleteUserScriptMeta, _this);
    },
    _dbq_onDeleteUserScriptMeta: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        _this.drawTable();
        _this.showSuccessAlert('User script has been deleted.');
    },

    _extractId: function (btnId) {
        
        return btnId.substr(btnId.lastIndexOf('-')+1,btnId.length);
    },
    
    showWarningDeleteAlert: function (id) {
        
        this.$('#ks-usm-am-delete-id').val(id);
        this.$('#ks-usm-am-delwarn').removeClass('hide');
    },
    hideWarningDeleteAlert: function () {
        
        this.$('#ks-usm-am-delwarn').addClass('hide');
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
        
        // CodeMirror2 ~ v0.2
        //Object.getPrototypeOf(this).CMEditor = null;
        
        this._textareaId = this._formIdObj.formBaseId+'-script';
    },
    /* CodeMirror2 ~ v0.2
    loadCMEditor: function () {
        
        this.CMEditor = CodeMirror(function (el) {
            var _el = document.getElementById('ks-aus-script');
            _el.parentNode.replaceChild(el, _el);
            jQuery(el).addClass('span13');
            jQuery(el).css('height', '270px');
        },{
            mode: "javascript"
        });
        
        this.$()
    },*/

    addUserScript: function () {
        
        var _script = this.$('#'+this._textareaId).val();
        
        try {
            
            ks.gmmd.loadScript(_script);
            
            var _rec = this._getUserScriptHeaderValues();
            
            this._storeUserScript(_rec[0],_rec[1],_rec[2],_rec[3],_rec[4],_rec[5],_rec[6],_script);
        } catch (e) {
            
            this.showErrorAlert(e.getMessage());
        }
    },
    _getUserScriptHeaderValues: function () {
        
        var _name = ks.gmmd.getName();
        var _space = ks.gmmd.getNamespace();
        var _desc = ks.gmmd.getDescription();
        var _incs = ks.gmmd.getIncludes();
        var _excs = ks.gmmd.getExcludes();
        var _reqs = ks.gmmd.getRequires();
        var _rnat = ks.gmmd.getRunAt();
        
        return [_name,_space,_desc,_incs.join(','),_excs.join(','),_reqs.join(','),_rnat];
    },
    _storeUserScript: function (name, space, desc, includes, excludes, requires, runAt, code) {
        
        Object.getPrototypeOf(this)._fieldName = 'LastInsertId';
        Object.getPrototypeOf(this)._name = name;
        Object.getPrototypeOf(this)._space = space;
        Object.getPrototypeOf(this)._desc = desc;
        Object.getPrototypeOf(this)._includes = includes;
        Object.getPrototypeOf(this)._excludes = excludes;
        Object.getPrototypeOf(this)._requires = requires;
        Object.getPrototypeOf(this)._runAt = runAt;
        
        
        
        try {
            db.insertUserScriptFile(KSSHF_blobize(code),this._dbq_onInsertUserScriptFile,this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    _dbq_onInsertUserScriptFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        db.getLastInsertRowId(_this._fieldName, _this._dbq_onFetchLastInsertId, _this);
    },
    _dbq_onFetchLastInsertId: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            var _row = resultSet.rows.item(0);
            
            var _hash = _this.MD5(_this.sqlClean(_this._name)+_this.sqlClean(_this._space));
            
            Object.getPrototypeOf(_this)._usId = parseInt(_row[_this._fieldName]);
            
            db.insertUserScriptMetadata(_hash, _this.sqlClean(_this._name), _this.sqlClean(_this._space), _this.sqlClean(_this._desc), _this.sqlClean(_this._includes), _this.sqlClean(_this._excludes), _this.sqlClean(_this._requires), parseInt(_row[_this._fieldName]), 0, null, null, _this.sqlClean(_this._runAt), _this._dbq_onCreateUserScriptMeta, _this);
        } else
            _this.showErrorAlert("The user script couldn't be stored.");
    },
    _dbq_onCreateUserScriptMeta: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        _this.transitContent('#userscript-manager');
        
        ks.mainContainer.userScriptsManagerForm.showSuccessAlert("The user script has been added.");
        ks.mainContainer.userScriptsManagerForm.drawTable();
        
        _this.$('#ks-aus-script').val('');
        
        var _requires = _this._requires.split(',');
        
        for (var i=0; i<_requires.length; i++) {
            
            // Absolute URLs Only
            _this.$.ajax({
                url: _requires[i],
                context: _this,
                success: function (responseText, textStatus, XMLHttpRequest) {
                    
                    db.insertRequireFile(_this._usId, KSSHF_blobize(responseText), _this._dbq_onInsertRequireFile, _this);
                }
            });
        }
    },
    _dbq_onInsertRequireFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        _this._l("Require file stored.");
        
        delete _this._fieldName;
        delete _this._name;
        delete _this._space;
        delete _this._desc;
        delete _this._includes;
        delete _this._excludes;
        delete _this._requires;
        delete _this._runAt;
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

KSNewUserScriptForm.persistRequireFile





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
    getUserScript: function () {
        
        return this.$('#ks-uss-script').val();
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
        delete transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            var _row = resultSet.rows.item(0);
            
            _this._fillScriptSettingsExcludes(_row['excludes']);
            _this._fillScriptSettingsIncludes(_row['includes']);
            _this._fillUserSettingsExcludes(_row['user_excludes']);
            _this._fillUserSettingsIncludes(_row['user_includes']);
            
            _this.setLoadedScriptId(_row['userscript_id']);
            
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
        delete transact.objInstance;
        
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
        
        /* For Bigger Editor (CodeMirror2) ~ v0.2
        if (this._$currentTabId === '#ks-uss-tab-scriptedit') {
            this.$('#ks-uss-aside').hide();
            this.$('#ks-uss-tabs').toggleClass('span14', true);
            //this.$('#ks-uss-tabs').toggleClass('span9', false);
        } else {
            this.$('#ks-uss-aside').show();
            this.$('#ks-uss-tabs').toggleClass('span14', false);
            //this.$('#ks-uss-tabs').toggleClass('span9', true);
        }
        */
        
        this.$(this._$previousTabId+'-paneltip').hide();
        this.$(this._$currentTabId+'-paneltip').show();
    },
    
    addUserExclusion: function () {
        
        this.$('#ks-uss-us-add-excl-modal').modal({
            keyboard: true,
            backdrop: true,
            show: true
        });
    },
    editUserExclusion: function () {
        
        this.$('#ks-uss-us-edit-excl-modal').modal({
            keyboard: true,
            backdrop: true,
            show: true
        });
        
        var _id = this.$('#ks-uss-us-excl-list option:selected').val();
        var _url = this.$('#ks-uss-us-excl-list option:selected').text();
        
        this.$('#ks-uss-us-excl-edit-id').val(_id);
        this.$('#ks-uss-us-excl-edit').val(_url);
    },
    registerUserExclusion: function (btnId) {
        
        switch (btnId) {
            case '#ks-uss-us-add-excl-modal-btn':
                
                this.$('#ks-uss-us-add-excl-modal').modal('hide');
                
                var _val = this.$('#ks-uss-us-excl-new').val();
                
                this.$('#ks-uss-us-excl-new').val("");
                
                _val = _val.trim();
                
                if (_val !== "")
                    this.$('#ks-uss-us-excl-list').append('<option>'+_val+'</option>');
                break;
            case '#ks-uss-us-edit-excl-modal-btn':
                
                this.$('#ks-uss-us-edit-excl-modal').modal('hide');
                
                var _id = this.$('#ks-uss-us-excl-edit-id').val();
                var _url = this.$('#ks-uss-us-excl-edit').val();
                
                this.disactivateExclusionBtns();
                
                this.$('#ks-uss-us-excl-edit-id').val("");
                this.$('#ks-uss-us-excl-edit').val("");
                
                if (_val !== "")
                    this.$('#ks-uss-us-excl-list option:selected').text(_url);
                break;
        }
        
        this._updateUserSettings();
    },
    removeUserExclusion: function () {
        
        this.disactivateExclusionBtns();
        
        this.$('#ks-uss-us-excl-list option:selected').remove();
        
        this._updateUserSettings();
        this._emptyUserSettings();
        this._fillUserSettingsLists();
    },
    activateExclusionBtns: function () {
        
        this.$('#ks-uss-us-excl-btn-edit').removeClass('disabled');
        this.$('#ks-uss-us-excl-btn-edit').addClass('info');
        this.$('#ks-uss-us-excl-btn-remove').removeClass('disabled');
        this.$('#ks-uss-us-excl-btn-remove').addClass('danger');
    },
    disactivateExclusionBtns: function () {
        
        this.$('#ks-uss-us-excl-btn-edit').addClass('disabled');
        this.$('#ks-uss-us-excl-btn-edit').removeClass('info');
        this.$('#ks-uss-us-excl-btn-remove').addClass('disabled');
        this.$('#ks-uss-us-excl-btn-remove').removeClass('danger');
    },
    
    addUserInclusion: function () {
        
        this.$('#ks-uss-us-add-incl-modal').modal({
            keyboard: true,
            backdrop: true,
            show: true
        });
    },
    editUserInclusion: function () {
        
        this.$('#ks-uss-us-edit-incl-modal').modal({
            keyboard: true,
            backdrop: true,
            show: true
        });
        
        var _id = this.$('#ks-uss-us-incl-list option:selected').val();
        var _url = this.$('#ks-uss-us-incl-list option:selected').text();
        
        this.$('#ks-uss-us-incl-edit-id').val(_id);
        this.$('#ks-uss-us-incl-edit').val(_url);
    },
    registerUserInclusion: function (btnId) {
        
        switch (btnId) {
            case '#ks-uss-us-add-incl-modal-btn':
                
                this.$('#ks-uss-us-add-incl-modal').modal('hide');
                
                var _val = this.$('#ks-uss-us-incl-new').val();
                
                this.$('#ks-uss-us-incl-new').val("");
                
                _val = _val.trim();
                
                if (_val !== "")
                    this.$('#ks-uss-us-incl-list').append('<option>'+_val+'</option>');
                break;
            case '#ks-uss-us-edit-incl-modal-btn':
                this.$('#ks-uss-us-edit-incl-modal').modal('hide');
                
                var _id = this.$('#ks-uss-us-incl-edit-id').val();
                var _url = this.$('#ks-uss-us-incl-edit').val();

                this.disactivateInclusionBtns();

                this.$('#ks-uss-us-incl-edit-id').val("");
                this.$('#ks-uss-us-incl-edit').val("");
                
                if (_val !== "")
                    this.$('#ks-uss-us-incl-list option:selected').text(_url);
                break;
        }
        
        this._updateUserSettings();
    },
    removeUserInclusion: function () {
        
        this.disactivateInclusionBtns();
        
        this.$('#ks-uss-us-incl-list option:selected').remove();
        
        this._updateUserSettings();
        this._emptyUserSettings();
        this._fillUserSettingsLists();
    },
    activateInclusionBtns: function () {
        
        this.$('#ks-uss-us-incl-btn-edit').removeClass('disabled');
        this.$('#ks-uss-us-incl-btn-edit').addClass('info');
        this.$('#ks-uss-us-incl-btn-remove').removeClass('disabled');
        this.$('#ks-uss-us-incl-btn-remove').addClass('danger');
    },
    disactivateInclusionBtns: function () {
        
        this.$('#ks-uss-us-incl-btn-edit').addClass('disabled');
        this.$('#ks-uss-us-incl-btn-edit').removeClass('info');
        this.$('#ks-uss-us-incl-btn-remove').addClass('disabled');
        this.$('#ks-uss-us-incl-btn-remove').removeClass('danger');
    },
    
    _fillUserSettingsLists: function () {
        
        var _metaId = this.getLoadedMetaId();
        
        db.fetchUserScriptMetadata(_metaId, this._dbq_onFetchMetadata, this);
    },
    _dbq_onFetchMetadata: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            var _row = resultSet.rows.item(0);
            
            _this._fillUserSettingsExcludes(_row['user_excludes']);
            _this._fillUserSettingsIncludes(_row['user_includes']);
        } else {
            _this.showFailureAlert("Couldn't fetch user script metadata.");
        }
    },
    
    activateAddToUserIncludesBtn: function () {
        this.$('#ks-uss-ss-btn-add-usincl').removeClass('disabled');
    },
    disactivateAddToUserIncludesBtn: function () {
        this.$('#ks-uss-ss-btn-add-usincl').addClass('disabled');
    },
    addToUserInclusion: function () {
        
        var _txt = this.$('#ks-uss-ss-excl-list option:selected').text();
        
        this.$('#ks-uss-us-incl-list').append('<option>'+_txt+'</option>');
        
        this.activateUserSettingsTab();
        this._updateUserSettings();
    },
    activateAddToUserExcludesBtn: function () {
        this.$('#ks-uss-ss-btn-add-usexcl').removeClass('disabled');
    },
    disactivateAddToUserExcludesBtn: function () {
        this.$('#ks-uss-ss-btn-add-usexcl').addClass('disabled');
    },
    addToUserExclusion: function () {
        
        var _txt = this.$('#ks-uss-ss-incl-list option:selected').text();
        
        this.$('#ks-uss-us-excl-list').append('<option>'+_txt+'</option>');
        
        this.activateUserSettingsTab();
        this._updateUserSettings();
    },
    activateUserSettingsTab: function () {
        
        this.switchTab('#ks-uss-tab-usersets');
        this.$('#ks-uss-tabs li.active').removeClass('active');
        this.$('#ks-uss-tab-usersets-tab').addClass('active');
    },
    
    _updateUserSettings: function () {
        
        var _metaId = this.getLoadedMetaId();
        
        var _excls = this._getUserExclusions();
        var _incls = this._getUserInclusions();
        
        try {
            db.updateUserScriptUserSettings(_metaId, _incls, _excls, this._dbq_onUpdateUserSettings, this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    _getUserExclusions: function () {
        
        var _strs = [];
        
        this.$('#ks-uss-us-excl-list option').each(function (idx, el) {
            
            if (jQuery(el).text().length > 0)
                _strs.push(jQuery(el).text());
        });
        
        return _strs.join(',');
    },
    _getUserInclusions: function () {
        
        var _strs = [];
        
        this.$('#ks-uss-us-incl-list option').each(function (idx, el) {
            
            if (jQuery(el).text().length > 0)
                _strs.push(jQuery(el).text());
        });
        
        return _strs.join(',');
    },
    _dbq_onUpdateUserSettings: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        _this.showSuccessAlert("The user settings have been updated.");
    },
    
    updateUserScript: function () {
        
        var _metaId = this.getLoadedMetaId();
        
        try {
            db.isUserScriptEnabled(_metaId, this._dbq_onQueryUserScriptEnabled, this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    _dbq_onQueryUserScriptEnabled: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        if (resultSet.rows.length > 0) {

            var _row = resultSet.rows.item(0);
            
            var _isEnabled = parseInt(_row['disabled']);
            
            var _usId = _this.getLoadedScriptId();
            var _usStr = _this.getUserScript();
            
            ks.gmmd.loadScript(_usStr);
            
            var _rec = _this._getUserScriptHeaderValues();
            
            _this.updateUserScriptMetadata(_rec[0],_rec[1],_rec[2],_rec[3],_rec[4],_rec[5],_isEnabled,_rec[6]);
        } else {
            _this.showFailureAlert("Couldn't update the user script.");
        }
    },
    _getUserScriptHeaderValues: function () {
        
        var _name = ks.gmmd.getName();
        var _space = ks.gmmd.getNamespace();
        var _desc = ks.gmmd.getDescription();
        var _incs = ks.gmmd.getIncludes();
        var _excs = ks.gmmd.getExcludes();
        var _reqs = ks.gmmd.getRequires();
        var _rnat = ks.gmmd.getRunAt();
        
        return [_name,_space,_desc,_incs.join(','),_excs.join(','),_reqs.join(','),_rnat];
    },
    updateUserScriptMetadata: function (name, space, desc, includes, excludes, requires, disabled, runAt) {
        
        var _metaId = this.getLoadedMetaId();
        var _usId = this.getLoadedScriptId();
        
        this.reacquireRequireFiles(requires);
        
        var _uexcls = this._getUserExclusions();
        var _uincls = this._getUserInclusions();
        
        var _hash = this.MD5(this.sqlClean(name)+this.sqlClean(space));
        
        try {
            db.updateUserScriptMetadata(_metaId, _hash, this.sqlClean(name), this.sqlClean(space), this.sqlClean(desc), this.sqlClean(includes), this.sqlClean(excludes), this.sqlClean(requires), disabled, _uincls, _uexcls, runAt, this._dbq_onUpdateMetadata, this);
        } catch (e) {
            this.showFailureAlert(e.getMessage());
        }
    },
    _dbq_onUpdateMetadata: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        try {
            var _usId = _this.getLoadedScriptId();
            var _usStr = _this.getUserScript();
            
            db.updateUserScriptFile(_usId, KSSHF_blobize(_usStr), _this._dbq_onUpdateUserScriptFile, _this);
        } catch (e) {
            _this.showFailureAlert(e.getMessage());
        }
    },
    _dbq_onUpdateUserScriptFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        // Reload data
        _this.loadData(_this.getLoadedMetaId());
        
        _this.showSuccessAlert("User script has been updated.");
    },
    reacquireRequireFiles: function (requires) {
        
        Object.getPrototypeOf(this)._requires = requires;
        
        var _usId = this.getLoadedScriptId();
        
        db.deleteRequireFilesByUserScriptId(_usId, this._dbq_onDeleteRequireFiles, this);
    },
    _dbq_onDeleteRequireFiles: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        _this._l("Require files deleted.");
        
        var _requires = _this._requires.split(',');
        var _usId = _this.getLoadedScriptId();
        _this._a("1");
        for (var i=0; i<_requires.length; i++) {
            
            // Absolute URLs Only
            _this.$.ajax({
                url: _requires[i],
                context: _this,
                success: function (responseText, textStatus, XMLHttpRequest) {
                    
                    db.insertRequireFile(_usId, KSSHF_blobize(responseText), _this._dbq_onInsertRequireFile, _this);
                }
            });
        }
        
        delete _this._requires;
    },
    _dbq_onInsertRequireFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        _this._l("Require file inserted.");
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
            
            if (_tokens[i].length > 0)
                _html += '<option value="'+i+'">'+_tokens[i]+'</option>';
        }
        
        if (_html.length > 0)
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





var KSLoaderTreeNode = {
    metaId: 0,
    fileId: 0,
    u_excludes: [],
    u_includes: [],
    us_excludes: [],
    us_includes: [],
    us_requires: [],
    us_run_at: ""
};





/**
 *  KSLoader (KitScript User Script Loader & Injector Class)
 */
var KSLoader = Class.create(_Utils, {
    
    initialize: function () {
        
        this._usTree = new Array();
        this._globExcls = new Array();
    },
    loadData: function () {
        
        if (ks.isEnabled() === true) {
            
            this._usTree = new Array();
            this._globExcls = new Array();
            
            this.loadUserScriptsMetadata();
            this.loadGlobalExcludes();
        }
    },
    dumpData: function () {
        
        delete this._usTree;
        delete this._globExcls;
    },
    loadUserScriptsMetadata: function () {
        
        try {
            db.fetchAllUserScriptsMetadata(0, 1000, this._dbq_onFetchUserScriptsMetadata, this);
        } catch (e) {
            this._a("KitScript Loader Error: Couldn't load user scripts metadata ("+e.getMessage()+").");
        }
    },
    _dbq_onFetchUserScriptsMetadata: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        for (var i=0; i<resultSet.rows.length; i++) {
            
            var _row = resultSet.rows.item(i);
            
            var _node = Object.create(KSLoaderTreeNode);
            
            _node.metaId = _row['id'];
            _node.fileId = _row['userscript_id'];
            _node.u_excludes = _row['user_excludes'].split(',');
            _node.u_includes = _row['user_includes'].split(',');
            _node.us_excludes = _row['excludes'].split(',');
            _node.us_includes = _row['includes'].split(',');
            _node.us_requires = _row['requires'].split(',');
            _node.us_run_at = _row['run_at'];
            
            _this._usTree.push(_node);
        }
    },
    loadGlobalExcludes: function () {
        
        try {
            db.fetchAllGlobalExcludes(0,1000,this._dbq_onFetchGlobalExcludes,this);
        } catch (e) {
            alert("KitScript Loader Error: Couldn't load global excludes ("+e.getMessage()+").");
        }
    },
    _dbq_onFetchGlobalExcludes: function (transact,resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        for (var i=0; i<resultSet.rows.length; i++) {
            
            var _row = resultSet.rows.item(i);
            
            _this._globExcls.push(_row['url']);
        }
    },
    
    isValidScheme: function (url) {
        
        if (url.trim().length > 0) {
            
            var _scheme = url.substr(0, url.indexOf(':'));

            switch (_scheme) {
                case 'data':
                case 'ftp':
                case 'http':
                case 'https':
                    return true;
                    break;
                default:
                    return false;
            }
        }
    },
    /* For Loading User Scripts Locations ~ v0.2
    isUserScript: function (url) {
        
        if (/^.*user.js$/gi.test(url) === true) {
            
            
        }
    },*/
    
    _translateGlobbingOperator: function (pattern) {
        
        //var _re = /[\]\.]\*/
        
    },
    
    integrate: function (url) {
        
        if (ks.isEnabled() === true) {
            
            // check if url is blocked by global layer
            for (var g=0; g<this._globExcls.length; g++) {

                var _re = new RegExp(this._globExcls[g]);

                if (_re.test(url) === true) {

                    return false;
                }
            }

            // Parse usTree: ~= Must Be Recursive =~
            /*
            for (var ut=0; ut<this._usTree.length; ut++) {

                var _ut = this._usTree[ut];

                for (var ue=0; ue<_ut.u_excludes.length; ue++) {

                    var _ue = _ut.u_excludes[ue];

                    var _reUE = new RegExp(_ue);

                    if (_reUE.test(url) === true) {

                        return false;
                    }
                }

            }
            */

            Object.getPrototypeOf(this)._fileId = this._usTree[0].fileId;
            Object.getPrototypeOf(this)._incls = this._usTree[0].us_includes;
            Object.getPrototypeOf(this)._excls = this._usTree[0].us_excludes;

            if (KSGreasemonkeyMetadata.RUNAT_START == this._usTree[0].us_run_at)
                Object.getPrototypeOf(this)._runAtEnd = false;
            else
                Object.getPrototypeOf(this)._runAtEnd = true;
        }
    },
    _dbq_onFetchUserScriptFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        var _row = resultSet.rows.item(0);
        
        db.fetchUserScriptFileByMetaId(this._usTree[0].metaId, this._dbq_onFetchUserScriptFile, this);
        safari.extension.addContentScript(KSSHF_unblobize(_row['userscript']), [".*"] , [], true);
    }
});





/**
 *  KitScript Class
 */
var KitScript = Class.create(_Utils, {
    
    initialize: function ($super) {
        
        $super();
        
        this._isEnabled = true;
        
        Object.getPrototypeOf(this).gmmd = new KSGreasemonkeyMetadata();
        
        Object.getPrototypeOf(this).mainContainer = new KSMainContainer();
        
        this.mainContainer.contentManager = new KSContentManager();
        this.mainContainer.globalSettingsForm = new KSGlobalSettingsForm();
        this.mainContainer.userScriptsManagerForm = new KSUserScriptsManagerForm();
        this.mainContainer.newUserScriptForm = new KSNewUserScriptForm();
        this.mainContainer.userScriptSettingsForm = new KSUserScriptSettingsForm();
        this.mainContainer.aboutProjectForm = new KSAboutProjectForm();
        
        Object.getPrototypeOf(this).loader = new KSLoader();
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
        delete transact.objInstance;
        
        _this.$('#toggle-enable-dropdown').text("KitScript is Enabled!");
        _this._isEnabled = true;
        _this.showAlertOnCurrentForm("KitScript is now enabled.");
        
        ks.loader.loadData();
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
        delete transact.objInstance;
        
        _this.$('#toggle-enable-dropdown').text("KitScript is Disabled!");
        _this._isEnabled = false;
        _this.showAlertOnCurrentForm("KitScript is now disabled.");
        
        ks.loader.dumpData();
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
        delete transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            var _row = resultSet.rows.item(0);
            
            if (parseInt(_row['enabled']) == 1) {
                
                _this._isEnabled = true;
                
                _this.$('#toggle-enable-dropdown').text("KitScript is Enabled!");
                ks.loader.loadData();
            } else {
                
                _this._isEnabled = false;
                
                _this.$('#toggle-enable-dropdown').text("KitScript is Disabled!");
                ks.loader.dumpData();
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

function KSSEFH_NavigateHandler(event) {
    
    if (ks.loader.isValidScheme(event.target.url) === true) {
        
        // To Load User Scripts From Location ~ v0.2
        //if (ks.loader.isUserScript(event.target.url)) {
            
            // Ask to add to manager ~ v0.2
        //} else {
            
            // Process if URL is in includes
            ks.loader.integrate(event.target.url);
        //}
    }
}

safari.application.addEventListener("command", KSSEFH_CommandHandler, false);
safari.application.addEventListener("validate", KSSEFH_ValidateHandler, false);
safari.application.addEventListener("navigate", KSSEFH_NavigateHandler, false);
