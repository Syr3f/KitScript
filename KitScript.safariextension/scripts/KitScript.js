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
        
        this._cyclePages(page);
        
        // Forces Page Load 
        this._tab.url = "about:blank";
        
        this._tab.url = safari.extension.baseURI+"markups/"+page;
    },
    openTab: function () {
        
        this._tab = safari.application.activeBrowserWindow.openTab('foreground',-1);
        this._isTabOpen = true;
        this._tab.addEventListener('close',KSSEFH_CloseTabHandler,true);
    },
    closeTab: function () {
        
        if (this._tab !== null) {
            
            this._tab.close();
            delete this._tab;
            this._tab = null;
            this._isTabOpen = false;
        }
    },
    _cyclePages: function (newPage) {
        
        this._previousPage = this._currentPage;
        this._currentPage = newPage;
    },
    isTabOpen: function () {
        
        return this._isTabOpen;
    },
    setTabClosed: function () {
        
        this._isTabOpen = false;
    },
    getTabURL: function () {
        
        return this._tab.url;
    },
    getTab: function () {
        
        return this._tab;
    },
    reloadActiveTab: function () {
        
        var _url = safari.application.activeBrowserWindow.activeTab.url;
        safari.application.activeBrowserWindow.activeTab.url = _url;
    }
});





/**
 *  KSMainContainer (KitScript User Scripts Main Container Class)
 */
var KSMainContainer = Class.create(KSBase, {
    
    initialize: function ($super) {
        
        Object.getPrototypeOf(this).contentManager = null;
        Object.getPrototypeOf(this).userScriptsManagerForm = null;
        Object.getPrototypeOf(this).globalSettingsForm = null;
        Object.getPrototypeOf(this).newUserScriptForm = null;
        Object.getPrototypeOf(this).userScriptSettingsForm = null;
        Object.getPrototypeOf(this).aboutProjectForm = null;
        
        $super();
    },
    openPage: function ($super,pageId) {
        
        var _pageId = pageId || this.defaultPage;
        
        $super(_pageId);
    },
    displayVersion: function () {
        
        this.$('#ks-version').append("<b>KitScript v"+ks.getVersion()+"</b>");
    }
});





/**
 *  KSContentManager (KitScript Content Manager for the Main Container)
 */
