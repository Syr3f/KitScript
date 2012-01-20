
/**
 *  KitScript - A User Script Manager For Safari
 *
 *  MainContainer.js - Javascript file  containing event handlers with method
 *  & function calls for the main container.
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
                            '#ks-gs-form * a',
                            '#ks-gs-add-modal * a',
                            '#ks-gs-edit-modal * a',
                            '#ks-usm-am-delwarn * a',
                            '#ks-aus-form * a',
                            '#ks-uss-form * a',
                            '#ks-uss-us-add-excl-modal * a',
                            '#ks-uss-us-edit-excl-modal * a',
                            '#ks-uss-us-add-incl-modal * a',
                            '#ks-uss-us-edit-incl-modal * a',
                            '#ks-alert-modal * a'
                        ];
    
    // All Anchor (Button) Events of KitScript
    $(_btnsSelectors.join(',')).click(function (evt) {
        
        var _href = $(this).attr("href");
        
        switch (_href) {
            case '#null':
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
            
            // User Script Manager
            case '#ks-usm-am-delwarn-close-btn':
                ks.mainContainer.userScriptsManagerForm.hideWarningDeleteAlert();
                break;
            case '#ks-usm-am-delwarn-delete-btn':
                ks.mainContainer.userScriptsManagerForm.confirmDeleteScript();
                break;
            
            // New User Script
            case '#ks-aus-btn-add':
                ks.mainContainer.newUserScriptForm.addUserScript();
                break;
            
            // User Script Settings
            case '#ks-uss-tab-usersets':
            case '#ks-uss-tab-scriptsets':
            case '#ks-uss-tab-scriptedit':
                ks.mainContainer.userScriptSettingsForm.switchTab(_href);
                break;
            // User Settings Excludes
            case '#ks-uss-us-excl-btn-add':
                ks.mainContainer.userScriptSettingsForm.addUserExclusion();
                break;
            case '#ks-uss-us-add-excl-modal-btn':
                ks.mainContainer.userScriptSettingsForm.registerUserExclusion(_href);
                break;
            case '#ks-uss-us-excl-btn-edit':
                ks.mainContainer.userScriptSettingsForm.editUserExclusion();
                break;
            case '#ks-uss-us-edit-excl-modal-btn':
                ks.mainContainer.userScriptSettingsForm.registerUserExclusion(_href);
                break;
            case '#ks-uss-us-excl-btn-remove':
                ks.mainContainer.userScriptSettingsForm.removeUserExclusion();
                break;
            // User Settings Includes
            case '#ks-uss-us-incl-btn-add':
                ks.mainContainer.userScriptSettingsForm.addUserInclusion();
                break;
            case '#ks-uss-us-add-incl-modal-btn':
                ks.mainContainer.userScriptSettingsForm.registerUserInclusion(_href);
                break;
            case '#ks-uss-us-incl-btn-edit':
                ks.mainContainer.userScriptSettingsForm.editUserInclusion();
                break;
            case '#ks-uss-us-edit-incl-modal-btn':
                ks.mainContainer.userScriptSettingsForm.registerUserInclusion(_href);
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
                if (_href !== '#')
                    ks.mainContainer.contentManager.transitContent(_href);
        }
    });
    
    // Global Settings List Events
    $("#ks-gs-list").change(function (evt) {
        
        if ($('#ks-gs-list option:selected').val() !== undefined)
            ks.mainContainer.globalSettingsForm.activateBtns();
    });
    
    // User Script Settings ~ User Settings Lists Events
    $('#ks-uss-us-excl-list').change(function (evt) {
        
        if ($('#ks-uss-us-excl-list option:selected').val() !== undefined)
            ks.mainContainer.userScriptSettingsForm.activateExclusionBtns();
    });
    $('#ks-uss-us-incl-list').change(function (evt) {
        
        if ($('#ks-uss-us-incl-list option:selected').val() !== undefined)
            ks.mainContainer.userScriptSettingsForm.activateInclusionBtns();
    });
    
    // User Script Settings ~ Script Settings Lists Events
    $('#ks-uss-ss-excl-list').change(function (evt) {
        
        if ($('#ks-uss-ss-excl-list option:selected').val() !== undefined)
            ks.mainContainer.userScriptSettingsForm.activateAddToUserIncludesBtn();
    });
    $('#ks-uss-ss-incl-list').change(function (evt) {
        
        if ($('#ks-uss-ss-incl-list option:selected').val() !== undefined)
            ks.mainContainer.userScriptSettingsForm.activateAddToUserExcludesBtn();
    });
    
    // Init Main Panel Content
    ks.mainContainer.contentManager.showMainContainer();
});

