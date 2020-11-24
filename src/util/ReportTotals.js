// Various functions to return report totals for arrays of Registration and Summary
// objects, along with utlities to return the headers and fields arrayd for each
// type of totals object.

// Utilities for Registrations Array -----------------------------------------

export const registrationsFields = [
    "total$$",
    "totalAG",
    "totalCT",
    "totalFM",
    "totalMM",
    "totalSW",
    "totalUK",
    "totalWB",
    "totalAssigned",
    "percentAssigned",
    "totalUnassigned",
    "percentUnassigned",
    "totalMats",
    "totalAmount",
]

export const registrationsHeaders = [
    "$$",
    "AG",
    "CT",
    "FM",
    "MM",
    "SW",
    "UK",
    "WB",
    "Used",
    "%Used",
    "Empty",
    "%Empty",
    "Total Mats",
    "Total $$",
];

export const registrationsTotals = (registrations) => {

    let totals = {
        total$$: 0,
        totalAG: 0,
        totalCT: 0,
        totalFM: 0,
        totalMM: 0,
        totalSW: 0,
        totalUK: 0,
        totalWB: 0,
        totalAssigned: 0,
        percentAssigned: 0.0,
        totalUnassigned: 0,
        percentUnassigned: 0.0,
        totalMats: 0,
        totalAmount: 0.00
    };

    registrations.forEach(registration => {
        if (registration.guestId) {
            switch (registration.paymentType) {
                case "$$":  totals.total$$++;   break;
                case "AG":  totals.totalAG++;   break;
                case "CT":  totals.totalCT++;   break;
                case "FM":  totals.totalFM++;   break;
                case "MM":  totals.totalMM++;   break;
                case "SW":  totals.totalSW++;   break;
                case "UK":  totals.totalUK++;   break;
                case "WB":  totals.totalWB++;   break;
                default:    totals.totalUK++;   break;
            }
            totals.totalAssigned++;
            if (registration.paymentAmount) {
                totals.totalAmount += parseFloat(registration.paymentAmount);
            }
        } else {
            totals.totalUnassigned++;
        }
        totals.totalMats++;
    })

    totals.totalAmount = "$" + totals.totalAmount.toFixed(2);
    if (totals.totalMats > 0) {
        totals.percentAssigned = "" + (totals.totalAssigned * 100.0 / totals.totalMats).toFixed(1) + "%";
        totals.percentUnassigned = "" + (totals.totalUnassigned * 100.0 / totals.totalMats).toFixed(1) + "%";
    }
    return totals;

}

// Utilities for Summaries Array ---------------------------------------------

export const summariesFields = [
    "total$$",
    "totalAG",
    "totalCT",
    "totalFM",
    "totalMM",
    "totalSW",
    "totalUK",
    "totalWB",
    "totalAssigned",
    "percentAssigned",
    "totalUnassigned",
    "percentUnassigned",
    "totalMats",
    "totalAmount",
];

export const summariesHeaders = [
    "$$",
    "AG",
    "CT",
    "FM",
    "MM",
    "SW",
    "UK",
    "WB",
    "Used",
    "%Used",
    "Empty",
    "%Empty",
    "Total Mats",
    "Total $$",
];

export const summariesTotals = (summaries) => {

    let totals = {
        total$$: 0,
        totalAG: 0,
        totalCT: 0,
        totalFM: 0,
        totalMM: 0,
        totalSW: 0,
        totalUK: 0,
        totalWB: 0,
        totalAssigned: 0,
        percentAssigned: 0.0,
        totalUnassigned: 0,
        percentUnassigned: 0.0,
        totalMats: 0,
        totalAmount: 0.00
    };

    summaries.forEach(summary => {
        totals.total$$ += summary.total$$;
        totals.totalAG += summary.totalAG;
        totals.totalCT += summary.totalCT;
        totals.totalFM += summary.totalFM;
        totals.totalMM += summary.totalMM;
        totals.totalSW += summary.totalSW;
        totals.totalUK += summary.totalUK;
        totals.totalWB += summary.totalWB;
        totals.totalAssigned += summary.totalAssigned;
        totals.totalUnassigned += summary.totalUnassigned;
        totals.totalMats += (summary.totalAssigned + summary.totalUnassigned);
        totals.totalAmount += summary.totalAmount;
    });

    totals.totalAmount = "$" + parseFloat(totals.totalAmount).toFixed(2);
    if (totals.totalMats > 0) {
        totals.percentAssigned = "" + (totals.totalAssigned * 100.0 / totals.totalMats).toFixed(1) + "%";
        totals.percentUnassigned = "" + (totals.totalUnassigned * 100.0 / totals.totalMats).toFixed(1) + "%";
    }
    return totals;

}