var KSContentManager = Class.create(_Utils, {
    
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

KSContentManager.regisForms = new Array();
KSContentManager.defaultContentId = 'userscript-manager';
KSContentManager.currentContentId = KSContentManager.defaultContentId;
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
        
        KSGlobalSettingsForm.id = this._formIdObj.id;
        
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
                this.showFailureAlert(e.message);
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
                this.showFailureAlert(e.message);
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
            this.showFailureAlert(e.message);
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
        
        KSUserScriptsManagerForm.id = this._formIdObj.id;
        
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
            this.showFailureAlert(e.message);
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
            this.showFailureAlert(e.message);
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
        
        this._db = db;
        this._metaId = _metaId;
        
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
                db.deleteRequireFilesByUserScriptId(_usId);
            } catch (e) {
                _this.showFailureAlert(e.message);
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
        
        KSNewUserScriptForm.id = this._formIdObj.id;
        
        $super(this._formIdObj);
        
        // CodeMirror2 ~ v0.2
        //this.CMEditor = null;
        
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
            
            this._storeUserScript(_rec[0],_rec[1],_rec[2],_rec[3],_rec[4],_rec[5],_rec[6],_rec[7],_script);
        } catch (e) {
            
            this.showFailureAlert(e.message);
        }
    },
    _getUserScriptHeaderValues: function () {
        
        var _name = ks.gmmd.getName();
        var _space = ks.gmmd.getNamespace();
        var _desc = ks.gmmd.getDescription();
        var _incs = ks.gmmd.getIncludes();
        var _excs = ks.gmmd.getExcludes();
        var _reqs = ks.gmmd.getRequires();
        var _rsrcs = ks.gmmd.getResources();
        var _rnat = ks.gmmd.getRunAt();
        
        if (_name.length == 0 && _space.length == 0) {
            
            throw new KSGMException("KitScript needs a @name and @namespace in the metadata block.");
        }
        
        return [_name,_space,_desc,_incs.join(','),_excs.join(','),_reqs.join(','),_rsrcs,_rnat];
    },
    _storeUserScript: function (name, space, desc, includes, excludes, requires, resources, runAt, code) {
        
        this._fieldName = 'LastInsertId';
        this._name = name;
        this._space = space;
        this._desc = desc;
        this._includes = includes;
        this._excludes = excludes;
        this._requires = requires;
        this._resources = resources;
        this._runAt = runAt;
        
        try {
            db.insertUserScriptFile(KSSHF_blobize(code),this._dbq_onInsertUserScriptFile,this);
        } catch (e) {
            this.showFailureAlert(e.message);
        }
    },
    _dbq_onInsertUserScriptFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        db.getLastInsertRowId(_this._fieldName, _this._dbq_onFetchLastInsertId, _this);
    },
    _dbq_onFetchLastInsertId: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        //delete transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            var _row = resultSet.rows.item(0);
            
            var _hash = _this.MD5(_this.sqlClean(_this._name)+_this.sqlClean(_this._space));
            
            Object.getPrototypeOf(_this)._usId = parseInt(_row[_this._fieldName]);
            
            db.insertUserScriptMetadata(_hash, _this.sqlClean(_this._name), _this.sqlClean(_this._space), _this.sqlClean(_this._desc), _this.sqlClean(_this._includes), _this.sqlClean(_this._excludes), _this.sqlClean(_this._requires), parseInt(_row[_this._fieldName]), 0, null, null, _this.sqlClean(_this._runAt), _this._dbq_onCreateUserScriptMeta, _this);
        } else
            _this.showFailureAlert("The user script couldn't be stored.");
    },
    _dbq_onCreateUserScriptMeta: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        //delete transact.objInstance;
        
        _this.transitContent('#userscript-manager');
        
        ks.mainContainer.userScriptsManagerForm.showSuccessAlert("The user script has been added.");
        ks.mainContainer.userScriptsManagerForm.drawTable();
        
        _this.$('#ks-aus-script').val('');
        
        var _requires = _this._requires.split(',');
        
        for (var i=0; i<_requires.length; i++) {
            
            // Absolute URLs Only
            _this.$.ajax({
                url: _requires[i],
                //context: _this,
                success: function (responseText, textStatus, XMLHttpRequest) {
                    db.insertRequireFile(_this._usId, KSSHF_blobize(responseText), _this._dbq_onInsertRequireFile, _this);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    _this.showFailureAlert(errorThrown);
                }
            });
        }
        
        _this.getResourceFiles();
    },
    getResourceFiles: function (laterals) {
        
        var _resources = this._resources;
        
        for (var j=0; j<_resources.length; j++) {
            
            var _res = _resources[j];
            
            // Absolute URLs Only
            _this.$.ajax({
                url: _res.resource,
                success: function (responseText, textStatus, XMLHttpRequest) {
                    db.insertResourceFile(_this._usId, _res.name, KSSHF_blobize(responseText), _this._dbq_onInsertResourceFile, _this);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    _this.showFailureAlert(errorThrown);
                }
            });
        }
    },
    _dbq_onInsertRequireFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        console.log("Require file stored.");
        
        delete _this._fieldName;
        delete _this._name;
        delete _this._space;
        delete _this._desc;
        delete _this._includes;
        delete _this._excludes;
        delete _this._requires;
        delete _this._runAt;
        
        ks.loader.reload();
    },
    _dbq_onInsertResourceFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        console.log("Resource file stored.");
        
        delete _this._resources;
        
        ks.loader.reload();
    },
    
    loadURL: function (scriptUrl) {
        
        this.$.ajax({
            url: scriptUrl,
            context: this,
            success: function (responseText, textStatus, XMLHttpRequest) {
                
                this.setScriptCode(responseText);
            }
        });
    },
    
    getScriptCode: function () {
        
        this.$('#'+this._textareaId).val();
    },
    setScriptCode: function (scriptCode) {
        
        this.$('#'+this._textareaId).val(scriptCode);
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
        
        KSUserScriptSettingsForm.id = this._formIdObj.id;
        
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
            this.showFailureAlert(e.message);
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
            this.showFailureAlert(e.message);
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
            this.showFailureAlert(e.message);
        }
    },
    _getUserExclusions: function () {
        
        var _strs = new Array();
        
        this.$('#ks-uss-us-excl-list option').each(function (idx, el) {
            
            if (jQuery(el).text().length > 0)
                _strs.push(jQuery(el).text());
        });
        
        return _strs.join(',');
    },
    _getUserInclusions: function () {
        
        var _strs = new Array();
        
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
            this.showFailureAlert(e.message);
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
            
            try {
                ks.gmmd.loadScript(_usStr);
                
                var _rec = _this._getUserScriptHeaderValues();
            } catch (e) {
                _this.showFailureAlert(e.message);
            }
            
            _this.updateUserScriptMetadata(_rec[0],_rec[1],_rec[2],_rec[3],_rec[4],_rec[5],_rec[6],_isEnabled,_rec[7]);
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
        var _rsrcs = ks.gmmd.getResources();
        var _rnat = ks.gmmd.getRunAt();
        
        if (_name.length == 0 && _space.length == 0) {
            
            throw new KSGMException("KitScript needs a @name and @namespace in the metadata block.");
        }
        
        return [_name,_space,_desc,_incs.join(','),_excs.join(','),_reqs.join(','),_rsrcs,_rnat];
    },
    updateUserScriptMetadata: function (name, space, desc, includes, excludes, requires, resources, disabled, runAt) {
        
        var _metaId = this.getLoadedMetaId();
        var _usId = this.getLoadedScriptId();
        
        this.reacquireRequireFiles(requires);
        this.reacquireResourceFiles(resources);
        
        var _uexcls = this._getUserExclusions();
        var _uincls = this._getUserInclusions();
        
        var _hash = this.MD5(this.sqlClean(name)+this.sqlClean(space));
        
        try {
            db.updateUserScriptMetadata(_metaId, _hash, this.sqlClean(name), this.sqlClean(space), this.sqlClean(desc), this.sqlClean(includes), this.sqlClean(excludes), this.sqlClean(requires), disabled, _uincls, _uexcls, runAt, this._dbq_onUpdateMetadata, this);
        } catch (e) {
            this.showFailureAlert(e.message);
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
            _this.showFailureAlert(e.message);
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
        
        this._requires = requires;
        
        var _usId = this.getLoadedScriptId();
        
        db.deleteRequireFilesByUserScriptId(_usId, this._dbq_onDeleteRequireFiles, this);
    },
    _dbq_onDeleteRequireFiles: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        _this._l("Require files deleted.");
        
        var _requires = _this._requires.split(',');
        _this._usId = _this.getLoadedScriptId();
        
        for (var i=0; i<_requires.length; i++) {
            
            // Absolute URLs Only
            _this.$.ajax({
                url: _requires[i],
                context: _this,
                success: function (responseText, textStatus, XMLHttpRequest) {
                    db.insertRequireFile(this.usId, KSSHF_blobize(responseText), this._dbq_onInsertRequireFile, this);
                }
            });
        }
        
        delete _this._requires;
    },
    _dbq_onInsertRequireFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        _this._l("Require file inserted.");
        
        ks.loader.reload();
    },
    reacquireResourceFiles: function (resources) {
        
        this._resources = resources;
        
        var _usId = this.getLoadedScriptId();
        
        db.deleteResourceFilesByUserScriptId(_usId, this._dbq_onDeleteResourceFiles, this);
    },
    _dbq_onDeleteResourceFiles: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        _this._l("Resource files deleted.");
        
        _this._usId = _this.getLoadedScriptId();
        
        for (var i=0; i<_resources.length; i++) {
            
            var _res = _resources[i];
            
            // Absolute URLs Only
            _this.$.ajax({
                url: _res.resource,
                context: _this,
                success: function (responseText, textStatus, XMLHttpRequest) {
                    
                    db.insertResourceFile(this.usId, KSSHF_blobize(responseText), this._dbq_onInsertRequireFile, this);
                }
            });
        }
        
        delete _this._resources;
    },
    _dbq_onInsertResourceFile: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        _this._l("Resource file inserted.");
        
        ks.loader.reload();
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
        
        KSAboutProjectForm.id = this._formIdObj.id;
        
        $super(this._formIdObj);
    },
    convertMdTxt: function () {
        
        var _txt = this.$('#ks-abt-md-txt').text();
        var _html = this.md.toHTML(_txt);
        
        this.$('#ks-abt-html-txt').html(_html);
    }
});






