/**
 *  KitScript - A User Script Safari Extension
 *
 *  Global.js - Javascript file containing initial methods & function calls.
 *
 *  @author Seraf Dos Santos
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */





// Let $ be to prototype and ks.$ to jQuery within 
jQuery.noConflict();

// ks KitScript root object
ks = new KitScript();

// Create DB if not created 
if (!ks.db.isDbExistant())
    ks.db.createTables();

ks.declareEnabled();
