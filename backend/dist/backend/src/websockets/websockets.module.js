"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketsModule = void 0;
const common_1 = require("@nestjs/common");
const booking_gateway_1 = require("./booking.gateway");
const location_gateway_1 = require("./location.gateway");
const admin_gateway_1 = require("./admin.gateway");
let WebsocketsModule = class WebsocketsModule {
};
exports.WebsocketsModule = WebsocketsModule;
exports.WebsocketsModule = WebsocketsModule = __decorate([
    (0, common_1.Module)({
        providers: [booking_gateway_1.BookingGateway, location_gateway_1.LocationGateway, admin_gateway_1.AdminGateway],
        exports: [],
    })
], WebsocketsModule);
//# sourceMappingURL=websockets.module.js.map