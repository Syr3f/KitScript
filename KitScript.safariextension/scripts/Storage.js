
var SQLStatementsArray = Class.create({
    
    initialize: function () {
        
        this._sqlStmntsArray = new Array();
    },
    push: function (dboconn, sql, arguments, statementCallback, errorCallback) {
        
        this._sqlStmntsArray.push(new Array(dboconn, sql, (arguments.length > 0 ? arguments : null), statementCallback, errorCallback));
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
    isConnected: function () {
        
        return this._isConnected;
    },
    transact: function (sqlStmntsArray) {
        
        var _sqls = sqlStmntsArray.getArray();
        
        this.setSuccess(false);
        
        //var _js = 'this._DB.transaction(function (transaction) {';
        
        //_js += 'transaction.prototype.dboconn = '+_sqls[i][0]+';';
        
        //for (var i = 0; i < _sqls.length; i++) {
            
        //    _js += "transaction.executeSql('"+_sqls[i][1]+"', "+(_sqls[i][2] === null ? null : "new Array('"+_sqls[i][2].join("','")+"')")+", "+_sqls[i][3]+', '+_sqls[i][4]+');';
        //}
        
        //_js += '});';
        
        //eval(_js);
        
        this._DB.transaction(function (transaction) {
            
            transaction.prototype.dboconn = _sqls[i][0];
            
            var _js = "";
            
            for (var i = 0; i < _sqls.length; i++) {
                
                _js += "transaction.executeSql('"+_sqls[i][1]+"', "+(_sqls[i][2] === null ? null : "new Array('"+_sqls[i][2].join("','")+"')")+", "+_sqls[i][3]+', '+_sqls[i][4]+');';
            }
            
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
    }
});



function _statementCallback(transaction, resultSet) {
    
    var _db = transaction.dboconn;
    
    _db.setResultSet(resultSet);
    
    if (resultSet.rows.length > 0)
        _db.setSuccess(true);
}

function _nullHandler() {
    
}

function _successHandler() {
    
    console.log('Successful statement!');
}

function _errorHandler(transaction, error) {
    
    var _db = transaction.dboconn;
    
    console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
    
    _db.setSuccess(false);
}

function _killTransaction(transaction, error) {
    
    return true;
}

