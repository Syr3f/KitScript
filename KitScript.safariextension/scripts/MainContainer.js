
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
                            '#ks-uss-form * a',
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
            case '#ks-uss-tab-usersets':
            case '#ks-uss-tab-scriptsets':
            case '#ks-uss-tab-scriptedit':
                ks.mainContainer.userScriptSettingsForm.switchTab(_req);
                break;
            // User Settings Excludes
            case '#ks-uss-us-excl-btn-add':
                alert('add user exclude');
                break;
            case '#ks-uss-us-excl-btn-edit':
                alert('edit user exclude');
                break;
            case '#ks-uss-us-excl-btn-remove':
                ks.mainContainer.userScriptSettingsForm.removeUserExclusion();
                break;
            // User Settings Includes
            case '#ks-uss-us-incl-btn-add':
                alert('add user include');
                break;
            case '#ks-uss-us-incl-btn-edit':
                alert('edit user include');
                break;
            case '#ks-uss-us-incl-btn-remove':
                ks.mainContainer.userScriptSettingsForm.removeUserInclusion();
                break;
            // Script Settings
            case '#ks-uss-ss-btn-add-usincl':
                ks.mainContainer.userScriptSettingsForm.addToUserInclusion();
                break;
            case '#ks-uss-ss-btn-add-usexcl':
                ks.mainContainer.userScriptSettingsForm.addToUserExclusion();
                break;
            // Script Editor
            case '#ks-uss-se-btn-update':
                ks.mainContainer.userScriptSettingsForm.updateUserScript();
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
        $("#ks-gs-btn-edit").addClass('info');
        $("#ks-gs-btn-remove").removeClass('disabled');
        $("#ks-gs-btn-remove").addClass('danger');
    });
    
    // User Script Settings ~ User Settings Lists Events
    $('#ks-uss-us-excl-list').change(function (evt) {
        
        ks.mainContainer.userScriptSettingsForm.activateExclusionBtns();
    });
    $('#ks-uss-us-incl-list').change(function (evt) {
        
        ks.mainContainer.userScriptSettingsForm.activateInclusionBtns();
    });
    
    // User Script Settings ~ Script Settings Lists Events
    $('#ks-uss-ss-excl-list').change(function (evt) {
        
        $('#ks-uss-ss-btn-add-usincl').removeClass('disabled');
    });
    $('#ks-uss-ss-incl-list').change(function (evt) {
        
        $('#ks-uss-ss-btn-add-usexcl').removeClass('disabled');
    });
    
    // Init Main Panel Content
    ks.mainContainer.contentManager.showMainContainer();
});

