sap.ui.define([
	"esprit/poc/PrintScanPOC/controller/BaseController"
	,"sap/ui/core/UIComponent"
	,"sap/m/MessageBox"
	,"sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("esprit.poc.PrintScanPOC.controller.StyleList", {
		/* ======================================================= */
		/* lifecycle methods                                       */
		/* ======================================================= */
		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("StyleList").attachPatternMatched(this._onObjectMatched, this);
		},
		
		/* ======================================================= */
		/* event handlers                                          */
		/* ======================================================= */
		onLineItemPressed: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("EANDetail", {
				ean:encodeURIComponent(oEvent.getSource().getProperty("title"))
			}, false);
		},

		onPrintEANListPressed: function (oEvent) {
			//setBlank
			var fnSetBlank = function (txt, nums, isLeft) {
				if (txt.length >= nums) {
					txt = txt.substring(0, nums);
					return txt;
				}
				while (txt.length < nums) {
					if (isLeft) {
						txt = " " + txt;
					} else {
						txt = txt + " ";
					}
				}
				return txt;
			};
			//getAfterColon
			var fnGetAfterColon = function (txt) {
				var start = txt.indexOf(":");
				if (start !== -1)
					start += 2;
				else
					start = txt.length;
				return txt.substring(start);
			};
			var aItems = this.byId("poList").getItems();
			var sPrintPage = "";
			//for monospaced font
			sPrintPage += "<tt>";
			
			var currentstyle=null;
			for (var i = 0; i < aItems.length; i++) {
				var sCurr = "EUR";
				if (aItems[i].mProperties.Currency) {
					sCurr = aItems[i].mProperties.Currency;
				}
				
				var aStyle = aItems[i].mProperties.intro.split(" - ");
				if (aStyle.length < 2) {
					if (!aStyle[0])
						aStyle[0] = "";
					aStyle[1] = "";
				}
			
				if(currentstyle!=aStyle[0]){
					
					if(i!=0)
						sPrintPage += "<br/><br/><br/>";
					
					currentstyle = aStyle[0];
					sPrintPage += currentstyle;
					//style
					sPrintPage += "<br/>";
					sPrintPage += aStyle[1] + "<br/>";
					sPrintPage += "<br/>";
					sPrintPage += "EAN             Color   Size      Price (" + sCurr + ")<br/>";
					sPrintPage += "=============   =====   ======      =========<br/>";
				}
				var sPrintLine = "";
				sPrintLine += fnSetBlank(aItems[i].mProperties.title, 16);
				sPrintLine += fnSetBlank(fnGetAfterColon(aItems[i].mAggregations.attributes[0].mProperties.text), 8);
				sPrintLine += fnSetBlank(fnGetAfterColon(aItems[i].mAggregations.attributes[1].mProperties.text), 5);
				sPrintLine += fnSetBlank(aItems[i].mProperties.number, 15, true);
				sPrintLine += "<br/>";
				sPrintPage += sPrintLine;
			}
			//for monospaced font
			sPrintPage += "</tt>";
			sPrintPage = sPrintPage.replace(/ /g, "&nbsp;");
			var oOptions = {
				name: "StyleEANList",
				printerId: ""
			};
			if (cordova) {
				cordova.plugins.printer.print(sPrintPage, oOptions, function (res) {
					//console.log(res ? "Done" : "Canceled");
				});
			}
		},
		
		/* ======================================================= */
		/* private methods                                         */
		/* ======================================================  */
		_onObjectMatched: function (oEvent) {
			var sQuery = oEvent.getParameter("arguments").styleId;
			var sServiceUrl = "/testSet/EANSet?_sort=Style&_order=asc";
			if (sQuery && sQuery !== "") {
				sServiceUrl = sServiceUrl + "&Style_like=" + sQuery.toUpperCase();
			} 
			
			var olistDataModel = new JSONModel();
			var oView = this.getView();
			$.ajax({
				type : "GET",
				url : sServiceUrl,
				dataType: "json", 
				async : false,
				success: function(data) {
					
					olistDataModel.setData({
						listData: data
					});
					oView.setModel(olistDataModel, "view");
				},
				error: function(err) {
					MessageBox.alert(err.status + " - " + err.statusText,{
								icon : MessageBox.Icon.ERROR,
								title : "Error"
						});
				}
			});
			
		}
		
	});

});