sap.ui.define([
	"esprit/poc/PrintScanPOC/controller/BaseController"
	,"sap/m/MessageBox"
], function (BaseController,MessageBox) {
	"use strict";
	
	return BaseController.extend("esprit.poc.PrintScanPOC.controller.StyleInput", {
		/* ======================================================= */
		/* lifecycle methods                                       */
		/* ======================================================= */
		onInit: function(){
			var oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
        	this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
        },
        
		/* ======================================================= */
		/* event handlers                                          */
		/* ======================================================= */
		onGoPressed: function (oEvent) {
			var oParams = {};
			var oInput = this.byId("styleInput");
			
			oParams["styleId"] = encodeURIComponent(oInput.getValue().trim());
			this.getRouter().navTo("StyleList", oParams);
		},
		
		onScanPressed: function (oEvent) {
			this.getRouter().navTo('ScanSingle');
		},
		
		onScanMultiPressed: function (oEvent) {
			this.getRouter().navTo('ScanMulti');
		}
	});
});