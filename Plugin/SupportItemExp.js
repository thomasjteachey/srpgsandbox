
/*
 * SupportItemExp.js
 * Grants 25 experience whenever a wand (support item) is used.
 * Place this file in your project's Plugin folder and enable it in the plugin manager.
 */

(function() {
    var alias = ItemExpFlowEntry._getItemExperience;

    ItemExpFlowEntry._getItemExperience = function(itemUseParent) {
		return 25;
    };
	
    BaseItemUse._getItemExperience = function(itemUseParent) {
		return 25;
    };
	
})();