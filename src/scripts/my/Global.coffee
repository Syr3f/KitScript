# KitScript - A User Script Manager For Safari
#
# @author Seraf Dos Santos <webmaster@cyb3r.ca>
# @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
# @license MIT License
# @version 2.0
#
# Global.js - Javascript file containing global extension initial methods &
# function calls.





## Global KitScript Root Variables
window.ks = null;

## Basic Initial Calls For The Extension
jQuery(document).ready ($) =>
  

## Safari Event Listeners
safari.application.addEventListener "validate", KSSEFH_ValidateHandler, false
safari.application.addEventListener "menu", KSSEFH_MenuHandler, false
safari.application.addEventListener "command", KSSEFH_CommandHandler, false
safari.application.addEventListener "beforeNavigate", KSSEFH_BeforeNavigateHandler, false
safari.application.addEventListener "navigate", KSSEFH_NavigateHandler, false
safari.application.addEventListener "message", KSSEFH_ProxyMessage, false
