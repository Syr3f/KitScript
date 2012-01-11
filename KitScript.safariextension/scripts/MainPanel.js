
/**
 *  KitScript - A User Script Safari Extension
 *
 *  MainPanel.js - Javascript file containing functions for the main panel
 *  of the extension.
 *
 *  @author Seraf Dos Santos
 *  @copyright 2011-2012 Seraf Dos Santos - All rights reserved.
 *  @license MIT License
 *  @version 0.1
 */





// Run on load
jQuery(document).ready(function ($) {
    
    var _btnsSels = ['#ks-topmenu * a',
                        'ul.ks-vertmenu * a',
                        '#ks-gs-form * a',
                        '#ks-aus-form * a',
                        '#ks-alert-modal * a'];
    
    //
    $(_btnsSels.join(',')).click(function (evt) {
        
        var _req = $(this).attr("href");
        
        switch (_req) {
            case '#null':
                break;
            case '#enable-ks':
                ks.setEnable();
                break;
            case '#disable-ks':
                ks.setDisable();
                break;
            
            // Global Settings Buttons
            case '#ks-gs-btn-add':
                //alert(1);
                //ks.mainPanel.globalSettingsForm.addExclude();
                break;
            case '#ks-gs-btn-edit':
                //ks.mainPanel.globalSettingsForm.editExclude();
                break;
            case '#ks-gs-btn-remove':
                ks.mainPanel.globalSettingsForm.removeExclude();
                break;
            
            // New User Script
            case '#ks-aus-btn-add':
                ks.mainPanel.newUserScriptForm.addUserScript();
                break;
            
            // User Script Settings
            case '#':
                break;
            
            // Alert Modal
            case '#ks-alert-close':
                //ks.mainPanel.hideAlert();
                break;
            
            default:
                ks.mainPanel.contentManager.transitContent(_req);
        }
    });
});


/*

<tr id="us-{{us_id}}">
<td><h3>{{us_name}}</h3> <span>{{us_desc}}</span></td>
<td>
<button type="button" onclick="ks.mainPanel.managePanel.openUserScriptSettings({{us_id}})" class="btn">Settings</button>
</td>
<td>
<button type="button" onclick="ks.mainPanel.managePanel.disableUserScript({{us_id}})" class="btn">Disable</button>
</td>
<td>
<button type="button" onclick="ks.mainPanel.managePanel.deleteUserScript({{us_id}})" class="btn">Delete</button>
</td>
</tr>

*/
