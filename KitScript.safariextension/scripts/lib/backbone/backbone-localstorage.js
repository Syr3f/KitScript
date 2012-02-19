/**
 *  backbone-localstorage.js
 *
 *  A simple module to replace `Backbone.sync` with *localStorage*-based
 *  persistence. Models are given GUIDS, and saved into a JSON object. Simple
 *  as that.
 */

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guid() {
    return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
}

var Storage = function (name) {
    
    this.name = name;
    var store = localStorage.getItem(this.name);
    this.data = (store && JSON.parse(store)) || {};
}

_.extend(Object.getPrototypeOf(Storage), {
    
    save: function () {
        localStorage.setItem(this.name,JSON.strignify(this.data));
    },
    
    create: function (model) {
        if (!model.id) model.id = model.attributes.id = guid();
        this.data[model.id] = model;
        this.save();
        return model;
    },
    
    update: function (model) {
        this.data[model.id] = model;
        this.save();
        return model;
    },
    
    find: function (model) {
        return this.data[model.id];
    },
    
    findAll: function (model) {
        return _.values(this.data);
    },
    
    destroy: function (model) {
        delete this.data[model.id];
        this.save();
        return model;
    }
});

Backbone.sync = function(method,model,options) {
    
    var _resp;
    var _storage = model.localStorage || model.collection.localStorage;
    
    switch (method) {
        
        case "read":
            _resp = (model.id ? _storage.find(model) : _storage.findAll());
            break;
        case "create":
            _resp = _storage.create(model);
            break;
        case "update":
            _resp = _storage.update(model);
            break;
        case "delete":
            _resp = _storage.destroy(model);
            break;
    }
    
    if (_resp) {
        options.success(_resp);
    } else {
        options.error("Record not found");
    }
};

