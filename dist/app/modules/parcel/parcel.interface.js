"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TParcelType = exports.TParcelStatus = void 0;
var TParcelStatus;
(function (TParcelStatus) {
    TParcelStatus["REQUESTED"] = "REQUESTED";
    TParcelStatus["APPROVED"] = "APPROVED";
    TParcelStatus["DISPATCHED"] = "DISPATCHED";
    TParcelStatus["IN_TRANSIT"] = "IN_TRANSIT";
    TParcelStatus["DELIVERED"] = "DELIVERED";
    TParcelStatus["CANCELED"] = "CANCELED";
    TParcelStatus["RETURNED"] = "RETURNED";
})(TParcelStatus || (exports.TParcelStatus = TParcelStatus = {}));
;
var TParcelType;
(function (TParcelType) {
    TParcelType["DOCUMENT"] = "DOCUMENT";
    TParcelType["PACKAGE"] = "PACKAGE";
    TParcelType["EXPRESS"] = "EXPRESS";
})(TParcelType || (exports.TParcelType = TParcelType = {}));
