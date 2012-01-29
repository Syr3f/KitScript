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
    
    // Routes Registration
    
    // Dynamic Routing - Not Implemented
    //ks.routes.add('genericRoute','MainContainer.html#:contentId',function (request) {
    //    if (request.hasHash()===true)
    //        ks.mainContainer.contentManager.transitContent(request.route.getSymbol('contentId'));
    //});
    
    ks.routes.add('globalSettingsForm','MainContainer.html#global-settings',function (request) {
        if (request.hasHash()===true)
            ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    ks.routes.add('defaultForm','MainContainer.html');
    ks.routes.add('userScriptsManagerForm',/MainContainer\.html(#userscript-manager)?/,function (request) {
        if (request.hasHash()===true)
            ks.mainContainer.contentManager.transitContent(request.getHash());
        else
            ks.mainContainer.contentManager.transitContent('userscript-manager');
    });
    ks.routes.add('newUserScriptForm','MainContainer.html#new-userscript',function (request) {
        
        if (request.hasHash()===true)
            ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    ks.routes.add('installUserScript',/MainContainer\.html#new-userscript\?_loaduserscriptfromurl=(.*)$/g,function (request) {
        
        if (request.hasHash()===true)
            ks.mainContainer.contentManager.transitContent(request.getHash());
        
        alert(request.getHash());
        
        // If Has Question Mark: Parse Request String
        if (request.hasQueryString()===true) {
            
            // Set Request Keys Here
            var _k1='_loaduserscriptfromurl';
            
            // Parse Request Keys Here
            if (request.hasParam(_k1)===true) {
                var _v1 = request.getParamVal(_k1);  alert('param: ['+_v1+']');
                ks.mainContainer.newUserScriptForm.loadURL(_v1);
            }
        }
    });
    ks.routes.add('aboutKitScriptForm','MainContainer.html#about',function (request) {
        if (request.hasHash())
            ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    ks.routes.add('userScriptSettingsForm','MainContainer.html#userscript-settings',function (request) {
        if (request.hasHash())
            ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    
    // Reinitialize Request Object
    ks.request.tokenizeURI();
});

