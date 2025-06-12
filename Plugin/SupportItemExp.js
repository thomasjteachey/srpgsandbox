/*
 * SupportItemExp.js
 * Grants 25 experience when a wand (support item) is used on another unit.
 * Place this file in your project's Plugin folder and enable it in the plugin manager.
 */

(function() {
    var alias = BaseItemUse._getItemExperience;
    BaseItemUse._getItemExperience = function(itemUseParent) {
        var itemTargetInfo = itemUseParent.getItemTargetInfo();
        var user = itemTargetInfo.unit;
        var target = itemTargetInfo.targetUnit;
        var item = itemTargetInfo.item;

        if (item && item.isWand && item.isWand() && target !== null && user !== target) {
            return ExperienceCalculator.getBestExperience(user, 25);
        }

        return alias.call(this, itemUseParent);
    };
})();
