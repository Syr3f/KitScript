
var SqlArray = Create.create({
    
    initialize: function () {
        
        this._sqlArray = new Array();
    },
    push: function (sql, arguments, statementCallback, statementErrorCallback) {
        
        this._sqlArray.push(new Array(sql, arguments, statementCallback, statementErrorCallback));
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

var Storage = Class.create({
    
    initialize: function () {
        
        this._lastResultSet = null;
        this._isSuccess = false;
        
        this._DB = null;
        
        this._name = 'KitScript';
        this._version = '1.0';
        this._displayName = 'KitScript';
        this._maxSize = 10 * 1024 * 1024; // 10 MB in bytes
        
        this._dbIsCreated = false;
    },
    connect: function () {
        
        try {
            
            if (!window.openDatabase) {
                
                throw NOT_SUPPORTED;
            } else {
                
                this._DB = window.openDatabase(this._name, this._version, this._displayName, this._maxSize);
                
                this._dbIsCreated = true;
            }
        } catch(e) {
            
            switch (e) {
                case INVALID_STATE_ERR:
                    // Version number mismatch\
                    throw new StorageException('Invalid database version.');
                    break;
                case NOT_SUPPORTED:
                    throw new StorageException('openDatabase not supported');
                    break;
                default:
                    throw new StorageException('Unknown error '+e+'.');
            }
        }
    },
    isExistant: function () {
        
        return this._dbIsCreated;
    },
    createTables: function () {
        
        if (0) {
            
            sqlArray = new SqlArray();
            
            sqlArray.push('DROP TABLE UserScripts;', [], _statementCallback, _errorHandler);
            
            this.transact(sqlArray);
        }
        
        sqlArray = new SqlArray();
        
        sqlArray.push('CREATE TABLE IF NOT EXISTS UserScripts (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name VARCHAR(55) NOT NULL, description VARCHAR(155) NOT NULL, whitelist TEXT NOT NULL, blacklist TEXT NOT NULL, script TEXT NOT NULL, disabled INT NOT NULL 0);', [], _statementCallback, _errorHandler);
        
        this.transact(sqlArray);
        
        this._dbIsCreated = true;
    },
    transact: function (sqlArray) {
        
        this._DB.transaction(function (transaction) {
            
            for (var i = 0; i < sqlArray.length; i++) {
                
                transaction.executeSql(sqlArray[i][0], sqlArray[i][1], sqlArray[i][2], sqlArray[i][3], sqlArray[i][4]);
            }
        }, _errorHandler, _successCallback);
    },
    create: function (name, desc, includes, excludes, code, disabled) {
        
        sqlArray = new SqlArray();
        
        sqlArray.push("INSERT INTO UserScripts (name, description, whitelist, blacklist, script, disabled) VALUES (?, ?, ?, ?, ?, ?);", [name, desc, includes, excludes, code, disabled], _statementCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    update: function (id, name, desc, includes, excludes, code, disabled) {
        
        sqlArray = new SqlArray();
        
        sqlArray.push("UPDATE UserScripts SET name = ?, description = ?, whitelist = ?, blacklist = ?, script = ?, disabled = ? WHERE id = ?;", [name, desc, includes, excludes, code, disabled, id], _statementCallback, _errorHandler);
        
        this.transact(sqlArray);
    },
    read: function (id) {
        
        sqlArray = new SqlArray();
        
        sqlArray.push("SELECT * FROM UserScripts WHERE id = ?;", [id], _statementCallback, _errorHandler);
        
        this.transact(sqlArray);
        
        return this.getResultSet();
    },
    fetchAll: function (offset, limit) {
        
        sqlArray = new SqlArray();
        
        sqlArray.push("SELECT * FROM UserScripts LIMIT ?, ?;", [offset, limit], _statementCallback, _errorHandler);
        
        this.transact(sqlArray);
        
        return this.getResultSet();
    },
    remove: function (id) {
        
        sqlArray = new SqlArray();
        
        sqlArray.push("DELETE FROM UserScripts WHERE id = ?;", [id], _statementCallback, _killTransaction);
        
        this.transact(sqlArray);
    },
    disableScript: function (id) {
        
        sqlArray = new SqlArray();
        
        sqlArray.push("UPDATE UserScripts SET disabled = 1 WHERE id = ?;", [id], _statementCallback, _errorHandler);
        
        this.transact(sqlArray);
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

var db = new Storage();

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

            return this._resultSet.rowsAffected;
        }
        
        return null;
    },
    getRow: function (index) {

        if (this.getRowCount() > 0) {

            var _rows = this._resultSet.rows;

            return _rows.item(index);
        }
        
        return null;
    }
});

function _statementCallback(transaction, resultSet) {
    
    db.setResultSet(resultSet);
}

function _errorHandler(transaction, error) {
    
    alert('Oops.  Error was '+error.message+' (Code '+error.code+')');
    
    db.setSuccess(false);
}

function _killTransaction(transaction, error) {
    
    return true;
}

function _successCallback() {
    
    db.setSuccess(true);
}
