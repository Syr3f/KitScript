
var KSStorageTest = Class.create(KSStorage, {
    
    initialize: function ($super) {
        
        $super();
    },
    createStorage: function () {
        try {
            this.connect();
        }
        catch (e) {
            this.createTables();
        }
        
    },
    connect: function ($super) {
        
        if ($super() === true) {
            console.log("Database connected!");
        }
    },
    isExistant: function ($super) {
        
        if ($super() === true) {
            console.log("Database is existant!");
        }
    },
    createTable: function ($super, drop) {
        
        console.log("Creating Tables...");
        $super(drop);
        console.log("Tables created!");
    },
    insert: function ($super, name, desc, includes, excludes, code, disabled) {
        
        console.log("Inserting new row...");
        $super(name, desc, includes, excludes, code, disabled);
    },
    update: function ($super, id, name, desc, includes, excludes, code, disabled) {
        
        console.log("Updating row "+ id+"...");
        $super(id, name, desc, includes, excludes, code, disabled);
    },
    fetch: function ($super,id) {
        
        console.log("Fetching row: "+id);
        $super(id, _testFetchCallback);
    },
    fetchAll: function ($super, offset, limit) {
        
        console.log("Fetching All...");
        $super(offset, limit, _testFetchCallback);
        
    },
    remove: function ($super, id) {
        
        console.log("Deleting row "+id+".");
        $super(id);
    },
    disableScript: function ($super, id) {
        
        console.log("Disabling script.");
        $super(id);
    },
    runTest: function () {
        
        this.connect();
        this.isExistant();
        this.createTable(true);
        this.insert("ScriptTest1", "My first userscript.", "none", "none", "Blablabla!", 0);
        this.insert("ScriptTest2", "My second userscript.", "none", "none", "Blablabla!", 0);
        this.insert("ScriptTest3", "My third userscript.", "none", "none", "Blablabla!", 0);
        this.insert("ScriptTest4", "My fourth userscript.", "none", "none", "Blablabla!", 0);
        this.update(4, "ScriptTest444", "My fourth, fourth, fourth userscript.", "none", "none", "Blablablabla!", 1);
        this.fetch(3);
        this.fetchAll(0, 5);
        this.remove(2);
        this.fetchAll(0, 5);
        this.disableScript(3);
        this.fetch(3);
    }
})

db = new KSStorageTest();

function _testFetchCallback(transaction, resultSet) {
    
    _statementCallback(transaction, resultSet);
    
    for (var i=0; i < resultSet.rows.length; i++) {
        
        var _row = resultSet.rows.item(i);
        
        console.log("Row "+_row['id']+" with key/values: name/"+_row['name']+", description/"+_row['description']+", whitelist/"+_row['whitelist']+", blacklist/"+_row['blacklist']+", script/"+_row['script']+", disabled/"+_row['disabled']);
    }
}
