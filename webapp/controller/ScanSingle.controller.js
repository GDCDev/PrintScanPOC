sap.ui.define([
	"esprit/poc/PrintScanPOC/controller/BaseController"
	,"sap/ui/core/UIComponent"
	,"sap/m/MessageBox"
	], function (BaseController,UIComponent,MessageBox) {
	"use strict";
	return BaseController.extend("esprit.poc.PrintScanPOC.controller.ScanSingle", {
		/* ======================================================= */
		/* lifecycle methods                                       */
		/* ======================================================= */
		onInit: function(){
                var oRouter = this.getRouter();
                oRouter.getRoute("ScanSingle")
                    .attachPatternMatched(this._onAfterRendering, this);
                
                var oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
        		this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
        		this.msgScanErrAgain = this._oResourceBundle.getText("msgScanErr")+"\n" + this._oResourceBundle.getText("msgScanAgain");
        },
        
        /* ======================================================= */
		/* event handlers                                          */
		/* ======================================================= */
        onNavBackPressed: function (oEvent) {
			this.getRouter().navTo("StyleInput");	
		},
		
		onCancelPressed: function (oEvent) {
			this.getRouter().navTo("StyleInput");	
		},
           
        /* ======================================================= */
		/* private methods                                         */
		/* ======================================================  */
        _onAfterRendering: function (oEvent) {
            	//only async call works even though 1ms
	            var interval = jQuery.sap.intervalCall(5, this, function(){
	            		if(cordova){
	                    	this._scan(this);
	            		}
	                    jQuery.sap.clearIntervalCall(interval);
	                });
            },
            
		//to check EAN13 format
		// _checkEAN13:function(sTxt){
		// 	if(!(/^[0-9]{13}$/.test(sTxt)))
		// 		return false;
  //          var aCode = sTxt.split("");
  //          var iA = 0;
  //          var iB = 0;
  //          for(var i=0;i<12;i++)
  //          {
  //              if(i%2==1)
  //              {
  //                  iA += parseInt(aCode[i]);
  //              }
  //              else
  //              {
  //                  iB += parseInt(aCode[i]);
  //              }  
  //          }
  //          var iC1 = iB;
  //          var iC2 = iA*3;
  //          var iCC = (iC1+iC2)%10;
  //          var  iCheckCode = (10 - iCC)%10;
  //          return  iCheckCode+""==aCode[12];
		// },
		
		_scan: function(that){
			cordova.plugins.barcodeScanner.scan(
					function (result) 
					{
						if(result.cancelled){
							//navto Master
							that.getOwnerComponent().getRouter().navTo("StyleInput");
						}
						// else if(result.format!=="EAN_13"||!that._checkEAN13(result.text)){
						// 	//reScan
						// 	MessageBox.alert(that.msgScanErrAgain,{
						// 			icon : MessageBox.Icon.ERROR,
						// 			title : "Error",
						// 			onClose: function(oAction) {
						// 				that._scan(that);
						// 		}
						// 	});
						// }
						else{
							that.getOwnerComponent().getRouter().navTo("EANDetail", {
								ean : encodeURIComponent(result.text)
							}, false);
						}
					},
					function (error) {
						//reScan
						MessageBox.alert(error,{
								icon : MessageBox.Icon.ERROR,
								title : "Error",
								onClose: function(oAction) {
									that._scan(that);
							}
						});
					}
				);
		}

		
	});
});