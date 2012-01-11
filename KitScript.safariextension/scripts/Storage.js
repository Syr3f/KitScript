/**
 *  KitScript - A User Script Safari Extension
 *
 *  Storage.js - Javascript file containing storage classes (by Prototype.js)
 *  used globally in the extension.
 *
 *  @author Seraf Dos Santos <webmaster@cyb3r.ca>
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */





var SQLStatementsArray = Class.create(_Utils, {
    
    initialize: function () {
        
        this._sqlStmntsArray = new Array();
    },
    push: function (storageInstance, sql, arguments, statementCallback, errorCallback) {
        
        this._sqlStmntsArray.push(new Array(storageInstance, sql, (arguments.length > 0 ? arguments : null), statementCallback, errorCallback));
    },
    getArray: function () {
        
        return this._sqlStmntsArray;
    },
    getStatementByIndex: function (index) {
        
        return this._sqlStmntsArray[index];
    }
});






var StorageException = Class.create({
    
    initialize: function (message) {
        
        this._message = message;
        
        this.NOT_SUPPORTED = 'NOT_SUPPORTED';
    },
    getMessage: function () {
        
        return this._message;
    }
});





var ResultSet = Class.create(_Utils, {
    
    initialize: function (resultSet) {
        
        this._resultSet = resultSet;
    },
    getLastInsertId: function () {

        if (this._resultSet != null) {

            return this._resultSet.insertId;
        }
    },
    getRowCount: function () {

        if (this._resultSet != null) {

            return this._resultSet.rows.length;
        }
        
        return null;
    },
    getRow: function (index) {

        if (this.getRowCount() > 0) {
            
            return this._resultSet.rows.item(index);
        }
        
        return null;
    }
});





var Storage = Class.create(_Utils, {
    
    initialize: function (dbName, dbVersion, dbDisplayName, dbSize) {
        
        this._lastResultSet = null;
        this._isSuccess = false;
        
        this._DB = null;
        
        this._dbName = dbName;
        this._dbVersion = dbVersion;
        this._dbDisplayName = dbDisplayName;
        this._dbSize = dbSize;
        
        this._isConnected = false;
    },
    connect: function () {
        
        try {
            
            if (!window.openDatabase) {
                
                throw StorageException.NOT_SUPPORTED;
            } else {
                
                this._DB = window.openDatabase(this._dbName, this._dbVersion, this._dbDisplayName, this._dbSize);
                
                this._isConnected = true;
            }
        } catch(e) {
            
            switch (e) {
                case INVALID_STATE_ERR:
                    throw new StorageException('Invalid database version.');
                    break;
                case NOT_SUPPORTED:
                    throw new StorageException('openDatabase not supported');
                    break;
                default:
                    throw new StorageException('Unknown error '+e+'.');
            }
        }
        
        return true;
    },
    getConn: function () {
        
        return this._DB;
    },
    isConnected: function () {
        
        return this._isConnected;
    },
    transact: function (sqlStmntsArray) {
        
        var _sqls = sqlStmntsArray.getArray();
        
        this.setSuccess(false);
        
        this._DB.transaction(function (transaction) {
            
            eval("transaction.__proto__.objInstance = _sqls[0][0]");
            
            var _js = "";
            
            for (var i = 0; i < _sqls.length; i++) {
                
                _js += "transaction.executeSql('"+_sqls[i][1]+"', "+(_sqls[i][2] === null ? null : "new Array('"+_sqls[i][2].join("','")+"')")+", "+_sqls[i][3]+', '+_sqls[i][4]+');';
            }
            
            this.log(_js);
            
            eval(_js);
        });
    },
    getSuccess: function () {
        
        return this._isSuccess;
    },
    setSuccess: function (isSuccess) {
        
        this._isSuccess = isSuccess;
    },
    setResultSet: function (resultSet) {
        
        this._lastResultSet = new ResultSet(resultSet);
    },
    getResultSet: function () {
        
        return this._lastResultSet;
    },
    getLastInsertRowId: function (aliasName, statementCallback, obj) {
        
        sqlArray = new SQLStatementsArray();
        
        sqlArray.push((obj===null?this:obj), "SELECT last_insert_rowid() AS "+aliasName+";", [], statementCallback, KSSFH_errorHandler);
        
        this.transact(sqlArray);
    }
});




/*
function _statementCallback(transaction, resultSet) {
    
    var _db = transaction.objInstance;
    
    _db.setResultSet(resultSet);
    
    if (resultSet.rows.length > 0)
        _db.setSuccess(true);
}

function _nullHandler() {
    
}

function _successHandler() {
    
    console.log('Successful statement!');
}
*/

function KSSFH_errorHandler(transaction, error) {
    
    var _db = transaction.objInstance;
    
    _db.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
    
    _db.setSuccess(false);
}

/*
function _killTransaction(transaction, error) {
    
    return true;
}
*/
