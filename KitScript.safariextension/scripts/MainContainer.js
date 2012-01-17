
/**
 *  KitScript - A User Script Manager For Safari
 *
 *  MainContainer.js - Javascript file for the main container of the extension.
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
            
            // User Script Settings
            // =Tabs
            case '#ks-uss-tab-usersets':
                break;
            case '#ks-uss-tab-scriptsets':
                break;
            case '#ks-uss-tab-scriptedit':
                break;
            // User Settings
            // =Excludes
            case '#ks-uss-us-excl-btn-add':
                break;
            case '#ks-uss-us-excl-btn-edit':
                break;
            case '#ks-uss-us-excl-btn-remove':
                break;
            // =Includes
            case '#ks-uss-us-incl-btn-add':
                break;
            case '#ks-uss-us-incl-btn-edit':
                break;
            case '#ks-uss-us-incl-btn-remove':
                break;
            // Script Settings
            case '#ks-uss-ss-btn-touexcl':
                break;
            case '#ks-uss-ss-btn-touincl':
                break;
            // Script Editor
            case '#ks-uss-se-btn-update':
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
    
    // Init Main Panel Content
    ks.mainContainer.contentManager.showMainContainer();
});

