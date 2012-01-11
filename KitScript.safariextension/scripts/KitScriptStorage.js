/**
 *  KitScript - A User Script Safari Extension
 *
 *  KitScriptStorage.js - Javascript file containing the main storage class
 *  (by Prototype.js) used globally in the extension.
 *
 *  @author Seraf Dos Santos
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */





/**
*  KSStorage (KitScript Storage Class)
*/
var KSStorage = Class.create(Storage, {
    
    initialize: function ($super) {
        
        this._dbName = 'KitScript';
        this._dbVersion = '1.0';
        this._dbDisplayName = 'KitScript';
        this._dbSize = 10 * 1024 * 1024; // 10 MB in bytes
        
        this._isDbExistant = false;
        
        $super(this._dbName, this._dbVersion, this._dbDisplayName, this._dbSize);
        
        this._dbTableUserScripts = "UserScripts";
        this._dbTableGlobalExcludes = "GlobalExcludes";
        this._dbTableKitScript = "KitScript";
    },
    connect: function ($super) {
        
        try {
            
            _db = $super();
        } catch (e) {
            
            console.log(e.getMessage());
        }
        
        this._verifyDb();
        
        return _db;
    },
    isDbExistant: function () {
        
        return this._isDbExistant;
    },
    _verifyDb: function () {
        
        _fH = function (transaction, resultSet) {
            
            var _db = transaction.objInstance;
            
            if (resultSet.rows.length > 0) {
                
                var _row = resultSet.rows.item(0);
                
                if (_row['name'] == _db._dbTableUserScripts) {
                    
                    _db._isDbExistant = true;
                } else {
                    
                    //_db.createTables();
                    
                    _db._isDbExistant = false;
                }
            }
        }
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT name FROM sqlite_master WHERE type=? AND name=?;", ['table',this._dbTableUserScripts], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    createTables: function (doDrop) {
        
        if (doDrop === true) {
            
            _fH = function () { console.log("Table dropped."); };
            
            sqlArray = new SQLStatementsArray();
            
            sqlArray.push(this, 'DROP TABLE UserScripts;', [], _fH, _errorHandler);
            sqlArray.push(this, 'DROP TABLE GlobalExcludes;', [], _fH, _errorHandler);
            sqlArray.push(this, 'DROP TABLE KitScript;', [], _fH, _errorHandler);
            
            this.transact(sqlArray);
        }
        
        _fH1 = function () { console.log("Table created."); };
        _fH2 = function () { console.log("Data inserted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS UserScripts (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL, whitelist TEXT NOT NULL, blacklist TEXT NOT NULL, script TEXT NOT NULL, disabled INT NOT NULL DEFAULT 0);', [], _fH1, _errorHandler);
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS GlobalExcludes (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL);', [], _fH1, _errorHandler);
        sqlArray.push(this, 'CREATE TABLE IF NOT EXISTS KitScript (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, enabled INT NOT NULL DEFAULT 1);', [], _fH1, _errorHandler);
        sqlArray.push(this, "INSERT INTO KitScript (enabled) VALUES (1);", [], _fH2, _errorHandler);
        
        this.transact(sqlArray);
    },
    insertUserScript: function (name, desc, includes, excludes, code, disabled) {
        
        _fH = function () { console.log("Data inserted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "INSERT INTO "+this._dbTableUserScripts+" (name, description, whitelist, blacklist, script, disabled) VALUES (?, ?, ?, ?, ?, ?);", [name, desc, includes, excludes, code, disabled], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    updateUserScript: function (id, name, desc, includes, excludes, code, disabled) {
        
        _fH = function () { console.log("Data updated."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "UPDATE "+this._dbTableUserScripts+" SET name = ?, description = ?, whitelist = ?, blacklist = ?, script = ?, disabled = ? WHERE id = ?;", [name, desc, includes, excludes, code, disabled, id], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetchUserScript: function (id, fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT * FROM "+this._dbTableUserScripts+" WHERE id = ?;", [id], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetchAllUserScripts: function (offset, limit, fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT * FROM "+this._dbTableUserScripts+" LIMIT ?, ?;", [offset, limit], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    removeUserScript: function (id) {
        
        _fH = function () { console.log("Data deleted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "DELETE FROM "+this._dbTableUserScripts+" WHERE id = ?;", [id], _fH, _killTransaction);
        
        this.transact(sqlArray);
    },
    disableUserScript: function (id) {
        
        _fH = function () { console.log("Script disabled."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "UPDATE "+this._dbTableUserScripts+" SET disabled = 1 WHERE id = ?;", [id], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    insertGlobalExclude: function (url) {
        
        _fH = function () { console.log("Data inserted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "INSERT INTO "+this._dbTableGlobalExcludes+" (url) VALUES (?);", [url], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    updateGlobalExclude: function (id, url) {
        
        _fH = function () { console.log("Data updated."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "UPDATE "+this._dbTableGlobalExcludes+" SET url = ? WHERE id = ?;", [url, id], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetchGlobalExclude: function (id, fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT * FROM "+this._dbTableGlobalExcludes+" WHERE id = ?;", [id], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetchAllGlobalExcludes: function (offset, limit, fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "SELECT * FROM "+this._dbTableGlobalExcludes+" LIMIT ?, ?;", [offset, limit], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    removeGlobalExclude: function (id) {
        
        _fH = function () { console.log("Data deleted."); };
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "DELETE FROM "+this._dbTableGlobalExcludes+" WHERE id = ?;", [id], _fH, _killTransaction);
        
        this.transact(sqlArray);
    },
    isKitScriptEnabled: function (obj, _fetchCallback) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(obj, "SELECT enabled FROM "+this._dbTableKitScript+" WHERE id = 1;", [], _fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    setKitScriptEnabled: function (_fH) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "UPDATE "+this._dbTableKitScript+" SET enabled = 1 WHERE id = 1;", [], _fH, _errorHandler);
        
        this.transact(sqlArray);
    },
    setKitScriptDisabled: function (_fH) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push(this, "UPDATE "+this._dbTableKitScript+" SET enabled = 0 WHERE id = 1;", [], _fH, _errorHandler);
        
        this.transact(sqlArray);
    }
});
