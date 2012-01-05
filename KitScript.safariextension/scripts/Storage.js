
var SQLStatementArray = Class.create({
    
    initialize: function () {
        
        this._sqlArray = new Array();
    },
    push: function (sql, arguments, statementCallback, errorCallback) {
        
        this._sqlArray.push(new Array(sql, (arguments.length > 0 ? arguments : null), statementCallback, errorCallback));
    },
    getArray: function () {
        
        return this._sqlArray;
    },
    getStatementByIndex: function (index) {
        
        return this._sqlArray[index];
    }
});

var StorageException = Class.create({
    
    initialize: function (message) {
        
        this._message = message;
    },
    getMessage: function () {
        
        return this._message;
    }
});

var NOT_SUPPORTED = 'NOT_SUPPORTED';


var ResultSet = Class.create({
    
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

var Storage = Class.create({
    
    initialize: function (dbName, dbVersion, dbDisplayName, dbSize) {
        
        this._lastResultSet = null;
        this._isSuccess = false;
        
        this._DB = null;
        
        this._dbName = dbName;
        this._dbVersion = dbVersion;
        this._dbDisplayName = dbDisplayName;
        this._dbSize = dbSize;
        
        this._dbIsCreated = false;
    },
    connect: function () {
        
        try {
            
            if (!window.openDatabase) {
                
                throw NOT_SUPPORTED;
            } else {
                
                this._DB = window.openDatabase(this._dbName, this._dbVersion, this._dbDisplayName, this._dbSize);
                
                this._dbIsCreated = true;
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
    isExistant: function () {
        
        return this._dbIsCreated;
    },
    transact: function (sqlArray) {
        
        var _sqls = sqlArray.getArray();
        
        this.setSuccess(false);
        
        var _js = 'this._DB.transaction(function (transaction) {';
            
        for (var i = 0; i < _sqls.length; i++) {
            
            _js += "transaction.executeSql('"+_sqls[i][0]+"', "+(_sqls[i][1] === null ? null : "new Array('"+_sqls[i][1].join("','")+"')")+", "+_sqls[i][2]+', '+_sqls[i][3]+');';
        }
        
        _js += '});';
        
        //console.log(_js);
        
        eval(_js);
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
    }
});

var KSStorage = Class.create(Storage, {
    
    initialize: function ($super) {
        
        this._dbName = 'KitScript';
        this._dbVersion = '1.0';
        this._dbDisplayName = 'KitScript';
        this._dbSize = 10 * 1024 * 1024; // 10 MB in bytes
        
        $super(this._dbName, this._dbVersion, this._dbDisplayName, this._dbSize);
    },
    connect: function ($super) {
        
        return $super();
    },
    createTable: function (isDropAllowed) {
        
        if (isDropAllowed) {
            
            sqlArray = new SQLStatementArray();
            
            sqlArray.push('DROP TABLE UserScripts;', [], _nullHandler, _errorHandler);
            
            this.transact(sqlArray);
        }
        
        sqlArray = new SQLStatementArray();
        
        sqlArray.push('CREATE TABLE IF NOT EXISTS UserScripts (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL, whitelist TEXT NOT NULL, blacklist TEXT NOT NULL, script TEXT NOT NULL, disabled INT NOT NULL DEFAULT 0);', [], _nullHandler, _errorHandler);
        
        this.transact(sqlArray);
    },
    insert: function (name, desc, includes, excludes, code, disabled) {
        
        sqlArray = new SQLStatementArray();
        
        sqlArray.push("INSERT INTO UserScripts (name, description, whitelist, blacklist, script, disabled) VALUES (?, ?, ?, ?, ?, ?);", [name, desc, includes, excludes, code, disabled], _nullHandler, _errorHandler);
        
        this.transact(sqlArray);
    },
    update: function (id, name, desc, includes, excludes, code, disabled) {
        
        sqlArray = new SQLStatementArray();
        
        sqlArray.push("UPDATE UserScripts SET name = ?, description = ?, whitelist = ?, blacklist = ?, script = ?, disabled = ? WHERE id = ?;", [name, desc, includes, excludes, code, disabled, id], _nullHandler, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetch: function (id, fetchCallback) {
        
        sqlArray = new SQLStatementArray();
        
        sqlArray.push("SELECT * FROM UserScripts WHERE id = ?;", [id], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    fetchAll: function (offset, limit, fetchCallback) {
        
        sqlArray = new SQLStatementArray();
        
        sqlArray.push("SELECT * FROM UserScripts LIMIT ?, ?;", [offset, limit], fetchCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    remove: function (id) {
        
        sqlArray = new SQLStatementArray();
        
        sqlArray.push("DELETE FROM UserScripts WHERE id = ?;", [id], _nullHandler, _killTransaction);
        
        this.transact(sqlArray);
    },
    disableScript: function (id) {
        
        sqlArray = new SQLStatementArray();
        
        sqlArray.push("UPDATE UserScripts SET disabled = 1 WHERE id = ?;", [id], _nullHandler, _errorHandler);
        
        this.transact(sqlArray);
    }
});

db = new KSStorage();

function _statementCallback(transaction, resultSet) {
    
    db.setResultSet(resultSet);
    
    if (resultSet.rows.length > 0)
        db.setSuccess(true);
}

function _nullHandler() {
    
}

function _successHandler() {
    
    console.log('Successful statement!');
    
    db.setSuccess(true);
}

function _errorHandler(transaction, error) {
    
    console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
    
    db.setSuccess(false);
}

function _killTransaction(transaction, error) {
    
    return true;
}

