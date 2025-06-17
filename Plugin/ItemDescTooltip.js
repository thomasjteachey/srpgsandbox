/*
 * ItemDescTooltip.js
 * Displays only the item's description in the tooltip and
 * ignores any state descriptions.
 * Place this file in your project's Plugin folder and enable it in the plugin manager.
 */

(function() {
    var _aliasSetInfoItem = ItemInfoWindow.setInfoItem;
    ItemInfoRenderer._currentItemDesc = '';
    ItemInfoWindow.setInfoItem = function(item) {
        ItemInfoRenderer._currentItemDesc = (item && typeof item.getDescription === 'function') ? item.getDescription() : '';
        _aliasSetInfoItem.call(this, item);
    };

    ItemInfoRenderer.getStateCount = function() {
        return ItemInfoRenderer._currentItemDesc ? 1 : 0;
    };

    ItemInfoRenderer.drawState = function(x, y) {
        var textui = this.getTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        if (ItemInfoRenderer._currentItemDesc) {
            TextRenderer.drawText(x, y, ItemInfoRenderer._currentItemDesc, -1, color, font);
        }
    };
})();
