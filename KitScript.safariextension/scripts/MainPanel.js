
// Run on load
jQuery(document).ready(function ($) {
    
    //
    $("#ks-topmenu * a, ul.ks-vertmenu * a").click(function (evt) {
        
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
