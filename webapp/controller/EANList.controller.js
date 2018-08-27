sap.ui.define([
	"esprit/poc/PrintScanPOC/controller/BaseController"
	,"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";
	return Controller.extend("sap.m.PrintPOC.controller.EANList", {
		/* ======================================================= */
		/* lifecycle methods                                       */
		/* ======================================================= */
		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("EANList")
				.attachPatternMatched(this._onObjectMatched, this);
			this.aBarcodes = [];
		},

		/* ======================================================= */
		/* event handlers                                          */
		/* ======================================================= */
		onLineItemPressed: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("EANDetail", {
				//ean: encodeURIComponent(oEvent.getSource().getBindingContext().getProperty("Code"))
				ean: encodeURIComponent(oEvent.getSource().getTitle())
			}, false);
		},

		onNavBack: function (oEvent) {
			var oHistory = sap.ui.core.routing.History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("StyleInput");
				this._clearList(this);
			}
		},
	
		/* ======================================================= */
		/* private methods                                         */
		/* ======================================================  */
		_onObjectMatched: function (oEvent) {
			var aBarcodes = oEvent.getParameter("arguments").barcodes.split(',');
			aBarcodes.forEach(function (e, i) {
				if(!this.aBarcodes.includes(e)){
					this.aBarcodes.push(e);
				}
			},this);
			
			var aBarcodesObject = [];
			this.aBarcodes.forEach(function (e, i) {
				aBarcodesObject.push({
					Code: e
				});
			});

			var oListDataModel = new JSONModel();
			oListDataModel.setData({
				listData: aBarcodesObject
			});
			this.getView().setModel(oListDataModel, "view");
		},
		
		_clearList: function(that){
			that.aBarcodes = [];
		}

		
	});
});