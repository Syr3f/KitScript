/**
 *  KitScript - A User Script Safari Extension
 *
 *  Global.js - Javascript file containing initial methods & function calls.
 *
 *  @author Seraf Dos Santos <webmaster@cyb3r.ca>
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */

//"use strict";





// Global KitScript variable
ks = null;

// Load on document ready
jQuery(document).ready(function ($) {
    
    // Let $ be to prototype and ks.$ to jQuery within 
    $.noConflict();
    
    // ks KitScript root object
    ks = new KitScript();
    
    // Debug Verbosity: 0=Silenced,1=Console,2=BrowserAlert
    ks.setVerbosityLevel(1);
    
    // Create DB if not created 
    if (!ks.db.isDbExistant())
        ks.db.createTables();
        
    // Declare on UI if Enabled or Disabled
    ks.declareEnabled();
});

