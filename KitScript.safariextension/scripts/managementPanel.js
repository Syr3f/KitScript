


ks.$("#btn-openNewUserScriptPanel").click(function (evnt) {
    
    ks.log("open new user script panel");
    
    ks.newUserScript.openPage();
});





function _listUserScripts() {
    
    tableId = '#us-list';
    
    ks.$(tableId).empty();
    
    resultSet = ks.db.fetchAll(0, 15);
    
    if (resultSet.getRowCount() > 0) {
        
        for (var i = 0; i < resultSet.getRowCount(); i++) {

            row = resultSet.getRow(i);

            tableRow = '<tr id="user-script-'+row['id']+'">
                <td>
                    <span>'+row['name']+'</span><br>
                    <span>'+row['desc']+'</span>
                </td>
                <td align="center">
                    <button class="btn" type="button" onclick="ks.manageUserScripts.openUserScriptSettings('+row['id']+')">Settings</button>
                </td>
                <td align="center">
                    <button class="btn" type="button" onclick="ks.manageUserScripts.disableUserScript('+row['id']+')">Disable</button>
                </td>
                <td align="center">
                    <button class="btn" type="button" onclick="ks.manageUserScripts.deleteUserScript('+row['id']+')">Remove</button>
                </td>
            </tr>';

            ks.$('tbody', tableId).append(tableRow);
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



