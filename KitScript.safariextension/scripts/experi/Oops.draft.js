/**
 *  Oops.js – A Javascript Object-Oriented Programming Strategy (The Final Javascript 1.x Class System)
 *
 *  @author Seraf Dos Santos
 *
 *  Code is an extract of Prototype.js Class object along its utilitaries.
 *  
 *  @author Sam Stephenson
 *  @copyright (c) 2005-2010 Sam Stephenson
 *  @version 1.7
 *  @license MIT License
 */





// object.js
(function() {
    
    function extend(destination, source) {
      for (var property in source)
        destination[property] = source[property];
      return destination;
    }
    
    function getKeys(object) {
        var results = [];
        for (var property in object)
            results.push(property);
        return results;
    }

    extend(Object, {
        extend:        extend,
        getKeys:       getKeys
    });
})();





// function.js
Object.extend(Function.prototype, (function() {
    var slice = Array.prototype.slice;
    
    function update(array, args) {
        var arrayLength = array.length, length = args.length;
        while (length--) array[arrayLength + length] = args[length];
        return array;
    }
    
    function bind(context) {
        if (arguments.length < 2 && typeof arguments[0] === "undefined") return this;
        var __method = this, args = slice.call(arguments, 1);
        return function() {
            array = slice.call(args, 0);
            var a = update(args,arguments);
            return __method.apply(context, a);
        }
    }
    
    function wrap(wrapper) {
        var __method = this;
        return function() {
            var a = update([__method.bind(this)], arguments);
            return wrapper.apply(this, a);
        }
    }
    return {
        bind:                bind,
        wrap:                wrap
    }
})());





var Class = (function() {
    
    function subclass() {};
    
    function create() {
        
        var parent = null, properties = null;
        
        if (!arguments) properties = [];
        
        if ('toArray' in Object(arguments)) properties = arguments.map();
        
        var length = arguments.length || 0, properties = new Array(length);
        
        while (length--) properties[length] = arguments[length];
        
        if (typeof properties[0] === "function")
            parent = properties.shift();
            
        function klass() {
            this.initialize.apply(this, arguments);
        }
        
        for (var property in Class.Methods)
            klass[property] = Class.Methods[property];
        
        klass.superclass = parent;
        klass.subclasses = [];
        
        if (parent) {
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass;
            parent.subclasses.push(klass);
        }
        
        for (var i = 0; i < properties.length; i++)
            klass.addMethods(properties[i]);
            
        if (!klass.prototype.initialize)
            klass.prototype.initialize = function() { };
            
        klass.prototype.constructor = klass;
        
        return klass;
    }
    
    function addMethods(source) {
        
        var ancestor   = this.superclass && this.superclass.prototype;
        var properties = Object.getKeys(source);                                // √ !
        
        if (!Object.getKeys({ toString: true }).length) {                       // √ !
            
            if (source.toString != Object.prototype.toString)
                properties.push("toString");
            
            if (source.valueOf != Object.prototype.valueOf)
                properties.push("valueOf");
        }
        
        for (var i = 0, length = properties.length; i < length; i++) {
            
            var property = properties[i], value = source[property];
            
            var argumentNames = value.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
                .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
                .replace(/\s+/g, '').split(',');
            
            argumentNames = argumentNames.length == 1 && !argumentNames[0] ? [] : argumentNames;
                
            if (ancestor && typeof value === "function" && argumentNames[0] == "$super") {
                
                var method = value;
                
                value = (function(m) {
                    
                    return function() {
                        return ancestor[m].apply(this, arguments);
                    };
                })(property).wrap(method);                                      // √ !
                
                value.valueOf = method.valueOf.bind(method);                    // √ ?
                value.toString = method.toString.bind(method);                  // √ ?
            }
            this.prototype[property] = value;
        }
        
        return this;
    }
    
    return {
        create: create,
        Methods: {
            addMethods: addMethods
        }
    };
})();

