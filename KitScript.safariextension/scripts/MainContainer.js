
/**
 *  KitScript - A User Script Manager For Safari
 *
 *  MainPanel.js - Javascript file containing functions for the main panel
 *  of the extension.
 *
 *  @author Seraf Dos Santos <webmaster@cyb3r.ca>
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */

//"use strict";




// Run on load
jQuery(document).ready(function ($) {
    
    var _btnsSelectors = ['#ks-topmenu * a',
                            'ul.ks-vertmenu * a',
                            //'#ks-usm-list * a',
                            '#ks-gs-form * a',
                            '#ks-gs-add-modal * a',
                            '#ks-gs-edit-modal * a',
                            '#ks-aus-form * a',
                            '#ks-alert-modal * a'
                        ];
    
    // All Button Events of KitScript
    $(_btnsSelectors.join(',')).click(function (evt) {
        
        var _req = $(this).attr("href");
        
        switch (_req) {
            case '#null':
                break;
            
            // Alert Modal
            case '#ks-alert-close':
                //ks.mainContainer.hideAlert();
                break;
            
            // User Script Manager
            //case '#ks-usm-btn-settings':
            //    ks.mainContainer.userScriptsManagerForm.openUserScriptSettings(_req);
            //    break;
            //case '#ks-usm-btn-disable':
            //    ks.mainContainer.userScriptsManagerForm.disableUserScript(_req);
            //    break;
            //case '#ks-usm-btn-delete':
            //    ks.mainContainer.userScriptsManagerForm.deleteUserScript(_req);
            //    break;
            
            // User Script Settings
            case '#':
                break;
            
            // Global Settings Buttons
            case '#ks-gs-btn-add':
                ks.mainContainer.globalSettingsForm.addGlobalExclude();
                break;
            case '#ks-gs-btn-edit':
                ks.mainContainer.globalSettingsForm.editGlobalExclude();
                break;
            case '#ks-gs-action-register':
                ks.mainContainer.globalSettingsForm.registerGlobalExclude();
                break;
            case '#ks-gs-action-update':
                ks.mainContainer.globalSettingsForm.updateGlobalExclude();
                break;
            case '#ks-gs-btn-remove':
                ks.mainContainer.globalSettingsForm.removeGlobalExclude();
                break;
            
            // New User Script
            case '#ks-aus-btn-add':
                ks.mainContainer.newUserScriptForm.addUserScript();
                break;
            
            // Toolbar & Menu Buttons
            case '#enable-ks':
                ks.setEnable();
                break;
            case '#disable-ks':
                ks.setDisable();
                break;
            default:
                ks.mainContainer.contentManager.transitContent(_req);
        }
    });
    
    // Global Settings List Events
    $("#ks-gs-list").change(function (evt) {
        
        $("#ks-gs-btn-edit").removeClass('disabled');
        $("#ks-gs-btn-remove").removeClass('disabled');
    });
});

