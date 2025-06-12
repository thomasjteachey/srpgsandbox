/*
 * InfiniteItems.js
 * This plugin prevents items from being consumed when used.
 * Place this file in your project's Plugin folder and enable it in the plugin manager.
 */

(function() {
    // Override ItemControl.decreaseItem so item durability is never reduced.
    ItemControl.decreaseItem = function(unit, item) {
        // Do nothing.
    };
})();
