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
window.ks = null, window.db = null;

// Basic Initial Calls For The Extension
jQuery(document).ready(function ($) {
    
    // ks KitScript Root Object
    ks = new KitScript();
    
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
    
    // Bind History to StateChange Event
    window.onpopstate = function () {
        ks.request.dispatch();
    }
});

