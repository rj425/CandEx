"use strict";
exports.__esModule = true;
var SalaryBreakDown = /** @class */ (function () {
    function SalaryBreakDown(x, y) {
        this.x = x;
        this.y = y;
        if (this.x >= 800000) {
            var i1 = this.basicSalary(x, y);
            this.x1 = i1;
            var i2 = this.hra(i1.annually);
            this.x2 = i2;
            var i14 = this.gratuity(i1.annually);
            this.x14 = i14;
            var i15 = this.employerContributiontoProvidentFund(i1.annually);
            this.x15 = i15;
            var i6 = this.medicalReimbursement(x, y, i1.annually, i2.annually, i14.annually, i15.annually);
            this.x6 = i6;
            var i7 = this.fuelAllowance(x, y, i1.annually, i2.annually, i6.annually, i14.annually, i15.annually);
            this.x7 = i7;
            var i3 = this.conveyanceAllowance(x, y, i1.annually, i2.annually, i7.annually, i14.annually, i15.annually);
            var i8 = this.leaveTravelAllowance(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i14.annually, i15.annually);
            this.x8 = i8;
            var i9 = this.mealAllowance(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i8.annually, i14.annually, i15.annually);
            this.x9 = i9;
            var i10 = this.telephoneReimbursement(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i8.annually, i9.annually, i14.annually, i15.annually);
            this.x10 = i10;
            var i11 = this.giftAllowance(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i8.annually, i9.annually, i10.annually, i14.annually, i15.annually);
            this.x11 = i11;
            var i12 = this.academicAllowance(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i8.annually, i9.annually, i10.annually, i11.annually, i14.annually, i15.annually);
            this.x12 = i12;
            var i13 = this.nps1(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i8.annually, i9.annually, i10.annually, i11.annually, i12.annually, i14.annually, i15.annually);
            this.x13 = i13;
            var i4 = this.specialAllowance(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i8.annually, i9.annually, i10.annually, i11.annually, i12.annually, i13.annually, i14.annually, i15.annually);
            this.x4 = i4;
            var i5 = this.flexiBasket();
            this.salaryBreakdown = {
                'basicSalary': i1,
                'hra': i2,
                'conveyanceAllowance': i3,
                'specialAllowance': i4,
                'flexiBasket': i5,
                'medicalReimbursement': i6,
                'fuelAllowance': i7,
                'leaveTravelAllowance': i8,
                'mealAllowance': i9,
                'telephoneReimbursement': i10,
                'giftAllowance': i11,
                'academicAllowance': i12,
                'nps': i13,
                'gratuity': i14,
                'employerContributiontoProvidentFund': i15
            };
        }
        else {
            var i1 = this.basicSalary(x, y);
            this.x1 = i1;
            var i2 = this.hra(i1.annually);
            this.x2 = i2;
            var i14 = this.gratuity(i1.annually);
            this.x14 = i14;
            var i15 = this.employerContributiontoProvidentFund(i1.annually);
            this.x15 = i15;
            var i6 = this.medicalReimbursement(x, y, i1.annually, i2.annually, i14.annually, i15.annually);
            this.x6 = i6;
            var i7 = this.fuelAllowance(x, y, i1.annually, i2.annually, i6.annually, i14.annually, i15.annually);
            var i3 = this.conveyanceAllowance(x, y, i1.annually, i2.annually, i7.annually, i14.annually, i15.annually);
            this.x3 = i3;
            var i8 = this.leaveTravelAllowance(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i14.annually, i15.annually);
            this.x8 = i8;
            var i9 = this.mealAllowance(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i8.annually, i14.annually, i15.annually);
            this.x9 = i9;
            var i10 = this.telephoneReimbursement(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i8.annually, i9.annually, i14.annually, i15.annually);
            this.x10 = i10;
            var i11 = this.giftAllowance(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i8.annually, i9.annually, i10.annually, i14.annually, i15.annually);
            this.x11 = i11;
            var i12 = this.academicAllowance(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i8.annually, i9.annually, i10.annually, i11.annually, i14.annually, i15.annually);
            this.x12 = i12;
            var i13 = this.nps1(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i8.annually, i9.annually, i10.annually, i11.annually, i12.annually, i14.annually, i15.annually);
            this.x13 = i13;
            var i4 = this.specialAllowance(x, y, i1.annually, i2.annually, i3.annually, i6.annually, i7.annually, i8.annually, i9.annually, i10.annually, i11.annually, i12.annually, i13.annually, i14.annually, i15.annually);
            var i5 = this.flexiBasket();
            this.salaryBreakdown = {
                'basicSalary': i1,
                'hra': i2,
                'conveyanceAllowance': i3,
                'specialAllowance': i4,
                'flexiBasket': i5,
                'medicalReimbursement': i6,
                'fuelAllowance': i7,
                'leaveTravelAllowance': i8,
                'mealAllowance': i9,
                'telephoneReimbursement': i10,
                'giftAllowance': i11,
                'academicAllowance': i12,
                'nps': i13,
                'gratuity': i14,
                'employerContributiontoProvidentFund': i15
            };
        }
    }
    // calculating basicsalary :   
    SalaryBreakDown.prototype.basicSalary = function (x, y) {
        var a1;
        a1 = ((x - y) * (40 / 100));
        return {
            "monthly": Math.round(a1 / 12),
            "annually": Math.round(a1)
        };
    };
    // calculating houserentallowance:
    SalaryBreakDown.prototype.hra = function (a1) {
        var a2;
        a2 = a1 * (50 / 100);
        return {
            "monthly": Math.round(a2 / 12),
            "annually": Math.round(a2)
        };
    };
    //calculating conveyanceallowance:
    SalaryBreakDown.prototype.conveyanceAllowance = function (x, y, a1, a2, a7, a14, a15) {
        var a3;
        a3 = (a7 > 0 ? 0 : (x - (a14 + a15 + y) - (a1 + a2) > 19200 ? 19200 : a1 - (a14 + a15 + y) - (a1 + a2)));
        return {
            "monthly": Math.round(a3 / 12),
            "annually": Math.round(a3)
        };
    };
    //calculating specialallowance:
    SalaryBreakDown.prototype.specialAllowance = function (x, y, a1, a2, a3, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
        var a4;
        a4 = x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7 + a9 + a10 + a11 + a12 + a8 + a13);
        return {
            "monthly": Math.round(a4 / 12),
            "annually": Math.round(a4)
        };
    };
    //calculating flexibasket:
    SalaryBreakDown.prototype.flexiBasket = function () {
        var a5;
        a5 = 0;
        return {
            "monthly": 0,
            "annually": 0
        };
    };
    //calculating medicalreimbursement:
    SalaryBreakDown.prototype.medicalReimbursement = function (x, y, a1, a2, a14, a15) {
        var a6;
        a6 = x - (a14 + a15 + y) - (a1 + a2) > 15000 ? 15000 : x - (a14 + a15 + y) - (a1 + a2);
        return {
            "monthly": Math.round(a6 / 12),
            "annually": Math.round(a6)
        };
    };
    //calculating fuelallowance:
    SalaryBreakDown.prototype.fuelAllowance = function (x, y, a1, a2, a6, a14, a15) {
        var a7;
        a7 = (a1 * 7.5 / 100) <= 19200 ? 0 : (x - (a14 + a15 + y) - (a1 + a2) - (a6) < 19200) ? (x - (a14 + a15 + y) - (a1 + a2) - (a6)) : ((a1 * 7.5 / 100) > 144000) ? ((x - (a14 + a15 + y) - (a1 + a2) - (a6) > 144000) ? 144000 : (x - (a14 + a15 + y) - (a1 + a2) - (a6))) : ((x - (a14 + a15 + y) - (a1 + a2) - (a6) > (a1 * 7.5 / 100) ? (a1 * 7.5 / 100) : (x - (a14 + a15 + y) - (a1 + a2) - (a6))));
        return {
            "monthly": Math.round(a7 / 12),
            "annually": Math.round(a7)
        };
    };
    //calculating leavetravelallowance:
    SalaryBreakDown.prototype.leaveTravelAllowance = function (x, y, a1, a2, a3, a6, a7, a14, a15) {
        var a8;
        a8 = x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7) > (8.33 / 100) * a1 ? (8.33 / 100) * a1 : x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7);
        return {
            "monthly": Math.round(a8 / 12),
            "annually": Math.round(a8)
        };
    };
    //calculating mealallowance:
    SalaryBreakDown.prototype.mealAllowance = function (x, y, a1, a2, a3, a6, a7, a8, a14, a15) {
        var a9;
        a9 = x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7 + a8) > (2200 * 12) ? (2200 * 12) : x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7 + a8);
        return {
            "monthly": Math.round(a9 / 12),
            "annually": Math.round(a9)
        };
    };
    //calculating telephonereimbursement:
    SalaryBreakDown.prototype.telephoneReimbursement = function (x, y, a1, a2, a3, a6, a7, a8, a9, a14, a15) {
        var a10;
        a10 = Math.round(x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7 + a8 + a9) > (3000 * 12) ? (3000 * 12) : x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7 + a8 + a9));
        return {
            "monthly": Math.round(a10 / 12),
            "annually": Math.round(a10)
        };
    };
    //calculating  giftallowance:
    SalaryBreakDown.prototype.giftAllowance = function (x, y, a1, a2, a3, a6, a7, a8, a9, a10, a14, a15) {
        var a11;
        a11 = x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7 + a8 + a9 + a10) > 4999 ? 4999 : x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7 + a8 + a9 + a10);
        return {
            "monthly": Math.round(a11 / 12),
            "annually": Math.round(a11)
        };
    };
    //calculating academicallowance:
    SalaryBreakDown.prototype.academicAllowance = function (x, y, a1, a2, a3, a6, a7, a8, a9, a10, a11, a14, a15) {
        var a12;
        a12 = x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7 + a8 + a9 + a10 + a11) > 50000 ? 50000 : x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7 + a8 + a9 + a10 + a11);
        return {
            "monthly": Math.round(a12 / 12),
            "annually": Math.round(a12)
        };
    };
    //calculating nps:
    SalaryBreakDown.prototype.nps = function (a1) {
        var a13;
        a13 = a1 / 10;
        return {
            "monthly": Math.round(a13 / 12),
            "annually": Math.round(a13)
        };
    };
    //calculating nps:
    SalaryBreakDown.prototype.nps1 = function (x, y, a1, a2, a3, a6, a7, a8, a9, a10, a11, a12, a14, a15) {
        var a13;
        a13 = (x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7 + a8 + a9 + a10 + a11 + a12)) > (10 / 100) * a1 ? (10 / 100) * a1 : (x - (a14 + a15 + y) - (a1 + a2 + a3) - (a6 + a7 + a8 + a9 + a10 + a11 + a12));
        return {
            "monthly": Math.round(a13 / 12),
            "annually": Math.round(a13)
        };
    };
    //calculating gratuity:
    SalaryBreakDown.prototype.gratuity = function (a1) {
        var a14;
        a14 = (a1 / 26) * (15 / 12);
        return {
            "monthly": Math.round(a14 / 12),
            "annually": Math.round(a14)
        };
    };
    //calculating employercontributiontoprovidentfund:
    SalaryBreakDown.prototype.employerContributiontoProvidentFund = function (a1) {
        var a15;
        a15 = (a1 * 0.12);
        return {
            "monthly": Math.round(a15 / 12),
            "annually": Math.round(a15)
        };
    };
    return SalaryBreakDown;
}());
exports.SalaryBreakDown = SalaryBreakDown;
var object = new SalaryBreakDown(800000, 48000);
console.log(object.salaryBreakdown);
