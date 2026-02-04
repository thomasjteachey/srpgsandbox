// Plugin_AlwaysAllowItems.js
// put in Project/Plugin/ and make sure it's enabled

(function() {
    // hard override: let the item menu use ANY item
    ItemSelectMenu._isItemUsable = function(item) {
        return true;
    };
})();


/*
 * Plugin_ResurrectionIncludeErased.js
 *
 * SRPG Studio's default item-resurrection.js only revives units whose
 * alive state is exactly AliveType.DEATH.
 * But many projects knock out players as ERASE or INJURY instead.
 *
 * This plugin replaces ResurrectionControl.getTargetArray so it treats
 * any unit whose alive state is NOT AliveType.ALIVE as revivable
 * (DEATH, ERASE, or INJURY), while still respecting the item's
 * "Effective Targets" / "Only: Player / Ally / Guest" settings.
 */

(function() {

    ResurrectionControl.getTargetArray = function(unit, item) {
        var i, j, count, list, targetUnit;
        var arr = [];

        // look through all sides' *main* lists
        var listArray = [
            PlayerList.getMainList(),
            AllyList.getMainList(),
            EnemyList.getMainList()
        ];

        // this is the thing that enforces your "Only: Player / Ally / Guest"
        var aggregation = item.getTargetAggregation();

        for (i = 0; i < listArray.length; i++) {
            list = listArray[i];
            if (!list) {
                continue;
            }

            count = list.getCount();
            for (j = 0; j < count; j++) {
                targetUnit = list.getData(j);
                if (!targetUnit) {
                    continue;
                }

                // stock SRPG Studio only checked "=== AliveType.DEATH"
                // here we accept ANYTHING that isn't alive
                var state = targetUnit.getAliveState();
                if (state === AliveType.ALIVE) {
                    continue;
                }

                // still honor the item's own target condition
                if (aggregation && !aggregation.isCondition(targetUnit)) {
                    continue;
                }

                // hook for other plugins – keep it always true here
                if (!this._isTargetAllowed(unit, targetUnit, item)) {
                    continue;
                }

                arr.push(targetUnit);
            }
        }

        return arr;
    };

})();
