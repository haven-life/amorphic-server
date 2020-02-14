run(
[{"type":"click","key":"route.public.needs()","value":null,"sequence":0},
{"type":"get","key":"customer.primaryCustomer.age","value":"","sequence":0},
{"type":"get","key":"customer.capitalNeeds.earnedIncome[0].amount","value":"","sequence":0},
{"type":"get","key":"customer.primaryCustomer.address.zip","value":null,"sequence":0},
{"type":"get","key":"customer.primaryCustomer.gender","value":null,"sequence":0},
{"type":"get","key":"customer.capitalNeeds.haveAnyDebts","value":true,"sequence":0},
{"type":"get","key":"needsController.email","value":"","sequence":0},
{"type":"get","key":"customer.profile.familyStatus","value":"single","sequence":0},
{"type":"set","key":"customer.primaryCustomer.age","value":44,"sequence":0},
{"type":"set","key":"customer.capitalNeeds.earnedIncome[0].amount","value":120000,"sequence":0},
{"type":"set","key":"customer.primaryCustomer.address.zip","value":"12572","sequence":0},
{"type":"set","key":"customer.profile.familyStatus","value":"singleparent","sequence":0},
{"type":"get","key":"customer.profile.numberOfChildren","value":"1","sequence":0},
{"type":"get","key":"customer.capitalNeeds.children[0].age","value":"2","sequence":0},
{"type":"get","key":"customer.capitalNeeds.sendKidsToCollege","value":true,"sequence":0},
{"type":"get","key":"customer.capitalNeeds.getTerm(false)","value":30,"sequence":2},
{"type":"get","key":"customer.capitalNeeds.getCoverage(false)","value":"$1,200,000","sequence":1},
{"type":"get","key":"customer.profile.collegeType","value":"inState4yr","sequence":0},
{"type":"get","key":"customer.primaryCustomer.address.zip","value":"12572","sequence":0},
{"type":"get","key":"customer.getCombinedCost()","value":141.75,"sequence":0},
{"type":"set","key":"customer.capitalNeeds.payOffMortgage","value":true,"sequence":0},
{"type":"get","key":"customer.capitalNeeds.haveAnyDebts","value":false,"sequence":0},
{"type":"get","key":"customer.capitalNeeds.getLiabilityMortgage().amount","value":"","sequence":0},
{"type":"set","key":"customer.capitalNeeds.getLiabilityMortgage().amount","value":50000,"sequence":0},
{"type":"get","key":"customer.capitalNeeds.getLiabilityMortgage().amount","value":"$50,000","sequence":0},
{"type":"get","key":"customer.capitalNeeds.getCoverage(false)","value":"$1,300,000","sequence":1},
{"type":"get","key":"customer.getCombinedCost()","value":153.13,"sequence":0},
{"type":"click","key":"if(needsController.validate()){route.public.dialog.health();}","value":null,"sequence":0},
{"type":"get","key":"customer.primaryCustomer.age","value":"44","sequence":0},
{"type":"get","key":"customer.capitalNeeds.earnedIncome[0].amount","value":"$120,000","sequence":0},
{"type":"get","key":"customer.primaryCustomer.gender","value":"female","sequence":0},
{"type":"get","key":"customer.profile.numberOfChildren","value":"1","sequence":0},
{"type":"get","key":"customer.capitalNeeds.children[0].age","value":"2","sequence":0},
{"type":"get","key":"customer.capitalNeeds.getLiabilityMortgage().amount","value":"$50,000","sequence":0},
{"type":"get","key":"needsController.email","value":"","sequence":0},
{"type":"get","key":"customer.primaryCustomer.healthClassNumberValues[0]","value":"Fair","sequence":0},
{"type":"get","key":"customer.primaryCustomer.healthClassNumberValues[1]","value":"Good","sequence":0},
{"type":"get","key":"customer.primaryCustomer.healthClassNumberValues[2]","value":"Very Good","sequence":0},
{"type":"get","key":"customer.primaryCustomer.healthClassNumberValues[3]","value":"Excellent","sequence":0},
{"type":"get","key":"{customer.primaryCustomer.healthClassNumberDescriptions[Math.round(controller.customer.primaryCustomer.healthClassNumber)]}","value":"Your cholesterol and blood pressure are normal, you aren't overweight, and don't have any medical conditions. A picture of perfect health.  Congrats, you are part of the healthiest 20%.","sequence":0},
{"type":"get","key":"customer.primaryCustomer.smoker","value":false,"sequence":0},
{"type":"get","key":"controller.customer.primaryCustomer.healthClassNumber","value":3,"sequence":0},
{"type":"get","key":"customer.primaryCustomer.address.zip","value":"12572","sequence":0},
{"type":"set","key":"controller.customer.primaryCustomer.healthClassNumber","value":"1","sequence":0},
{"type":"get","key":"{customer.primaryCustomer.healthClassNumberDescriptions[Math.round(controller.customer.primaryCustomer.healthClassNumber)]}","value":"You are in pretty good health although you may have somewhat high blood pressure or cholesterol and could stand to lose some weight. You may have some history of medical conditions.","sequence":0},
{"type":"get","key":"customer.getCombinedCost()","value":231.61,"sequence":0},
{"type":"click","key":"needsController.healthAccept()","value":null,"sequence":0},
{"type":"get","key":"coverageLevel","value":"PLATINUM","sequence":5},
{"type":"get","key":"customer.capitalNeeds.getTerm(false, customer.capitalNeeds.currentScenario)","value":30,"sequence":1},
{"type":"get","key":"customer.capitalNeeds.getCoverage(false, coverageLevelIndex)","value":"$1,400,000","sequence":5},
{"type":"get","key":"customer.capitalNeeds.getTerm(false, coverageLevelIndex)","value":30,"sequence":5},
{"type":"get","key":"coverageLevelDetail","value":"Healthcare costs for your kids","sequence":21},
{"type":"get","key":"row.policies[0].monthly","value":358.05,"sequence":2},
{"type":"get","key":"needsController.email","value":"","sequence":0},
{"type":"click","key":"route.public.customizequote();","value":null,"sequence":0},
{"type":"get","key":"customizeController.customReplacementIncome1","value":"all of my salary","sequence":0},
{"type":"get","key":"customizeController.customLeaveTheNestAge","value":"the kids are 21","sequence":0},
{"type":"get","key":"customizeController.customCollegeMaxYears","value":"4 years of college","sequence":0},
{"type":"get","key":"customizeController.customPayOffDebtsPercent","value":"all of my debt","sequence":0},
{"type":"get","key":"customer.capitalNeeds.getCoverage(false, 3)","value":"$1,100,000","sequence":0},
{"type":"get","key":"customer.capitalNeeds.getTerm(false, 3)","value":20,"sequence":0},
{"type":"get","key":"needsController.email","value":"","sequence":0},
{"type":"get","key":"row.policies[0].monthly","value":152.86,"sequence":2},
{"type":"click","key":"route.public.advanced_opts()","value":null,"sequence":0},
{"type":"get","key":"customer.primaryCustomer.healthClassNumberValues[0]","value":"Fair","sequence":0},
{"type":"get","key":"customer.primaryCustomer.healthClassNumberValues[1]","value":"Good","sequence":0},
{"type":"get","key":"customer.primaryCustomer.healthClassNumberValues[2]","value":"Very Good","sequence":0},
{"type":"get","key":"customer.primaryCustomer.healthClassNumberValues[3]","value":"Excellent","sequence":0},
{"type":"get","key":"{customer.primaryCustomer.healthClassNumberDescriptions[Math.round(controller.customer.primaryCustomer.healthClassNumber)]}","value":"You are in pretty good health although you may have somewhat high blood pressure or cholesterol and could stand to lose some weight. You may have some history of medical conditions.","sequence":0},
{"type":"get","key":"customer.settings.mortalityAge","value":"90","sequence":0},
{"type":"get","key":"customer.primaryCustomer.smoker","value":false,"sequence":0},
{"type":"get","key":"customer.capitalNeeds.getExpenseChildCare().youngCost","value":"$13,000","sequence":0},
{"type":"get","key":"customer.capitalNeeds.getExpenseChildCare().oldCost","value":"$10,000","sequence":0},
{"type":"get","key":"customer.settings.retirementAge","value":"65","sequence":0},
{"type":"get","key":"customer.capitalNeeds.getAssetSavings().amount","value":"","sequence":0},
{"type":"get","key":"customer.capitalNeeds.existingInsurance","value":"","sequence":0},
{"type":"get","key":"customer.capitalNeeds.earnedIncome[1].hasHealthCare","value":false,"sequence":0},
{"type":"get","key":"customer.settings.discountRate","value":4,"sequence":0},
{"type":"get","key":"customer.settings.inflation","value":2.5,"sequence":0},
{"type":"get","key":"customer.settings.collegeInflation","value":8,"sequence":0},
{"type":"get","key":"customer.capitalNeeds.getLiabilityFinal().amount","value":"$20,000","sequence":0},
{"type":"get","key":"controller.customer.primaryCustomer.healthClassNumber","value":"1","sequence":0},
{"type":"set","key":"customer.capitalNeeds.getAssetSavings().amount","value":50000,"sequence":0},
{"type":"set","key":"customer.capitalNeeds.earnedIncome[1].hasHealthCare","value":true,"sequence":0},
{"type":"click","key":"router.history.back()","value":null,"sequence":0},
{"type":"get","key":"customizeController.customReplacementIncome1","value":"all of my salary","sequence":0},
{"type":"get","key":"customizeController.customCollegeMaxYears","value":"4 years of college","sequence":0},
{"type":"get","key":"customizeController.customPayOffDebtsPercent","value":"all of my debt","sequence":0},
{"type":"get","key":"customer.capitalNeeds.getTerm(false, 3)","value":20,"sequence":0},
{"type":"get","key":"needsController.email","value":"","sequence":0},
{"type":"get","key":"customizeController.customLeaveTheNestAge","value":"the kids are 20","sequence":0},
{"type":"get","key":"customer.capitalNeeds.getCoverage(false, 3)","value":"$700,000","sequence":0},
{"type":"get","key":"row.policies[0].monthly","value":116.81,"sequence":2},
{"type":"click","key":"applicationController.quoteSelected(row)","value":null,"sequence":2},
{"type":"get","key":"customer.selectedQuote.policies[0].carrier","value":"Allstate Life Insurance Co of New York","sequence":0},
{"type":"get","key":"customer.selectedQuote.policies[0].face","value":"$700,000","sequence":0},
{"type":"get","key":"customer.selectedQuote.policies[0].term","value":20,"sequence":0},
{"type":"get","key":"customer.selectedQuote.policies[0].monthly","value":"$117","sequence":0}]
);