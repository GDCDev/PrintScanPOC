sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";
	return Controller.extend("esprit.poc.PrintScanPOC.controller.BaseController", {

		/**
		* @returns router object
		* @public
		*/
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		* General function for navigating back
		* 
		* @param {string} sRouteName - Default route to navigate if no history found
		* @public
		*/
		navBack: function(sRouteName) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				// history contains a previous entry
				window.history.go(-1);
			} else {
				this.getRouter().navTo(sRouteName);
			}
		}
		
	});
});