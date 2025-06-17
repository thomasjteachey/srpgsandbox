/*
 * ItemDescTooltip.js
 * Shows state descriptions in item tooltips and falls back
 * to the item's own description if a state lacks one.
 * Place this file in your project's Plugin folder and enable it in the plugin manager.
 */

(function() {
    // Keep track of which item is being rendered so we can always
    // display its description along with any state descriptions.
    var _aliasSetInfoItem = ItemInfoWindow.setInfoItem;
    ItemInfoRenderer._currentItem = null;
    ItemInfoRenderer._currentItemDesc = '';
    ItemInfoRenderer._descShown = false;
    ItemInfoRenderer._descAddedToCount = false;
    ItemInfoWindow.setInfoItem = function(item) {
        ItemInfoRenderer._currentItem = item;
        ItemInfoRenderer._currentItemDesc = (item && typeof item.getDescription === 'function') ? item.getDescription() : '';
        ItemInfoRenderer._descShown = false;
        ItemInfoRenderer._descAddedToCount = false;
        _aliasSetInfoItem.call(this, item);
    };
    var getStateDescriptionText = function(state) {
        var text = '';

        if (typeof state.getDescription === 'function') {
            text = state.getDescription();
        }

        if (!text && state.custom) {
            if (typeof state.custom.description === 'string') {
                text = state.custom.description;
            }
            else if (typeof state.custom.desc === 'string') {
                text = state.custom.desc;
            }
        }

        return text || '';
    };
    var _aliasItemInfoRendererGetStateCount = ItemInfoRenderer.getStateCount;
    ItemInfoRenderer.getStateCount = function(stateGroup) {
        var count = _aliasItemInfoRendererGetStateCount.call(this, stateGroup);
        var refList, i, state, desc;

        if (!stateGroup.isAllBadState()) {
            refList = stateGroup.getStateReferenceList();
            for (i = 0; i < refList.getTypeCount(); i++) {
                state = refList.getTypeData(i);
                if (state.isHidden()) {
                    continue;
                }
                desc = getStateDescriptionText(state);
                if (desc === '') {
                    if (ItemInfoRenderer._currentItem && typeof ItemInfoRenderer._currentItem.getDescription === 'function') {
                        desc = ItemInfoRenderer._currentItem.getDescription();
                    }
                }
                if (desc !== '') {
                    count++;
                }
            }
        }

        if (!ItemInfoRenderer._descAddedToCount && ItemInfoRenderer._currentItemDesc) {
            count++;
            ItemInfoRenderer._descAddedToCount = true;
        }

        return count;
    };
    ItemInfoRenderer.drawState = function(x, y, stateGroup, isRecovery) {
        var text;
        var textui = this.getTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        var spaceX = ItemInfoRenderer.getSpaceX();
        var spaceY = this.getSpaceY();
        var i, state, desc;
        var refList;

        if (this.getStateCount(stateGroup) === 0) {
            return;
        }

        if (isRecovery) {
            text = StringTable.State_Recovery;
        }
        else {
            text = StringTable.State_Regist;
        }

        ItemInfoRenderer.drawKeyword(x, y, text);
        x += spaceX;

        if (!ItemInfoRenderer._descShown && ItemInfoRenderer._currentItemDesc) {
            TextRenderer.drawText(x, y, ItemInfoRenderer._currentItemDesc, -1, color, font);
            y += spaceY;
            ItemInfoRenderer._descShown = true;
        }

        if (stateGroup.isAllBadState()) {
            TextRenderer.drawKeywordText(x, y, StringTable.State_AllBadState, -1, color, font);
            return;
        }

        refList = stateGroup.getStateReferenceList();
        for (i = 0; i < refList.getTypeCount(); i++) {
            state = refList.getTypeData(i);
            if (state.isHidden()) {
                continue;
            }
            TextRenderer.drawKeywordText(x, y, state.getName(), -1, color, font);
            y += spaceY;
            desc = getStateDescriptionText(state);
            if (desc === '') {
                if (ItemInfoRenderer._currentItem && typeof ItemInfoRenderer._currentItem.getDescription === 'function') {
                    desc = ItemInfoRenderer._currentItem.getDescription();
                }
            }
            if (desc !== '') {
                TextRenderer.drawText(x + spaceX, y - spaceY, desc, -1, color, font);
                y += spaceY;
            }
        }
    };

})();
