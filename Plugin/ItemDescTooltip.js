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
                    var lower;
                    for (var key in item.custom) {
                        if (!item.custom.hasOwnProperty(key)) {
                            continue;
                        }
                        if (typeof item.custom[key] === 'string') {
                            lower = key.toLowerCase();
                            if (lower.indexOf('desc') !== -1 ||
                                lower.indexOf('description') !== -1 ||
                                lower.indexOf('info') !== -1 ||
                                lower.indexOf('text') !== -1) {
                                desc = item.custom[key];
                                break;
                            }
                        }
                    }
                }
            }
        }

        ItemInfoRenderer._currentItemDesc = desc;
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
