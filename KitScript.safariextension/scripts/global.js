
// Let $ be to prototype and ks.$ to jQuery within 
jQuery.noConflict();

// ks KitScript root object
ks = new KitScript();

// Create DB if not created 
if (!ks.db.isDbExistant())
    ks.db.createTables();

ks.declareEnabled();
