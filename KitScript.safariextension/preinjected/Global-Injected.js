

//safari.self.tab.dispatchMessage();





var KSPI_ProxyMessage = {
    
    // Called Function Name
    funcName: "",
    
    // Array Of KSPI_ParamPair Objects
    params: []
};





function KSPI_CreateMessageData() {
    
    var _struct = Object.create(KSPI_MessageStruct);
    
    _struct.funcName = arguments.shift();
    _struct.params = arguments;
    
    return _struct;
}