# KitScript - A User Script Manager For Safari
#
# @author Seraf Dos Santos <webmaster@cyb3r.ca>
# @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
# @license MIT License
# @version 2.0
#
# _Utils.js - Javascript file containing utilitary classes used globally in the
# extension.





if not String.prototype.trim
  String.prototype.trim =>
    @replace /^\s+|\s+$/g, ''





class window.C_Crypto
  
  constructor: (@str) ->
    jsl.add "../scripts/lib/crypto/Base64.js"
    jsl.add "../scripts/lib/crypto/MD5.js"
    jsl.add "../scripts/lib/crypto/RIPEMD-160.js"
    jsl.add "../scripts/lib/crypto/SHA-1.js"
    jsl.add "../scripts/lib/crypto/SHA-256.js"
    jsl.add "../scripts/lib/crypto/SHA-512.js"
    jsl.load()
    
  toBase64: (str) =>
    encode64 str? or @str?
  
  fromBase64: (str) =>
    decode64 str? or @str?
  
  getHexMD5: (str) =>
    hex_md5 str? or @str?
  
  getBase64MD5: (str) =>
    b64_md5 str? or @str?
  
  getHexRIPEMD160: (str) =>
    hex_rmd160 str? or @str?
  
  getBase64RIPEMD160: (str) =>
    b64_rmd160 str? or @str?
  
  getHexSHA1: (str) =>
    hex_sha1 str? or @str?
  
  getBase64SHA1: (str) =>
    b64_sha1 str? or @str?
  
  getHexSHA256: (str) =>
    hex_sha256 str? or @str?
  
  getBase64SHA256: (str) =>
    b64_sha256 str? or @str?
  
  getHexSHA512: (str) =>
    hex_sha512 str? or @str?
  
  getBase64SHA512: (str) =>
    b64_sha512 str? or @str?





class window.C_Utils

  constructor: ->
    @md = window.markdown
    @crypto = new C_Crypto()

  pop: (msg) =>
    alert msg

  log: (msg) =>
    console.log msg
  
  escQuote: (str) =>
    str.replace "'", "\\'", "gm"
  
  sqlClean: (str) =>
    @escQuote str.trim

window._Utils = new C_Utils