/**
 *  KSUserScriptNode (KitScript User Script Node Definition)
 */
var KSUserScriptNode = {
    metaId: 0,
    fileId: 0,
    hashId: 0,
    userscript: "",
    u_excludes: new Array(),
    u_includes: new Array(),
    us_excludes: new Array(),
    us_includes: new Array(),
    us_requires: new Array(),
    us_run_at: true,
    us_injection_url: "",
    req_injection_urls: new Array(),
    disabled: false
};





/**
 *  KSLoader (KitScript User Script Loader & Injector Class)
 */
var KSLoader = Class.create(_Utils, {
    
    initialize: function () {
        
        this._usTree = new Array();
        this._globExcls = new Array();
    },
    isValidScheme: function (url) {
        
        if (url.trim().length > 0) {
            
            var _scheme = url.substr(0, url.indexOf(':'));
            
            switch (_scheme) {
                //case 'data':  // not valid in for safari.extension.addContentScript
                //case 'ftp':   // not valid in for safari.extension.addContentScript
                case 'http':
                case 'https':
                    return true;
                    break;
                default:
                    return false;
            }
        }
    },
    isKitScriptExtz: function (url) {
        
        if (/^safari\-extension\:\/\/com\.cyb3rca\.safari\.kitScript\-NB87APP947(.*)/.test(url) === true) {
            return true;
        }
        return false;
    },
    isUserScript: function (url) {
        
        if (/^.*\.user\.js$/gi.test(url)===true) return true;
    },
    load: function () {
        
        if (ks.isEnabled() === true) {
            
            this._usTree = new Array();
            this._globExcls = new Array();
            
            this._loadDataAndInject();
            
            KSLoader._lastFetchRun = -1;
            KSLoader._lastWatchRun = -1;
            
            KSLoader.triggeredIntegrateWatch();
        }
    },
    dumpData: function () {
        
        this._usTree = new Array();
        this._globExcls = new Array();
    },
    _loadDataAndInject: function () {
        
        try {
            db.fetchAllUserScriptsMetadata(0, 1000, this._dbq_onFetchUserScriptsMetadata, this);
        } catch (e) {
            this._a("KitScript Loader Error: Couldn't load user scripts metadata ("+e.message+").");
        }
    },
    _dbq_onFetchUserScriptsMetadata: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        for (var i=0; i<resultSet.rows.length; i++) {
            
            var _row = resultSet.rows.item(i);
            
            var _node = Object.create(KSUserScriptNode);
            
            _node.metaId = _row['id'];
            _node.fileId = _row['userscript_id'];
            _node.hashId = _row['hash'];
            _node.u_excludes = _row['user_excludes'].split(',');
            _node.u_includes = _row['user_includes'].split(',');
            _node.us_requires = new Array();
            _node.us_excludes = _row['excludes'].split(',');
            _node.us_includes = _row['includes'].split(',');
            _node.disabled = (parseInt(_row['disabled'])==0?false:true)
            
            if (_row['run_at'] == KSGreasemonkeyMetadata.RUNAT_START)
                _node.us_run_at = false;
            else
                _node.us_run_at = true;
            
            _this._usTree.push(_node);
            
            db.fetchUserScriptFileByMetaId(_row['id'], _this._dbq_onFetchUserScriptFile, _this);
        }
    },
    _dbq_onFetchUserScriptFile: function (transact,resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        var _row = resultSet.rows.item(0);
        
        for (var i=0; i<_this._usTree.length; i++) {
            
            var _ut = _this._usTree[i];
            
            if (_ut.fileId == _row['id']) {
                
                _this._usTree[i].userscript = _row['userscript'];
                break;
            }
        }
        
        db.fetchRequireFilesByUserScriptId(_row['id'], _this._dbq_onFetchRequireFiles, _this);
    },
    _dbq_onFetchRequireFiles: function (transact,resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            var i=0;
            
            var _row = resultSet.rows.item(i);
            
            for (var u=0; u<_this._usTree.length; u++) {
                
                var _ut = _this._usTree[u];
                
                if (parseInt(_row['userscript_id']) == parseInt(_ut.fileId)) {
                    
                    do {
                        _row = resultSet.rows.item(i);
                        _this._usTree[u].us_requires.push(_row['file']);
                        i++;
                    } while (i<resultSet.rows.length);
                    
                    break;
                }
            }
        }
        
        try {
            db.fetchAllGlobalExcludes(0,1000,_this._dbq_onFetchGlobalExcludes,_this);
        } catch (e) {
            alert("KitScript Loader Error: Couldn't load global excludes ("+e.message+").");
        }
    },
    _dbq_onFetchGlobalExcludes: function (transact,resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        for (var i=0; i<resultSet.rows.length; i++) {
            
            var _row = resultSet.rows.item(i);
            
            _this._globExcls.push(_row['url']);
        }
        
        KSLoader._lastFetchRun = Date.now();
    },
    
    integrate: function (url) {
        
        if (ks.isEnabled() === true) {
            
            // Parse usTree To Inject Scripts By Metadata Entry
            for (var ut=0; ut<this._usTree.length; ut++) {
                
                var _ut = this._usTree[ut];
                
                if (_ut.disabled === false) {
                    
                    // Blacklist
                    var _bl = this._globExcls;
                    _bl.push(_ut.u_excludes);
                    _bl.push(_ut.us_excludes);
                    
                    // Whitelist
                    var _wl = _ut.u_includes;
                    _wl.push(_ut.us_includes);
                    
                    // Run at
                    var _ra = _ut.us_run_at;
                    
                    // Inject User Script Node ~ Valuable For Proxy Identification
                    var _injurl = safari.extension.addContentScript('var KSInstance = '+JSON.stringify(_ut), _wl, _bl, false);
                    
                    // Inject Require Files
                    for (var rf=0; rf<_ut.us_requires.length; rf++) {
                        
                        var _rf = _ut.us_requires[rf];
                        
                        var _injurl = safari.extension.addContentScript(KSSHF_unblobize(_rf), _wl, _bl, false);
                        
                        if (_injurl !== null)
                            this._usTree[ut].req_injection_urls.push(_injurl);
                    }
                    
                    var _injurl = safari.extension.addContentScript(KSSHF_unblobize(_ut.userscript), _wl, _bl, _ut.us_run_at);
                    
                    if (_injurl !== null)
                        this._usTree[ut].us_injection_url = _injurl;
                }
            }
        }
    },
    disintegrate: function () {
        
        for (var ut=0; ut<this._usTree.length; ut++) {
            
            var _ut = this._usTree[ut];
            
            for (var rf=0; rf<_ut.req_injection_urls.length; rf++) {
                
                safari.extension.removeContentScript(_ut.req_injection_urls[rf]);
            }
            safari.extension.removeContentScript(_ut.us_injection_url);
        }
        
        //safari.extension.removeContentScripts();
        //this.safext.removeContentScripts();
        
        // v0.4
        //safari.extension.removeContentStyleSheets();
    },
    unload: function () {
        
        this.dumpData();
        safari.extension.removeContentScripts();
    },
    reload: function () {
        
        this.unload();
        this.load();
    }
});


