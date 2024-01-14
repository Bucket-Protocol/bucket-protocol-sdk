"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectNames = void 0;
const constants_1 = require("../constants");
__exportStar(require("../constants"), exports);
function getObjectNames(objectTypes) {
    const accept_coin_type = Object.values(constants_1.MARKET_COINS_TYPE_LIST);
    const accept_coin_name = Object.keys(constants_1.MARKET_COINS_TYPE_LIST);
    const coinTypeList = objectTypes.map((type) => type.split("<").pop()?.replace(">", "") ?? "");
    const objectNameList = [];
    coinTypeList.forEach((type) => {
        const typeIndex = accept_coin_type.indexOf(type);
        const coinName = accept_coin_name[typeIndex];
        objectNameList.push(coinName ?? "");
    });
    return objectNameList;
}
exports.getObjectNames = getObjectNames;
//# sourceMappingURL=index.js.map