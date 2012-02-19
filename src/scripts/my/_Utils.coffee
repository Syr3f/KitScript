# KitScript - A User Script Manager For Safari
#
# @author Seraf Dos Santos <webmaster@cyb3r.ca>
# @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
# @license MIT License
# @version 2.0
#
# _Utils.js - Javascript file containing utilitary classes (by Prototype.js)
# used globally in the extension.





if not String.prototype.trim then
  String.prototype.trim = ->
    return this.replace /^\s+|\s+$/g,''





class _Utils

  constructor: =>
        
    @$ = jQuery
    @md = window.markdown

  _a: (msg) =>
    
    alert msg

  _l: (msg) =>
      
      console.log msg
  
  escQuote: (str) =>
    
    str.replace "'", "\\'", "gm"
  
  sqlClean: (str) =>
    
    this.escQuote str.trim
  
  MD5: (str) =>
    hex_md5 str
