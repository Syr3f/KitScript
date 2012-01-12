
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
                            '#ks-usm-list * a',
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
                //ks.mainPanel.hideAlert();
                break;
            
            // User Script Manager
            case '#ks-usm-btn-settings':
                ks.mainPanel.userScriptsManagerForm.openUserScriptSettings(_req);
                break;
            case '#ks-usm-btn-disable':
                ks.mainPanel.userScriptsManagerForm.disableUserScript(_req);
                break;
            case '#ks-usm-btn-delete':
                ks.mainPanel.userScriptsManagerForm.deleteUserScript(_req);
                break;
            
            // User Script Settings
            case '#':
                break;
            
            // Global Settings Buttons
            case '#ks-gs-btn-add':
                ks.mainPanel.globalSettingsForm.addGlobalExclude();
                break;
            case '#ks-gs-btn-edit':
                ks.mainPanel.globalSettingsForm.editGlobalExclude();
                break;
            case '#ks-gs-action-register':
                ks.mainPanel.globalSettingsForm.registerGlobalExclude();
                break;
            case '#ks-gs-action-update':
                ks.mainPanel.globalSettingsForm.updateGlobalExclude();
                break;
            case '#ks-gs-btn-remove':
                ks.mainPanel.globalSettingsForm.removeGlobalExclude();
                break;
            
            // New User Script
            case '#ks-aus-btn-add':
                ks.mainPanel.newUserScriptForm.addUserScript();
                break;
            
            // Toolbar & Menu Buttons
            case '#enable-ks':
                ks.setEnable();
                break;
            case '#disable-ks':
                ks.setDisable();
                break;
            default:
                ks.mainPanel.contentManager.transitContent(_req);
        }
    });
    
    // Global Settings List Events
    $("#ks-gs-list").change(function (evt) {
        
        $("#ks-gs-btn-edit").removeClass('disabled');
        $("#ks-gs-btn-remove").removeClass('disabled');
    });
});

