
// Let $ be to prototype and $ to jQuery within 

jQuery.noConflict();





// ks KitScript root object

ks = new KitScript();

// Create DB if not created 

if (ks.db.isDbExistant() === false)
    ks.log("Db Inexistant.");
    //ks.db.createTable()


ks.$(function () {
    
    ks.$('#toggle-enable-ks').click(function (evnt) {
        
        
    });
});