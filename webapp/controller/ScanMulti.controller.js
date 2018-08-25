sap.ui.define([
	"esprit/standard/app/controller/BaseController"
	,"sap/ui/core/UIComponent"
	,"sap/m/MessageBox"
	,"sap/m/MessageToast"
], function (Controller, UIComponent, MessageBox, MessageToast) {
	"use strict";
	return Controller.extend("esprit.poc.PrintScanPOC.controller.ScanMulti", {
		
		onInit: function () {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.getRoute("ScanMulti").attachPatternMatched(this._onAfterRendering, this);
			var oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this.msgScanErrAgain = this._oResourceBundle.getText("msgScanErr") + "\n" + this._oResourceBundle.getText("msgScanAgain");
			this.msgScanNew = this._oResourceBundle.getText("msgScanNew");
		},
		
		_onAfterRendering: function (oEvent) {
			this.barcodes = [];
			//only async call works even though 1ms
			var interval = jQuery.sap.intervalCall(5, this, function () {
				if (cordova) {
					this._scan(this);
				}
				jQuery.sap.clearIntervalCall(interval);
			});
		},
		
		//to check EAN13 format
		_checkEAN13: function (sTxt) {
			if (!/^[0-9]{13}$/.test(sTxt))
				return false;
			var aCode = sTxt.split("");
			var iA = 0;
			var iB = 0;
			for (var i = 0; i < 12; i++) {
				if (i % 2 == 1) {
					iA += parseInt(aCode[i]);
				} else {
					iB += parseInt(aCode[i]);
				}
			}
			var iC1 = iB;
			var iC2 = iA * 3;
			var iCC = (iC1 + iC2) % 10;
			var iCheckCode = (10 - iCC) % 10;
			return iCheckCode + "" == aCode[12];
		},
		
		_scan: function (that) {
			cordova.plugins.barcodeScanner.scan(function (result) {
				if (result.cancelled) {
					//test
					//that.barcodes.push("4060469458664");
					//navto 
					if (that.barcodes.length == 0)
						that.getOwnerComponent().getRouter().navTo("StyleInput");
					else
						that.getOwnerComponent().getRouter().navTo("EANList", {
							barcodes: that.barcodes.join()
						}, false);
				} else if (result.format !== "EAN_13" || !that._checkEAN13(result.text)) {
					//reScan
					MessageBox.alert(that.msgScanErrAgain, {
						icon: MessageBox.Icon.ERROR,
						title: "Error",
						onClose: function (oAction) {
							that._scan(that);
						}
					});
				} else {
					if (!that.barcodes.includes(result.text))
						that.barcodes.push(result.text);
					MessageToast.show(that.msgScanNew + result.text, {
						duration: 500,
						onClose: function (oAction) {
							that._scan(that);
						}
					});
				}
			}, function (error) {
				//reScan
				MessageBox.alert(error, {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					onClose: function (oAction) {
						that._scan(that);
					}
				});
			});
		},
		
		action: function (oEvent) {
			var that = this;
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			var eventType = oEvent.getId();
			var aTargets = actionParameters[eventType].targets || [];
			aTargets.forEach(function (oTarget) {
				var oControl = that.byId(oTarget.id);
				if (oControl) {
					var oParams = {};
					for (var prop in oTarget.parameters) {
						oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
					}
					oControl[oTarget.action](oParams);
				}
			});
			var oNavigation = actionParameters[eventType].navigation;
			if (oNavigation) {
				var oParams = {};
				(oNavigation.keys || []).forEach(function (prop) {
					oParams[prop.name] = encodeURIComponent(JSON.stringify({
						value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
						type: prop.type
					}));
				});
				if (Object.getOwnPropertyNames(oParams).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
				} else {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
				}
			}
		},
		
		onCancelPress: function (oEvent) {
			if (this.barcodes.length == 0)
						this.getOwnerComponent().getRouter().navTo("StyleInput");
					else
						this.getOwnerComponent().getRouter().navTo("EANList", {
							barcodes: this.barcodes.join()
						}, false);
		}
	});
});