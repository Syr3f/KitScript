/**
 *  KitScript - A User Script Manager For Safari
 *
 *  Global.js - Javascript file containing global extension initial methods &
 *  function calls.
 *
 *  @author Seraf Dos Santos <webmaster@cyb3r.ca>
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */

//"use strict";





// Global KitScript Root Variables
ks = null, db = null;

// Basic Initial Calls For The Extension
jQuery(document).ready(function ($) {
    
    // Let $ Be To Prototype And ks.$ To jQuery 
    //$.noConflict();
    
    // ks KitScript Root Object
    ks = new KitScript();
    
    //Object.getPrototypeOf(safari).ks = ks;
    
    // db Database Root Object
    db = new KSStorage();
    
    // Connect Db
    try {
        db.connect();
        
        // Create Tables If Not Exists
        try {
            db.createTables();
        } catch (e) {
            alert("Cannot create tables: "+e.message+".");
        }
    } catch (e) {
        alert("Cannot connect to the Database: "+e.message+".");
    }
    
    // Debug Verbosity: 0=Silenced,1=Console,2=BrowserAlert
    ks.setVerbosityLevel(1);
        
    // Declare On UI If Enabled Or Disabled
    ks.declareEnabled();
    
    // ===============
    // Routes Registry
    // ===============
    
    // Dynamic Routing - Not Implemented Yet
    //ks.routes.add('genericRoute','MainContainer.html#:contentId?:key1=:param1',function (request) {
    //    if (request.hasHash()===true)
    //        ks.mainContainer.contentManager.transitContent(request.route.getSymbol('contentId'));
    //});
    
    // Global Settings View Route
    ks.routes.add('globalSettingsRoute','MainContainer.html#global-settings',function (request) {
        ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    
    // Default Form ~ User Script Manager View Route
    ks.routes.add('defaultRoute','MainContainer.html',function (request) {
        ks.mainContainer.contentManager.transitContent('userscript-manager');
    });
    
    // User Script Manager View Route
    ks.routes.add('userScriptsManagerRoute',/MainContainer\.html#userscript-manager/,function (request) {
        ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    
    // User Script Settings View Route
    ks.routes.add('userScriptSettingsRoute','MainContainer.html#userscript-settings',function (request) {
        ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    
    // New User Script View Route
    ks.routes.add('newUserScriptRoute','MainContainer.html#new-userscript',function (request) {
        ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    
    // Install User Script By URL View Route
    //ks.routes.add('installUserScriptRoute',/MainContainer\.html#new-userscript\?_loaduserscriptfromurl=(?:.*)/,function (request) {
    ks.routes.add('installUserScriptRoute',/MainContainer\.html#new-userscript\?_loaduserscriptfromurl=.*/,function (request) {
        ks.mainContainer.contentManager.transitContent(request.getHash());
        
        var _k1='_loaduserscriptfromurl';
        
        if (request.hasParam(_k1)===true) {
            var _v1 = request.getParamVal(_k1);
            
            ks.mainContainer.newUserScriptForm.loadURL(_v1);
        }
    });
    
    // About KitScript View Route
    ks.routes.add('aboutKitScriptRoute','MainContainer.html#about',function (request) {
        if (request.hasHash())
            ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    
    // Controller/View Dispatch Example
    //ks.routes.add('aboutKitScriptRoute','MainContainer.html#about','DefaultController','aboutView');
});