KSLoader._lastFetchRun = -1;
KSLoader._lastWatchRun = -1;

Object.getPrototypeOf(KSLoader).triggeredIntegrateWatch = function () {
    
    if (KSLoader._lastWatchRun - KSLoader._lastFetchRun >= 500) {
        
        ks.loader.integrate();
    } else {
        
        KSLoader._lastWatchRun = Date.now();
        window.setTimeout(KSLoader.triggeredIntegrateWatch, 250);
    }
}





/**
 *  KSRoute (KitScript Route Node Definition)
 */
var KSRouteNode = {
    key: '',
    type: undefined,
    route: undefined,
    callback: undefined
};





/**
 *  KSRoutes (KitScript Routing Class)
 */
var KSRoutes = Class.create(_Utils, {
    
    initialize: function ($super, baseURI) {
        
        $super();
        
        this._baseURI = baseURI;
        
        this.TYPE_STATIC = 'static';
        this.TYPE_REGEXP = 'regexp';
        this.TYPE_DYNAMIC = 'dynamic';
        
        this._routes = [];
    },
    add: function (name,route,callback) {
        
        // Default Callback
        var _fn = callback || function (request) {};
        
        var _type = undefined;
        
        if (typeof route === 'string') {
            
            if (/([#?=&\/]{1}:[\-_a-zA-Z0-9]*)/.test(route)===true) {
                _type = this.TYPE_DYNAMIC;
                // Not To Be Implemented Yet
                //var _matches = /([^&=?#/]?:\w)*(([&=?#/]{1}:[\-_a-zA-Z]*)*(?:[^&=?#/]*:))*/g.exec(route);
            } else
                _type = this.TYPE_STATIC
        } else if (typeof route === 'object')
            _type = this.TYPE_REGEXP;
        
        var _rte = Object.create(KSRouteNode);
        
        _rte.key = name,
        _rte.type = _type,
        _rte.route = route,
        _rte.callback = _fn;
        
        this._routes.push(_rte);
    },
    count: function () {
        return this._routes.length;
    },
    getRouteByIndex: function (idx) {
        
        return this._routes[idx];
    },
    getRouteByMatch: function (uri) {
        
        var _u = this._stripBaseURI(uri);
        var _is = false;
        
        for (var i=0; i<this._routes.length; i++) {
            
            var __rte = this._routes[i];
            
            switch (__rte.type) {
                case this.TYPE_STATIC:
                    _is = this._hasRouteMatchStatic(_u,__rte);
                    break;
                case this.TYPE_REGEXP:
                    _is = this._hasRouteMatchRegExp(_u,__rte);
                    break;
                case this.TYPE_DYNAMIC:
                    throw new Error('Route type TYPE_DYNAMIC is not implemented.');
                    //_rte = this._hasRouteMatchDynamic(_u,__rte);
                    break;
                default:
                    throw new Error('Route type is not valid: '+__rte.type+'.');
            }
            
            if (_is===true) return __rte;
        }
    },
    _hasRouteMatchStatic: function (uri,rte) {
        
        if (uri===rte.route)
            return true;
        return false;
    },
    _hasRouteMatchRegExp: function (uri,rte) {
        
        var _ptrn = rte.route;
        if (_ptrn.test(uri) === true)
            return true;
        return false;
    },
    _hasRouteMatchDynamic: function (uri,rte) {
        // Not Implemented Yet
    },
    _stripBaseURI: function (uri) {
        
        return uri.replace(this._baseURI,'');
    }
});





/**
 *  KSParamNode (KitScript Request Parameter Node Definition)
 */
var KSParamNode = {
    key: '',
    val: null
};





/**
 *  KSRequest (KitScript Request Class)
 */
var KSRequest = Class.create(_Utils, {
    
    initialize: function ($super) {
        
        $super();
        
        this._u = undefined;
        this._isURIParsed = false;
        
        this._ln = 0;
        this._ph = 0;
        this._pq = 0;
        
        this._page = '';
        this._hash = '';
        this._qs = '';
        this._params = [];
        
        this._h='#';
        this._q='?';
        this._a='&';
        this._e='=';
    },
    tokenizeURI: function () {
        
        this._houseVars();
    },
    _loadURI: function () {
        this._u = document.location.href;
    },
    _houseVars: function () {
        
        this._loadURI();
        
        this._ln = this._u.length;
        this._ph = this._u.indexOf(this._h);
        this._pq = this._u.indexOf(this._q);
        
        this._page = this._u.substr(0,(this._ph>=0?this._ph-1:(this._pq>=0?this._pq-1:this._u.length-1)));
        
        if (this.hasHash())
            this._hash = this._u.substr(this._ph+1,(this._pq>=0?this._pq-this._ph-1:this._ln-this._ph-1));
        
        if (this.hasQueryString()) {
            this._qs = this._u.substr(this._getPos(this._q));;
            this._houseParams();
        }
        
        this._isURIParsed = true;
    },
    _houseParams: function () {
        // _s : uri string, _ba : begin at, _ne : next equal sign, _na : next ampersand sign
        var _s=this._u, _ba=this._pq+1, _ne=_s.indexOf(this._e,_ba), _na=_s.indexOf(this._a,_ne);
        
        _ne=(_ne===-1?_s.length:_ne);
        _na=(_na===-1?_s.length:_na);
        
        for (var i=_ba;i<_s.length; i+=_ba) {
            
            var _k=_s.substr(_ba,_ne-_ba);
            var _v=_s.substr(_ne+1,_na-_ne);
            
            var _param = Object.create(KSParamNode);
            
            _param.key = _k;
            _param.val = _v;
            
            this._params.push(_param);
            
            _ba=_na+1, _ne=_s.indexOf(this._e,_ba), _na=_s.indexOf(this._a,_ne);
        }
    },
    isReady: function () {
        return this._isURIParsed;
    },
    expirate: function () {
        this._isURIParsed = false;
    },
    dispatch: function () {
        
        this.tokenizeURI();
        
        while (this.isReady()===false) {;}
        
        if (this.isReady()===true) {
            
            if (ks.routes.count()>0) {
                
                var _rte = ks.routes.getRouteByMatch(this._u);
                
                if (typeof _rte.callback === 'function')
                    _rte.callback(this);
                else
                    this._a('Warning! [KSRequest.dispatch] _rte.callback is not a function: '+(typeof _rte.callback)+'.');
            } else
                throw new Error('There\'s no registered routes.');
        }
        this.expirate();
    },
    
    _hasLoc: function (search,startPos) {
        
        var _sp=startPos||0;
        return (this._getPos(search,_sp)>=0);
    },
    _getPos: function (str,startAt) {
        var _sa=startAt||0;
        return this._u.indexOf(str,_sa);
    },
    getPage: function () {
        return this._page;
    },
    getHash: function () {
        return this._hash;
    },
    hasParam: function (key) {
        
        for (var i=0;i<this._params.length;i++) {
            if (this._params[i].key===key)
                return true;
        }
        return false;
    },
    getParamVal: function (key) {
        for (var _i=0; _i<this._params.length; _i++) {
            if (this._params[_i].key===key)
                return this._params[_i].val;
        }
    },
    getParamByIndex: function (idx) {
        return this._params[idx];
    },
    getParams: function () {
        return this._params;
    },
    getParamsCount: function () {
        return this._params.length;
    },
    getParamsKeys: function () {
        var _keys = [];
        for (var i=0;i<this._params.length; i++) {
            _keys.push(this._params[i].key);
        }
        return _keys;
    },
    getURI: function () {
        return this._u;
    },
    getQueryString: function () {
        return this._qs;
    },
    getURILength: function () {
        return this._ln;
    },
    hasHash: function () {
        return (this._ph>=0);
    },
    hasQueryString: function () {
        return (this._pq>=0);
    },
    test: function () {
        
        alert('[getPage]:'+this.getPage()+"\n"+
                '[getHash]:'+this.getHash()+"\n"+
                '[hasParam]:'+this.hasParam(_k1)+"\n"+
                '[getParamVal]:'+this.getParamVal(_k1)+"\n"+
                '[getParamsCount]:'+this.getParamsCount()+"\n"+
                '[getURI]:'+this.getURI()+"\n"+
                '[getQueryString]:'+this.getQueryString()+"\n"+
                '[getURILength]:'+this.getURILength()+"\n"+
                '[hasHash]:'+this.hasHash()+"\n"+
                '[hasQueryString]:'+this.hasQueryString()+"\n");
        
        var _m1=this.getParamByIndex(0);
        alert('[getParamByIndex]: [key]:'+_m1.key+' [val]:'+_m1.val+"\n");
        
        var _m2=this.getParams(),_s2='';
        for (var i2=0;i2<_m2.length;i2++) {_s2+='['+_m2[i2].key+']:'+_m2[i2].val+','}
        alert('[getParams]:'+_s2+"\n");
        
        var _m3=this.getParamsKeys(),_s3='';
        for (var i3=0;i3<_m3.length;i3++) {_s3+=_m3[i3]+','}
        alert('[getParamsKeys]:'+_s3+"\n");
        
    }
});





/**
 *  KSBaseController (KitScript Base Controller Class)
 */
var KSBaseController = Class.create({
    
    initialize: function () {
        
    }
});





/**
 *  KSEventException (KitScript Event Exception Class)
 */
var KSEventException = Class.create({
    
    initialize: function (message) {
        
        this.message = message;
    }
});





/**
 *  KSEventNode (KitScript Event Node Definition)
 */
var KSEventNode = {
    id: undefined,
    command: undefined,
    eventObj: null,
    callback: undefined
};





/**
 *  KSTriggerNode (KitScript Trigger Node Definition)
 */
var KSTriggerNode = {
    id: undefined,
    count: 0,
    triggered: false,
    triggerSrc: undefined,
    callback: undefined
};





/**
 *  KSNavigateEvent (KitScript Navigate Event Class)
 */
var KSNavigateEvent = Class.create({
    
    initialize: function () {
        
        this._singleEvts = [];
        this._triggers = [];
        
        this._triggerDelay = 750;
    },
    
    setSingletonCommandEvent: function (id,command,eventObj,callback) {
        
        // Event Must Be Unique For id & command
        if (this.hasSingletonCommandEvent(id,command)===true) {
            
            var _idx = this.getSingletonCommandEventIndex(id,command);
            
            // Only Update Event Object
            this._singleEvts[_idx].eventObj = eventObj;
        } else {
            
            var _evt = Object.create(KSEventNode);
            
            _evt.id = id;
            _evt.command = command;
            _evt.eventObj = eventObj;
            _evt.callback = callback;
            
            this._singleEvts.push(_evt);
        }
        
        // Trigger Must Be Unique For id
        if (this.isTriggerRegistered(id)===false) {
            
            var _trig = Object.create(KSTriggerNode);
            
            _trig.id = id;
            _trig.callback = callback;
            
            this._triggers.push(_trig);
        }
    },
    getSingletonCommandEventsById: function (id) {
        
        var _evts = [];
        
        for (var i=0; i<this._singleEvts.length; i++) {
            
            if (this._singleEvts[i].id===id)
                _evts.push(this._singleEvts[i]);
        }
        
        return _evts;
    },
    hasSingletonCommandEvent: function (id,command) {
        
        for (var i=0; i<this._singleEvts.length; i++) {
            
            if (this._singleEvts[i].id===id&&this._singleEvts[i].command===command)
                return true;
        }
        return false;
    },
    getSingletonCommandEvent: function (id,command) {
        
        for (var i=0; i<this._singleEvts.length; i++) {
            
            if (this._singleEvts[i].id===id&&this._singleEvts[i].command===command)
                return this._singleEvts[i];
        }
        return undefined;
    },
    getSingletonCommandEventIndex: function (id,command) {
        
        for (var i=0; i<this._singleEvts.length; i++) {
            
            if (this._singleEvts[i].id===id&&this._singleEvts[i].command===command)
                return i;
        }
        return 0;
    },
    
    isTriggerRegistered: function (id) {
        
        for (var i=0; i<this._triggers.length; i++) {
            
            if (this._triggers[i].id===id)
                return true;
        }
        return false;
    },
    incrementTriggerCall: function (id) {
        
        for (var i=0; i<this._triggers.length; i++) {
            
            if (this._triggers[i].id===id) {
                this._triggers[i].count++;
            }
        }
    },
    getTriggerCount: function (id) {
        
        for (var i=0; i<this._triggers.length; i++) {
            
            if (this._triggers[i].id===id)
                return this._triggers[i].count;
        }
    },
    hasTriggered: function (id) {
        
        for (var i=0; i<this._triggers.length; i++) {
            
            if (this._triggers[i].id===id)
                return this._triggers[i].triggered;
        }
    },
    getTriggerSrc: function (id) {
        
        for (var i=0; i<this._triggers.length; i++) {
            
            if (this._triggers[i].id===id) {
                return this._triggers[i].triggerSrc;
            }
        }
    },
    resetTrigger: function (id,command) {
        
        for (var i=0; i<this._triggers.length; i++) {
            
            if (this._triggers[i].id===id&&this._triggers[i].triggerSrc===command) {
                this._triggers[i].count = 0;
                this._triggers[i].triggered = false;
                this._triggers[i].triggerSrc = undefined;
                break;
            }
        }
    },
    trigger: function (id,command) {
        
        for (var i=0; i<this._triggers.length; i++) {
            
            if (this._triggers[i].id===id) {
                
                var _evts = this.getSingletonCommandEventsById(id);
                
                var _fn = this._triggers[i].callback;
                
                window.setTimeout(_fn,this._triggerDelay,_evts);
                
                this._triggers[i].triggered = true;
                this._triggers[i].triggerSrc = command;
                break;
            }
        }
    },
    
    registerSingletonEvent: function (id,command,eventObj,callback) {
        
        if (eventObj!==undefined)
            this.setSingletonCommandEvent(id,command,eventObj,callback);
            
        // Attempt Trigger Reset
        if (this.hasTriggered(id)===true)
            this.resetTrigger(id,command);
    },
    triggerSingletonCallback: function (id,command) {
        
        this.incrementTriggerCall(id);
        
        if (this.hasTriggered(id)===false)
            this.trigger(id,command);
    }
});





/**
 *  KSUserScriptHistory (KitScript User Script URL Navigation History Class)
 */
var KSUserScriptHistory = Class.create(_Utils, {
    
    initialize: function ($super) {
        
        $super();
        
        this._urls = [];
        this._maxTotal = 25;
        this._setAttempts = 0;
        this._totalAttempts = 0;
    },
    setURL: function (url) {
        
        if (ks.loader.isUserScript(url)) {
            this._l('User Script History ['+this.getSuccessIndex()+']: '+url);
            this._urls.push(url);
        }
        
        if (this._urls.length>=this._maxTotal) {
            this._urls.shift();
            this._setAttempts--;
        }
    },
    getLast: function () {
        return this._urls[this._urls.length-1];
    },
    isListed: function (url) {
        
        for (var i=this._urls.length-1; i>=0; i--) {
            
            if (this._urls[i]===url) return true;
        }
        return false;
    },
    getCount: function () {
        return this._urls.length;
    },
    attemptInsert: function (url) {
        
        this._setAttemps++;
        this._totalAttempts++;
        
        if (url!==undefined && url!==this.getLast()) {
            this.setURL(url);
            return true;
        }
        return false;
    },
    getSuccessIndex: function () {
        return ((this._setAttempts-this._urls.length)/this._totalAttempts*100).toFixed(2)+'%';
    }
});





/**
 *  KitScript Class
 */
var KitScript = Class.create(_Utils, {
    
    initialize: function ($super) {
        
        $super();
        
        this._version = "0.2";
        
        this._isEnabled = true;
        
        Object.getPrototypeOf(this).userScriptHistory = new KSUserScriptHistory();
        Object.getPrototypeOf(this).navigateEvent = new KSNavigateEvent();
        
        Object.getPrototypeOf(this).routes = new KSRoutes(safari.extension.baseURI+'markups/');
        
        Object.getPrototypeOf(this).gmmd = new KSGreasemonkeyMetadata();
        
        Object.getPrototypeOf(this).mainContainer = new KSMainContainer();
        Object.getPrototypeOf(this).loader = new KSLoader();
        
        this.mainContainer.contentManager = new KSContentManager();
        this.mainContainer.globalSettingsForm = new KSGlobalSettingsForm();
        this.mainContainer.userScriptsManagerForm = new KSUserScriptsManagerForm();
        this.mainContainer.newUserScriptForm = new KSNewUserScriptForm();
        this.mainContainer.userScriptSettingsForm = new KSUserScriptSettingsForm();
        this.mainContainer.aboutProjectForm = new KSAboutProjectForm();
        
        Object.getPrototypeOf(this).request = new KSRequest();
    },
    getVersion: function () {
        
        return this._version;
    },
    
    toggleEnable: function () {
        
        if (this.isEnabled() === true)
            this.setDisabled();
        else
            this.setEnabled();
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
        
        ks.loader.load();
        
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
        delete transact.objInstance;
        
        ks.loader.dumpData();
        //safari.extension.removeContentScripts();
        ks.loader.disintegrate();
        
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
        delete transact.objInstance;
        
        if (resultSet.rows.length > 0) {
            
            var _row = resultSet.rows.item(0);
            
            if (parseInt(_row['enabled']) == 1) {
                
                _this._isEnabled = true;
                
                _this.$('#toggle-enable-dropdown').text("KitScript is Enabled!");
                ks.loader.load();
            } else {
                
                _this._isEnabled = false;
                
                _this.$('#toggle-enable-dropdown').text("KitScript is Disabled!");
            }
        }
    }
});





/**
 *  ====================================
 *  KSEXFH_* (KitScript Extra Functions)
 *  ====================================
 */
function KSEXF_installUserScriptByURL(events) {
    
    var _evt, _url, _tab;
    
    if (events.length>0)
        _url=events[0].eventObj.target.url;
    
    for (var i=0; i<events.length; i++) {
        _evt = events[i].eventObj;
        _url = _url || _evt.url || _evt.target.url;
        if (typeof _url === 'string') break;
    }
    
    if (_url===undefined)
        // Must Be A Way To Reload Target
        //ks.mainContainer.reloadTarget(_tab);
        ks._l('Warning! URL is undefined.');
    else {
        if (ks.loader.isValidScheme(_url) === true) {
            
            if (ks.loader.isUserScript(_url)) {
                
                if (ks.mainContainer.isTabOpen() === false)
                    ks.mainContainer.openTab();
                
                var _page = ks.mainContainer.defaultPage+'#'+KSNewUserScriptForm.id+'?_loaduserscriptfromurl='+_url;
                
                ks.mainContainer.setTabPage(_page);
            }
        }
    }
}

function KSEXF_registerNavigation(event) {
    
    if (event.type==='navigate' || event.type==='beforeNavigate')
        var _url = event.url || event.target.url || event.currentTarget.url;
    
    // Attempt Reload Evented Page If undefined
    //if (ks.userScriptHistory.attemptInsert(_url)===false)
    //    throw new Error('Target Reload Attempt Failed: [event.type]:'+event.type+' [url]:'+_url);
    ks.userScriptHistory.attemptInsert(_url);
}





/**
 *  =======================================================
 *  KSSEFH_* (KitScript Safari Extension Function Handlers)
 *  =======================================================
 */

function KSSEFH_CloseTabHandler(event) {

     ks.mainContainer.setTabClosed();
 }

function KSSEFH_ValidateHandler(event) {
    
    switch (event.command) {
        
        case "open_tab":
        //
        break;
    }
}

function KSSEFH_MenuHandler(event) {
    
    // Get Running Scripts And Add Them Dynamicaly On The Menu
    //ks.loader.getRunningScripts();
}

function KSSEFH_CommandHandler(event) {
    
    switch (event.command)
    {
        case "open_tab":
        case 'KS_TI1':
            if (ks.mainContainer.isTabOpen() === false)
                ks.mainContainer.openTab();
            
            ks.mainContainer.setTabPage(ks.mainContainer.defaultPage);
            break;
        case "toggle_enable":
        case 'KS_MI1':
            //ks.toggleEnable();
            break;
        case "open_nus":
        case 'KS_MI3':
            if (ks.mainContainer.isTabOpen() === false)
                ks.mainContainer.openTab();
            
            ks.mainContainer.setTabPage(ks.mainContainer.defaultPage+'#'+KSNewUserScriptForm.id);
            break;
        case "open_mus":
        case 'KS_MI4':
            if (ks.mainContainer.isTabOpen() === false)
                ks.mainContainer.openTab();
            
            ks.mainContainer.setTabPage(ks.mainContainer.defaultPage+'#'+KSUserScriptsManagerForm.id);
            break;
        case "open_gs":
        case 'KS_MI5':
            if (ks.mainContainer.isTabOpen() === false)
                ks.mainContainer.openTab();
            
            ks.mainContainer.setTabPage(ks.mainContainer.defaultPage+'#'+KSGlobalSettingsForm.id);
            break;
    }
}

function KSSEFH_BeforeNavigateHandler(event) {
    
    var _command = 'beforeNavigate';
    
    ks.navigateEvent.registerSingletonEvent('installUserScript',_command,event,KSEXF_installUserScriptByURL);
    
    ks.navigateEvent.triggerSingletonCallback('installUserScript',_command);
}

function KSSEFH_NavigateHandler(event) {
    
    var _command = 'navigate';
    
    ks.navigateEvent.registerSingletonEvent('installUserScript',_command,event,KSEXF_installUserScriptByURL);
    
    ks.navigateEvent.triggerSingletonCallback('installUserScript',_command);
}

function KSSEFH_ProxyMessage(event) {
    
    
}


// For User Script Load History
//safari.application.addEventListener('beforeNavigate',KSEXF_registerNavigation, false)
//safari.application.addEventListener('navigate',KSEXF_registerNavigation, false);

