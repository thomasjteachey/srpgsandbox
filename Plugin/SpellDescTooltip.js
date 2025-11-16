/*
 * SpellDescTooltip.js
 * Adds the spell (skill) description text to the spell tooltip.
 * Place this file in your project's Plugin folder and enable it in the plugin manager.
 */

(function() {
    var _aliasSetSkillInfoData = SkillInfoWindow.setSkillInfoData;
    var _aliasDrawWindowContent = SkillInfoWindow.drawWindowContent;
    var _aliasGetWindowHeight = SkillInfoWindow.getWindowHeight;

    SkillInfoWindow.setSkillInfoData = function(skill, objecttype) {
        this._spellTooltipLines = _createSpellTooltipLines(skill);
        _aliasSetSkillInfoData.call(this, skill, objecttype);
    };

    SkillInfoWindow.drawWindowContent = function(x, y) {
        _aliasDrawWindowContent.call(this, x, y);

        if (!this._spellTooltipLines || this._spellTooltipLines.length === 0) {
            return;
        }

        var textui = this.getWindowTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        var spaceY = ItemInfoRenderer.getSpaceY();
        var startY = y + _getBaseLineCount.call(this) * spaceY;
        var length = this._getTextLength();

        for (var i = 0; i < this._spellTooltipLines.length; i++) {
            TextRenderer.drawText(x, startY + (spaceY * i), this._spellTooltipLines[i], length, color, font);
        }
    };

    SkillInfoWindow.getWindowHeight = function() {
        var height = _aliasGetWindowHeight.call(this);
        if (this._spellTooltipLines && this._spellTooltipLines.length > 0) {
            height += this._spellTooltipLines.length * ItemInfoRenderer.getSpaceY();
        }

        return height;
    };

    var _createSpellTooltipLines = function(skill) {
        if (!skill || typeof skill.getDescription !== 'function') {
            return [];
        }

        var text = skill.getDescription();
        if (!text) {
            return [];
        }

        return text.split(/\r?\n/);
    };

    var _getBaseLineCount = function() {
        var count = 3;

        if (this._isInvocationType()) {
            count++;
        }

        if (this._aggregationViewer !== null) {
            count += this._aggregationViewer.getAggregationViewerCount();
        }

        return count;
    };
})();
