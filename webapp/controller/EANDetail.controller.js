sap.ui.define([
	"esprit/poc/PrintScanPOC/controller/BaseController"
	,"sap/m/MessageBox"
	,'sap/ui/model/json/JSONModel'
], function (Controller,MessageBox,JSONModel) {
	"use strict";
	return Controller.extend("esprit.poc.PrintScanPOC.controller.EANDetail", {
		/* ======================================================= */
		/* lifecycle methods                                       */
		/* ======================================================= */
		onInit: function() {
			var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("EANDetail").attachPatternMatched(this._onRouteMatched, this);
		},

		
		/* ======================================================= */
		/* event handlers                                          */
		/* ======================================================= */
		onNavBack: function(oEvent) {
			var oHistory = sap.ui.core.routing.History.getInstance();
			var	sPreviousHash = oHistory.getPreviousHash();
			//this.byId("page").destroyContent();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("StyleInput");
			}
		},
		
		//more info for barcode
		//https://github.com/lindell/JsBarcode/wiki/Options
		onPrintLabelPressed: function (oEvent) {
			var sPrintPage = '<div style="width:230;height:161">\
					{0}&nbsp;&nbsp;{1}&nbsp;&nbsp;&nbsp;<div style="float:right">{2}</div><br/>\
					{3}&nbsp;&nbsp;{4}<br/>\
					<svg class="barcode"\
						jsbarcode-format="EAN13"\
						jsbarcode-height="45"\
						jsbarcode-width="2"\
						jsbarcode-value="{5}"\
						jsbarcode-textmargin="0"\
						jsbarcode-fontoptions="bold">\
					</svg><br/>\
					{6}<div style="float:right">{7}</div>\
				</div>';
	
			sPrintPage = sPrintPage.replace(/\{0\}/g, this.byId("lblSeason").getValue())
					.replace(/\{1\}/g, this.byId("lblDivision").getValue())
					.replace(/\{2\}/g, this.byId("lblStyle").getValue())
					.replace(/\{3\}/g, this.byId("lblColor").getValue())
					.replace(/\{4\}/g, this.byId("lblSize").getValue())
					.replace(/\{5\}/g, this.byId("lblEAN").getValue())
					.replace(/\{6\}/g, this.byId("lblCurrency").getValue())
					.replace(/\{7\}/g, this.byId("inputNumber").getValue());

			
			
			if(document.getElementById('printContainer')==null){
		        var oBody = document.getElementsByTagName('body')[0];
		        var oDiv = document.createElement('div');
		        oDiv.id='printContainer';
		        oDiv.style="display:none";
		        oBody.appendChild(oDiv);
			} 
			
			document.getElementById('printContainer').innerHTML = sPrintPage;
			JsBarcode(".barcode").init();
			
			var oOptions = {
				name: 'EANDetail-'+this.byId("lblEAN").getValue(), // + EAN
				printerId: ''
			};
			if(cordova){
				cordova.plugins.printer.print(document.getElementById('printContainer'), oOptions, function (res) {
					document.getElementById('printContainer').innerHTML = "";
					//console.log(res?"Done":"Canceled");
				});
			}
		},
		
		/* ======================================================= */
		/* private methods                                         */
		/* ======================================================  */
		_onRouteMatched: function(oEvent) {
			this._sEan = decodeURIComponent(oEvent.getParameter("arguments").ean);
			var sServiceUrl = "/testSet/EANSet?EAN=" + this._sEan;
			var oDataModel = new JSONModel();
			var oView = this.getView();
			$.ajax({
				type : "GET",
				url : sServiceUrl,
				dataType: "json",
				async : false,
				success: function(data) {
					if (data && data.length > 0){
						oDataModel.setData(data[0]);
						oView.setModel(oDataModel, "detail");
					} else {
						oDataModel.setData({});
						oView.setModel(oDataModel, "detail");
					}
				},
				error: function(err) {
					MessageBox.alert(err.status + " - " + err.statusText, {
									icon : MessageBox.Icon.ERROR,
									title : "Error"
							});
				}
			});
			
			//this._sPath =  "/EANModels('"+ this._sEan +"')";
			
			//var oDetail = this.byId("detail");
			//if (oDetail) {
			//	oDetail.bindElement({ path: this._sPath });
			//}
			
		}
	});
});