sap.ui.define([
	"esprit/poc/PrintScanPOC/controller/BaseController"
	,"sap/m/MessageBox"
], function (Controller,MessageBox) {
	"use strict";

	return Controller.extend("esprit.poc.PrintScanPOC.controller.StyleInput", {
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
			
			oParams["styleId"] = oInput.getValue().trim();
			this.getOwnerComponent().getRouter().navTo("StyleList", oParams);
		}
	});
});