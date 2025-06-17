/*
 * ItemDescTooltip.js
 * Displays the item's description in the tooltip by searching
 * several possible fields when the default description is empty.
 * Place this file in your project's Plugin folder and enable it
 * in the plugin manager.
 */

(function() {
    var _aliasSetInfoItem = ItemInfoWindow.setInfoItem;
    ItemInfoRenderer._currentItemDesc = '';

    // Capture the item description whenever the info window updates.
    ItemInfoWindow.setInfoItem = function(item) {
        var desc = '';

        if (item) {
            if (typeof item.getDescription === 'function') {
                desc = item.getDescription();
            }

            if (!desc && typeof item.description === 'string') {
                desc = item.description;
            }

            if (!desc && typeof item.desc === 'string') {
                desc = item.desc;
            }

            if (!desc && item.custom) {
                if (typeof item.custom.description === 'string') {
                    desc = item.custom.description;
                }
                else if (typeof item.custom.desc === 'string') {
                    desc = item.custom.desc;
                }

                if (!desc) {
                    var pattern = /(desc|description|info|text)/i;
                    var key;
                    for (key in item.custom) {
                        if (!item.custom.hasOwnProperty(key)) {
                            continue;
                        }

                        if (typeof item.custom[key] === 'string' && pattern.test(key)) {
                            desc = item.custom[key];
                            break;
                        }
                    }
                }
            }
        }

        ItemInfoRenderer._currentItemDesc = desc;
        _aliasSetInfoItem.call(this, item);
    };

    // Replace the default description renderer to use the cached text.
    ItemSentence.Description.drawItemSentence = function(x, y) {
        var text = ItemInfoRenderer._currentItemDesc;
        if (text) {
            var textui = ItemInfoRenderer.getTextUI();
            var color = textui.getColor();
            var font = textui.getFont();
            TextRenderer.drawText(x, y, text, -1, color, font);
        }
    };

    ItemSentence.Description.getItemSentenceCount = function() {
        return ItemInfoRenderer._currentItemDesc ? 1 : 0;
    };
})();
