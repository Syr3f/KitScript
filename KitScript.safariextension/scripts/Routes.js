/**
 *  KitScript - A User Script Manager For Safari
 *
 *  Routes.js - Javascript file containing the application routes.
 *
 *  @author Seraf Dos Santos <webmaster@cyb3r.ca>
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */





jQuery(document).ready(function ($) {
    
    // Dynamic Routing - Not Implemented Yet
    //ks.routes.add('genericRoute','MainContainer.html#:contentId?:key1=:param1',function (request) {
    //    if (request.hasHash()===true)
    //        ks.mainContainer.contentManager.transitContent(request.route.getSymbol('contentId'));
    //});
    
    // Global Settings View Route
    ks.routes.add('globalSettingsRoute','MainContainer.html#global-settings',function (request) {
        //ks._a("global-settings: "+request.getHash());
        //ks.history.pushState({state:1}, "KitScript | Global Settings", 'MainContainer.html#'+request.getHash());
        ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    
    // Default Form ~ User Script Manager View Route
    ks.routes.add('defaultRoute','MainContainer.html',function (request) {
        //ks.history.pushState({state:2}, "KitScript | User Scripts Manager", 'MainContainer.html#'+"userscript-manager");
        ks.mainContainer.contentManager.transitContent('userscript-manager');
    });
    
    // User Script Manager View Route
    ks.routes.add('userScriptsManagerRoute',/MainContainer\.html#userscript-manager/,function (request) {
        //ks._a("userscript-manager: "+request.getHash());
        //ks.history.pushState({state:2}, "KitScript | User Scripts Manager", 'MainContainer.html#'+request.getHash());
        ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    
    // User Script Settings View Route
    ks.routes.add('userScriptSettingsRoute','MainContainer.html#userscript-settings',function (request) {
        //ks._a("userscript-settings: "+request.getHash());
        //ks.history.pushState({state:3}, "KitScript | User Script Settings", 'MainContainer.html#'+request.getHash());
        ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    
    // New User Script View Route
    ks.routes.add('newUserScriptRoute','MainContainer.html#new-userscript',function (request) {
        //ks._a("new-userscript: "+request.getHash());
        //ks.history.pushState({state:4}, "KitScript | New User Script", 'MainContainer.html#'+request.getHash());
        ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    
    // Install User Script By URL View Route
    //ks.routes.add('installUserScriptRoute',/MainContainer\.html#new-userscript\?_loaduserscriptfromurl=(?:.*)/,function (request) {
    ks.routes.add('installUserScriptRoute',/MainContainer\.html#new-userscript\?_loaduserscriptfromurl=.*/,function (request) {
        //ks._a("new-userscript: "+request.getHash());
        ks.mainContainer.contentManager.transitContent(request.getHash());
        
        var _k1='_loaduserscriptfromurl';
        
        if (request.hasParam(_k1)===true) {
            var _v1 = request.getParamVal(_k1);
            
            ks.mainContainer.newUserScriptForm.loadURL(_v1);
        }
    });
    
    // About KitScript View Route
    ks.routes.add('aboutKitScriptRoute','MainContainer.html#about',function (request) {
        //ks._a("about: "+request.getHash());
        //ks.history.pushState({state:5}, "KitScript | About KitScript", 'MainContainer.html#'+request.getHash());
        ks.mainContainer.contentManager.transitContent(request.getHash());
    });
    
    // Controller/View Dispatch Example
    //ks.routes.add('aboutKitScriptRoute','MainContainer.html#about','DefaultController','aboutView');
});