"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportTicketStatus = exports.SupportChannel = exports.VerificationDocumentStatus = exports.DisputeStatus = exports.CommissionStatus = exports.WalletTransactionType = exports.BookingStatus = exports.UserRole = void 0;
// User and Profile Types
var UserRole;
(function (UserRole) {
    UserRole["CLIENT"] = "CLIENT";
    UserRole["CLEANER"] = "CLEANER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
// Booking Types
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["REQUESTED"] = "REQUESTED";
    BookingStatus["ACCEPTED"] = "ACCEPTED";
    BookingStatus["ON_THE_WAY"] = "ON_THE_WAY";
    BookingStatus["ARRIVED"] = "ARRIVED";
    BookingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    BookingStatus["COMPLETED"] = "COMPLETED";
    BookingStatus["CLIENT_CONFIRMED"] = "CLIENT_CONFIRMED";
    BookingStatus["DISPUTED"] = "DISPUTED";
    BookingStatus["CANCELLED"] = "CANCELLED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var WalletTransactionType;
(function (WalletTransactionType) {
    WalletTransactionType["RECHARGE"] = "RECHARGE";
    WalletTransactionType["COMMISSION"] = "COMMISSION";
    WalletTransactionType["ADJUSTMENT"] = "ADJUSTMENT";
    WalletTransactionType["PAYOUT"] = "PAYOUT";
})(WalletTransactionType || (exports.WalletTransactionType = WalletTransactionType = {}));
var CommissionStatus;
(function (CommissionStatus) {
    CommissionStatus["PENDING"] = "PENDING";
    CommissionStatus["APPLIED"] = "APPLIED";
})(CommissionStatus || (exports.CommissionStatus = CommissionStatus = {}));
// Support and Fraud Types
var DisputeStatus;
(function (DisputeStatus) {
    DisputeStatus["OPEN"] = "OPEN";
    DisputeStatus["NEEDS_INFO"] = "NEEDS_INFO";
    DisputeStatus["RESOLVED"] = "RESOLVED";
    DisputeStatus["REJECTED"] = "REJECTED";
})(DisputeStatus || (exports.DisputeStatus = DisputeStatus = {}));
// Verification Types
var VerificationDocumentStatus;
(function (VerificationDocumentStatus) {
    VerificationDocumentStatus["PENDING"] = "PENDING";
    VerificationDocumentStatus["APPROVED"] = "APPROVED";
    VerificationDocumentStatus["REJECTED"] = "REJECTED";
})(VerificationDocumentStatus || (exports.VerificationDocumentStatus = VerificationDocumentStatus = {}));
var SupportChannel;
(function (SupportChannel) {
    SupportChannel["EMAIL"] = "EMAIL";
    SupportChannel["WHATSAPP"] = "WHATSAPP";
    SupportChannel["CALL"] = "CALL";
    SupportChannel["FORM"] = "FORM";
})(SupportChannel || (exports.SupportChannel = SupportChannel = {}));
var SupportTicketStatus;
(function (SupportTicketStatus) {
    SupportTicketStatus["OPEN"] = "OPEN";
    SupportTicketStatus["IN_PROGRESS"] = "IN_PROGRESS";
    SupportTicketStatus["RESOLVED"] = "RESOLVED";
})(SupportTicketStatus || (exports.SupportTicketStatus = SupportTicketStatus = {}));
