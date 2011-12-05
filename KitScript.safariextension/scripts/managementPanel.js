
$(function () {
    
    function _listUserScripts() {
        
        tableId = 'us-list';
        
        $(tableId).empty();
        
        resultSet = db.fetchAll();
        
        for (var i = 0; i < resultSet.getRowCount(); i++) {
            
            if (i % 2 = 0) {
                oddClass = 'class="odd"';
            }
            
            row = resultSet.getRow(i);
            
            tableRow = '<tr '+oddClass+' id="user-script-'+row['id']+'">
                <td class="icon">
                    (icon)
                </td>
                <td>
                    <span class="us-title">'+row['name']+'</span><br>
                    <span class="us-desc">'+row['desc']+'</span>
                </td>
                <td align="center" class="btn">
                    <button type="button" onclick="ks.managementPanel.settings('+row['id']+')">Settings</button>
                </td>
                <td align="center" class="btn">
                    <button type="button" onclick="ks.managementPanel.disable('+row['id']+')">Disable</button>
                </td>
                <td align="center" class="btn">
                    <button type="button" onclick="ks.managementPanel.remove('+row['id']+')">Remove</button>
                </td>
            </tr>';
            
            $('tbody', tableId).append(tableRow);
            
            oddClass = "";
        }
    }
    
    _listUserScripts();
});