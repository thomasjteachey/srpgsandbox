/*
 * StateTooltipInfo.js
 * Shows state descriptions in item tooltips.
 * Falls back to parameter bonus text if the state has no description.
 * Place this file in your project's Plugin folder and enable it in the plugin manager.
 */

(function() {
    var getStateBonusText = function(state) {
        var arr = [];
        var count = ParamGroup.getParameterCount();
        for (var i = 0; i < count; i++) {
            var val = ParamGroup.getDopingParameter(state, i);
            if (val !== 0) {
                var sign = val > 0 ? '+' : '';
                arr.push(sign + val + ' ' + ParamGroup.getParameterName(i));
            }
        }
        return arr.join(', ');
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
                    desc = getStateBonusText(state);
                }
                if (desc !== '') {
                    count++;
                }
            }
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
                desc = getStateBonusText(state);
            }
            if (desc !== '') {
                TextRenderer.drawText(x + spaceX, y - spaceY, desc, -1, color, font);
                y += spaceY;
            }
        }
    };

    var _aliasItemSentenceInfoDraw = ItemSentence.Info.drawItemSentence;
    ItemSentence.Info.drawItemSentence = function(x, y, item) {
        var text, textui, color, font;

        text = typeof item.getDescription === 'function' ? item.getDescription() : '';
        if (text) {
            textui = ItemInfoRenderer.getTextUI();
            color = textui.getColor();
            font = textui.getFont();
            TextRenderer.drawText(x, y, text, -1, color, font);
            y += ItemInfoRenderer.getSpaceY();
        }

        _aliasItemSentenceInfoDraw.call(this, x, y, item);
    };

    var _aliasItemSentenceInfoCount = ItemSentence.Info.getItemSentenceCount;
    ItemSentence.Info.getItemSentenceCount = function(item) {
        var count = _aliasItemSentenceInfoCount.call(this, item);
        var text = typeof item.getDescription === 'function' ? item.getDescription() : '';

        return count + (text ? 1 : 0);
    };
})();
