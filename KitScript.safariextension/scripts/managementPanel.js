


(function (ks) {
    
    ks.$("#btn-openNewUserScriptPanel").click(function (evnt) {
        
        ks.log("open new user script panel");
        
        ks.newUserScript.openPage();
    });
    
})(ks)



(function (ks) {
    
    function _listUserScripts() {
        
        tableId = '#us-list';
        
        ks.$(tableId).empty();
        
        resultSet = db.fetchAll();
        
        if (resultSet.getRowCount() > 0) {
            
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
                        <button type="button" onclick="ks.managementPanel.openSettings('+row['id']+')">Settings</button>
                    </td>
                    <td align="center" class="btn">
                        <button type="button" onclick="ks.managementPanel.disable('+row['id']+')">Disable</button>
                    </td>
                    <td align="center" class="btn">
                        <button type="button" onclick="ks.managementPanel.remove('+row['id']+')">Remove</button>
                    </td>
                </tr>';

                ks.$('tbody', tableId).append(tableRow);

                oddClass = "";
            }
        }
        else
        {
            tableRow = '<tr>
                <td>
                    No User Scripts in the database.
                </td>
            </tr>';
            
            ks.$('tbody', tableId).append(tableRow);
        }
    }
    
    _listUserScripts();
})(ks)


