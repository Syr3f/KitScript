/**
 *  Macho.jquery.js - A jQuery Plugin For Hogan.js Templating.
 *
 *  @author Seraf Dos Santos
 *  @copyright (c) 2012 Seraf Dos Santos - All rights reserved.
 *  @license ?
 *  @version 0.1
 */





(function( $ ) {
  $.fn.Macho = function(data, compOpts) {
    
    if (!Hogan) {
        alert("You need Twitter's Hogan.js (https://github.com/twitter/hogan.js).");
        return this;
    }
    
    var _hogan = Hogan;
    
    var _html = this.html();
    
    var _template = _hogan.compile(_html, (!compOpts?{}:compOpts));
    var _output = _template.render(data);
    
    this.html(_output);
    
    return this;
  };
})( jQuery );