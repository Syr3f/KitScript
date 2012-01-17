/**
 *  KitScript - A User Script Manager For Safari
 *
 *  Global.js - Javascript file containing initial methods & function calls.
 *
 *  @author Seraf Dos Santos <webmaster@cyb3r.ca>
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */

//"use strict";





// Global KitScript Root Variables
ks = null, db = null;

// Run On Document Ready
jQuery(document).ready(function ($) {
    
    // Let $ Be To Prototype And ks.$ To jQuery 
    $.noConflict();
    
    // ks KitScript Root Object
    ks = new KitScript();
    
    // db Database Root Object
    db = new KSStorage();
    
    // Connect Db
    try {
        db.connect();
    } catch (e) {
        db._a("Cannot connect to the Database.");
    }
    
    // Debug Verbosity: 0=Silenced,1=Console,2=BrowserAlert
    ks.setVerbosityLevel(1);
    
    // Create DB If Not Created 
    if (!db.isDbExistant())
        db.createTables();
        
    // Declare On UI If Enabled Or Disabled
    ks.declareEnabled();
    
    // Init Main Panel Content
    ks.mainContainer.contentManager.initPanel();
});

