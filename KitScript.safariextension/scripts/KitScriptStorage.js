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
        
        this._dbTableRequireFiles = "RequireFiles";
        this._dbTableUserScriptFiles = "UserScriptFiles";
        this._dbTableUserScriptsMetadata = "UserScriptsMetadata";
        this._dbTableGlobalExcludes = "GlobalExcludes";
        this._dbTableKitScript = "KitScript";
    },
    connect: function ($super) {
        
        try {
            
            $super();
        } catch (e) {
            throw new StorageException(e.getMessage());
        }
        
        this.verifyDb();
    },
    isDbExistant: function () {
        
        return this._isDbExistant;
    },
    verifyDb: function () {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT enabled FROM "+this._dbTableKitScript+";", [], this._dbq_onQueryAnyTable, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    _dbq_onQueryAnyTable: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        if (resultSet.rows.length > 0)
            _this._isDbExistant = true;
    },
    createTables: function (doDrop) {
        
        var sqlArray = new SQLStatementsArray();
        
        if (doDrop === true) {
            
            sqlArray.push(this, 'DROP TABLE '+this._dbTableRequireFiles+';', [], _sC, SFH_errorHandler);
            sqlArray.push(this, 'DROP TABLE '+this._dbTableUserScriptFiles+';', [], _sC, SFH_errorHandler);
            sqlArray.push(this, 'DROP TABLE '+this._dbTableUserScriptsMetadata+';', [], _sC, SFH_errorHandler);
            sqlArray.push(this, 'DROP TABLE '+this._dbTableGlobalExcludes+';', [], _sC, SFH_errorHandler);
            sqlArray.push(this, 'DROP TABLE '+this._dbTableKitScript+';', [], _sC, SFH_errorHandler);
        }
        
        _sC1 = function () { console.log("Table created."); };
        
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS '+this._dbTableRequireFiles+' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, userscript_id INTEGER NOT NULL, file BLOB NOT NULL);', [], _sC1, SFH_errorHandler);
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS '+this._dbTableUserScriptFiles+' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, userscript BLOB NOT NULL);', [], _sC1, SFH_errorHandler);
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS '+this._dbTableUserScriptsMetadata+' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, hash TEXT NOT NULL, name TEXT NOT NULL, namespace TEXT NOT NULL, description TEXT NOT NULL, includes TEXT NOT NULL, excludes TEXT NULL, requires TEST NULL, userscript_id INT NOT NULL, disabled INT NOT NULL DEFAULT 0, user_includes TEXT NULL, user_excludes TEXT NULL, run_at TEXT NOT NULL);', [], _sC1, SFH_errorHandler);
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS '+this._dbTableGlobalExcludes+' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL);', [], _sC1, SFH_errorHandler);
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS '+this._dbTableKitScript+' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, enabled INT NOT NULL DEFAULT 1);', [], this._dbq_onCreateKitScriptTable, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
        
        this._isDbExistant = true;
    },
    _dbq_onCreateKitScriptTable:function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push(_this, "SELECT enabled FROM "+_this._dbTableKitScript+";", [], _this._dbq_onQueryTableExists, SFH_errorHandler);
        
        _this.transact(sqlArray, null, null);
    },
    _dbq_onQueryTableExists: function (transact, resultSet) {
        
        var _this = transact.objInstance;
        delete transact.objInstance;
        
        var _sC = function () { console.log("Data inserted."); }
        
        if (resultSet.rows.length == 0) {
            
            var sqlArray = new SQLStatementsArray();

            sqlArray.push(_this, "INSERT INTO "+_this._dbTableKitScript+" (enabled) VALUES (1);", [], _sC, SFH_errorHandler);

            _this.transact(sqlArray, null, null);
        }
    },
    /**
     *  ============
     *  Require File
     *  ============
     */
    insertRequireFile: function (usId, blob, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("Require file inserted."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "INSERT INTO "+this._dbTableRequireFiles+" (userscript_id, file) VALUES (?, ?);", [usId, blob], _sC, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
        
    },
    updateRequireFile: function (id, usId, blob, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("Require file updated."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableRequireFiles+" SET userscript_id = ?, file = ? WHERE id = ?;", [usId, blob, id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    fetchRequireFile: function (id, statementCallback, obj) {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT * FROM "+this._dbTableRequireFiles+" WHERE id = ?;", [id], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    fetchRequireFilesByUserScriptId: function (usId, statementCallback, obj) {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT * FROM "+this._dbTableRequireFiles+" WHERE userscript_id = ?;", [usId], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    deleteRequireFile: function (id, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("Require file deleted."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "DELETE FROM "+this._dbTableRequireFiles+" WHERE id = ?;", [id], _sC, SFH_killTransaction);
        
        this.transact(sqlArray, null, null);
    },
    deleteRequireFilesByUserScriptId: function (usId, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("Require file deleted."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "DELETE FROM "+this._dbTableRequireFiles+" WHERE userscript_id = ?;", [usId], _sC, SFH_killTransaction);
        
        this.transact(sqlArray, null, null);
    },
    /**
     *  ================
     *  User Script File
     *  ================
     */
    insertUserScriptFile: function (blob, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script inserted."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "INSERT INTO "+this._dbTableUserScriptFiles+" (userscript) VALUES (?);", [blob], _sC, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    updateUserScriptFile: function (id, blob, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script updated."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableUserScriptFiles+" SET userscript = ? WHERE id = ?;", [blob, id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    fetchUserScriptFile: function (id, statementCallback, obj) {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT * FROM "+this._dbTableUserScriptFiles+" WHERE id = ?;", [id], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    deleteUserScriptFile: function (id, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script deleted."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "DELETE FROM "+this._dbTableUserScriptFiles+" WHERE id = ?;", [id], _sC, SFH_killTransaction);
        
        this.transact(sqlArray, null, null);
    },
    /**
     *  ====================
     *  User Script Metadata
     *  ====================
     */
    insertUserScriptMetadata: function (hash, name, space, desc, includes, excludes, requires, usid, disabled, user_includes, user_excludes, run_at, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script metadata inserted.") };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "INSERT INTO "+this._dbTableUserScriptsMetadata+" (hash, name, namespace, description, includes, excludes, requires, userscript_id, disabled, user_includes, user_excludes, run_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [hash, name, space, desc, includes, excludes, requires, usid, disabled, user_includes, user_excludes, run_at], _sC, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    updateUserScriptMetadata: function (id, hash, name, space, desc, includes, excludes, requires, disabled, user_includes, user_excludes, run_at, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script metadata updated."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableUserScriptsMetadata+" SET hash = ?, name = ?, namespace = ?, description = ?, includes = ?, excludes = ?, requires = ?, disabled = ?, user_includes = ?, user_excludes = ?, run_at = ? WHERE id = ?;", [hash, name, space, desc, includes, excludes, requires, disabled, user_includes, user_excludes, run_at, id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
        
    },
    fetchUserScriptMetadata: function (id, statementCallback, obj) {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT * FROM "+this._dbTableUserScriptsMetadata+" WHERE id = ?;", [id], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    fetchUserScripUserSettings: function (id, statementCallback, obj) {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT user_includes, user_excludes FROM "+this._dbTableUserScriptsMetadata+" WHERE id = ?;", [id], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    fetchAllUserScriptsMetadata: function (offset, limit, statementCallback, obj) {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT * FROM "+this._dbTableUserScriptsMetadata+" LIMIT ?, ?;", [offset, limit], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    deleteUserScriptMetadata: function (id, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script metadata deleted."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "DELETE FROM "+this._dbTableUserScriptsMetadata+" WHERE id = ?;", [id], _sC, SFH_killTransaction);
        
        this.transact(sqlArray, null, null);
    },
    updateUserScriptUserSettings: function (id, user_includes, user_excludes, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script (user settings) updated."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableUserScriptsMetadata+" SET user_includes = ?, user_excludes = ? WHERE id = ?;", [user_includes, user_excludes, id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    disableUserScript: function (id, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script disabled."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableUserScriptsMetadata+" SET disabled = 1 WHERE id = ?;", [id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    enableUserScript: function (id, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("User script enabled."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableUserScriptsMetadata+" SET disabled = 0 WHERE id = ?;", [id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    isUserScriptEnabled: function (id, statementCallback, obj) {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT disabled FROM "+this._dbTableUserScriptsMetadata+" WHERE id = ?;", [id], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    /**
     *  ==========================
     *  UserScript File & Metadata
     *  ==========================
     */
     fetchUserScriptFileByMetaId: function (metaId, statementCallback, obj) {
         
         Object.getPrototypeOf(this).outerObj = obj;
         Object.getPrototypeOf(this).outerFunc = statementCallback;
         
         var sqlArray = new SQLStatementsArray();
         
         sqlArray.push(this, "SELECT userscript_id FROM "+this._dbTableUserScriptsMetadata+" WHERE id = ?;", [metaId], this._dbq_onFetchUserScriptFileId, SFH_errorHandler);
         
         this.transact(sqlArray, null, null);
     },
     _dbq_onFetchUserScriptFileId: function (transact, resultSet) {
         
         var _this = transact.objInstance;
         delete transact.objInstance;
         
         if (resultSet.rows.length > 0) {
             
             var _row = resultSet.rows.item(0);
             var _usId = _row['userscript_id'];
             
             _this.fetchUserScriptFile(_usId, _this.outerFunc, _this.outerObj);
             
             delete _this.outerFunc;
             delete _this.outerObj;
         } else {
             throw new StorageException("Couldn't get a user script id.");
         }
     },
     fetchUserScriptFileIdByMetaId: function (metaId, statementCallback, obj) {
         
          var sqlArray = new SQLStatementsArray();
          
          sqlArray.push(obj, "SELECT userscript_id FROM "+this._dbTableUserScriptsMetadata+" WHERE id = ?;", [metaId], statementCallback, SFH_errorHandler);
          
          this.transact(sqlArray, null, null);
     },
    /**
     *  ==============
     *  Global Exclude
     *  ==============
     */
    insertGlobalExclude: function (url, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("Global exclude inserted."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "INSERT INTO "+this._dbTableGlobalExcludes+" (url) VALUES (?);", [url], _sC, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    updateGlobalExclude: function (id, url, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("Data updated."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableGlobalExcludes+" SET url = ? WHERE id = ?;", [url, id], _sC, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    fetchGlobalExclude: function (id, statementCallback, obj) {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT * FROM "+this._dbTableGlobalExcludes+" WHERE id = ?;", [id], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    fetchAllGlobalExcludes: function (offset, limit, statementCallback, obj) {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT * FROM "+this._dbTableGlobalExcludes+" LIMIT ?, ?;", [offset, limit], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    deleteGlobalExclude: function (id, statementCallback, obj) {
        
        var _sC = statementCallback || function () { console.log("Data deleted."); };
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "DELETE FROM "+this._dbTableGlobalExcludes+" WHERE id = ?;", [id], _sC, SFH_killTransaction);
        
        this.transact(sqlArray, null, null);
    },
    /**
     *  ========================
     *  Enable/Disable KitScript
     *  ========================
     */
    isKitScriptEnabled: function (statementCallback, obj) {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "SELECT enabled FROM "+this._dbTableKitScript+" WHERE id = 1;", [], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    setKitScriptEnabled: function (statementCallback, obj) {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableKitScript+" SET enabled = 1 WHERE id = 1;", [], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
    },
    setKitScriptDisabled: function (statementCallback, obj) {
        
        var sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj||this), "UPDATE "+this._dbTableKitScript+" SET enabled = 0 WHERE id = 1;", [], statementCallback, SFH_errorHandler);
        
        this.transact(sqlArray, null, null);
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