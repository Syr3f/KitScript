/**
 *  KitScript - A User Script Manager For Safari
 *
 *  KitScriptStorage.js - Javascript file containing the main storage class
 *  (by Prototype.js) used globally in the extension.
 *
 *  @author Seraf Dos Santos <webmaster@cyb3r.ca>
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */

//"use strict";




/**
*  KSStorage (KitScript Storage Class)
*/
var KSStorage = Class.create(Storage, {
    
    initialize: function ($super) {
        
        this._dbName = 'KitScript';
        this._dbVersion = '1.0';
        this._dbDisplayName = 'KitScript Database';
        this._dbSize = 10 * 1024 * 1024; // 10 MB in bytes
        
        $super(this._dbName, this._dbVersion, this._dbDisplayName, this._dbSize);
        
        this._isDbExistant = false;
        
        this._dbTableUserScriptFiles = "UserScriptFiles";
        this._dbTableUserScriptsMetadata = "UserScriptsMetadata";
        this._dbTableGlobalExcludes = "GlobalExcludes";
        this._dbTableKitScript = "KitScript";
    },
    connect: function ($super) {
        
        try {
            
            _db = $super();
        } catch (e) {
            
            throw new StorageException(e.getMessage());
        }
        
        //this.verifyDb();
        
        return _db;
    },
    isDbExistant: function () {
        
        return this._isDbExistant;
    },
    verifyDb: function () {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT enabled FROM "+this._dbTableKitScript+";", [], this._dbq_onQueryAnyTable, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    _dbq_onQueryAnyTable: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        
        if (resultSet.rows.length > 0)
            _this._isDbExistant = true;
        else {
            _this.createTables();
            _this.insertInitData();
        }
            
    },
    createTables: function (doDrop) {
        
        if (doDrop === true) {
            
            var _sC = function () { console.log("Table dropped."); };
            
            sqlArray = new SQLStatementsArray();
            
            sqlArray.push(this, 'DROP TABLE '+this._dbTableUserScriptFiles+';', [], _sC, SFH_errorHandler);
            sqlArray.push(this, 'DROP TABLE '+this._dbTableUserScriptsMetadata+';', [], _sC, SFH_errorHandler);
            sqlArray.push(this, 'DROP TABLE '+this._dbTableGlobalExcludes+';', [], _sC, SFH_errorHandler);
            sqlArray.push(this, 'DROP TABLE '+this._dbTableKitScript+';', [], _sC, SFH_errorHandler);
            
            this.transact(sqlArray);
        }
        
        _sC1 = function () { console.log("Table created."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS '+this._dbTableUserScriptFiles+' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, userscript BLOB NOT NULL);', [], _sC1, SFH_errorHandler);
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS '+this._dbTableUserScriptsMetadata+' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, namespace TEXT NOT NULL, description TEXT NOT NULL, includes TEXT NOT NULL, excludes TEXT NOT NULL, userscript_id INT NOT NULL, disabled INT NOT NULL DEFAULT 0, user_includes TEXT NULL, user_excludes TEXT NULL);', [], _sC1, SFH_errorHandler);
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS '+this._dbTableGlobalExcludes+' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL);', [], _sC1, SFH_errorHandler);
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS '+this._dbTableKitScript+' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, enabled INT NOT NULL DEFAULT 1);', [], _sC1, SFH_errorHandler);
        
        this.transact(sqlArray);
        
        this._isDbExistant = true;
    },
    insertInitData:function () {
        
        _sC2 = function () { console.log("Data inserted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "INSERT INTO "+this._dbTableKitScript+" (enabled) VALUES (1);", [], _sC2, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    /**
     *  ================
     *  User Script File
     *  ================
     */
    insertUserScriptFile: function (blob, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script inserted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "INSERT INTO "+this._dbTableUserScriptFiles+" (userscript) VALUES (?);", [blob], _sC, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    updateUserScriptFile: function (id, blob, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script updated."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableUserScriptFiles+" SET userscript = ? WHERE id = ?;", [blob, id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    fetchUserScriptFile: function (id, statementCallback, obj) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT * FROM "+this._dbTableUserScriptFiles+" WHERE id = ?;", [id], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    deleteUserScriptFile: function (id, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script deleted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "DELETE FROM "+this._dbTableUserScriptFiles+" WHERE id = ?;", [id], _sC, SFH_killTransaction);
        
        this.transact(sqlArray);
    },
    /**
     *  ====================
     *  User Script Metadata
     *  ====================
     */
    insertUserScriptMetadata: function (name, space, desc, includes, excludes, usid, disabled, user_includes, user_excludes, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script metadata inserted.") };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "INSERT INTO "+this._dbTableUserScriptsMetadata+" (name, namespace, description, includes, excludes, userscript_id, disabled, user_includes, user_excludes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);", [name, space, desc, includes, excludes, usid, disabled, user_includes, user_excludes], _sC, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    updateUserScriptMetadata: function (id, name, space, desc, includes, excludes, disabled, user_includes, user_excludes, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script metadata updated."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableUserScriptsMetadata+" SET name = ?, namespace = ?, description = ?, includes = ?, excludes = ?, disabled = ?, user_includes = ?, user_excludes = ? WHERE id = ?;", [name, space, desc, includes, excludes, disabled, user_includes, user_excludes, id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    fetchUserScriptMetadata: function (id, statementCallback, obj) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT * FROM "+this._dbTableUserScriptsMetadata+" WHERE id = ?;", [id], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    fetchAllUserScriptsMetadata: function (offset, limit, statementCallback, obj) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT * FROM "+this._dbTableUserScriptsMetadata+" LIMIT ?, ?;", [offset, limit], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    deleteUserScriptMetadata: function (id, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script metadata deleted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "DELETE FROM "+this._dbTableUserScriptsMetadata+" WHERE id = ?;", [id], _sC, SFH_killTransaction);
        
        this.transact(sqlArray);
    },
    updateUserScriptUserSettings: function (id, user_includes, user_excludes, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script (user settings) updated."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableUserScriptsMetadata+" SET user_includes = ?, user_excludes = ? WHERE id = ?;", [user_includes, user_excludes, id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    disableUserScript: function (id, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script disabled."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableUserScriptsMetadata+" SET disabled = 1 WHERE id = ?;", [id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    enableUserScript: function (id, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script enabled."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableUserScriptsMetadata+" SET disabled = 0 WHERE id = ?;", [id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    /**
     *  ==============
     *  Global Exclude
     *  ==============
     */
    insertGlobalExclude: function (url, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("Global exclude inserted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "INSERT INTO "+this._dbTableGlobalExcludes+" (url) VALUES (?);", [url], _sC, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    updateGlobalExclude: function (id, url, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("Data updated."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableGlobalExcludes+" SET url = ? WHERE id = ?;", [url, id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    fetchGlobalExclude: function (id, statementCallback, obj) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT * FROM "+this._dbTableGlobalExcludes+" WHERE id = ?;", [id], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    fetchAllGlobalExcludes: function (offset, limit, statementCallback, obj) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT * FROM "+this._dbTableGlobalExcludes+" LIMIT ?, ?;", [offset, limit], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    deleteGlobalExclude: function (id, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("Data deleted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "DELETE FROM "+this._dbTableGlobalExcludes+" WHERE id = ?;", [id], _sC, SFH_killTransaction);
        
        this.transact(sqlArray);
    },
    /**
     *  ========================
     *  Enable/Disable KitScript
     *  ========================
     */
    isKitScriptEnabled: function (statementCallback, obj) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT enabled FROM "+this._dbTableKitScript+" WHERE id = 1;", [], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    setKitScriptEnabled: function (statementCallback, obj) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableKitScript+" SET enabled = 1 WHERE id = 1;", [], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray);
    },
    setKitScriptDisabled: function (statementCallback, obj) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableKitScript+" SET enabled = 0 WHERE id = 1;", [], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray);
    }
});





/**
 *  ============================================
 *  KSSHF_* (KitScript Storage Helper Functions)
 *  ============================================
 */

function KSSHF_blobize(str) {
    
    var _blob = "";
    
    /*
    for (var i=0; i<str.length; i++) {
        
        var _uc = str.charCodeAt(i).toString(16).toUpperCase();
        
        while (_uc.length < 4) {
            _uc = '0'+_uc;
        }
        
        _blob = _blob.concat('0x',_uc);
    }
    */
    
    _blob = encode64(str);
    
    return _blob;
}

function KSSHF_unblobize(blob) {
    
    var _str;
    
    /*
    for (var i=0; i<blob.length; i+=6) {
        
        var _uc = blob.substr(0+i,6);
        
        _str = _str.concat(String.fromCharCode(_uc));
    }
    */
    
    _str = decode64(blob);
    
    return _str;
}