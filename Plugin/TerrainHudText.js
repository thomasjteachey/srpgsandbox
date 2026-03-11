/*
 * TerrainHudText.js
 * Replaces the terrain window name with a custom map parameter.
 *
 * Map custom parameter:
 *   { terrainHudText: "Label: {var:7}" }
 *
 * {var:7} will be replaced with the value of variable ID 7 on variable page 1.
 * Use a static string to display static text.
 */

(function() {
    var _aliasDrawContent = MapParts.Terrain._drawContent;

    var TerrainHudText = {
        _getCustomText: function() {
            var session = root.getCurrentSession();
            var mapInfo = session ? session.getCurrentMapInfo() : null;
            var custom = mapInfo && mapInfo.custom ? mapInfo.custom : null;

            if (!custom || typeof custom.terrainHudText !== 'string') {
                return null;
            }

            return this._resolveVariables(custom.terrainHudText);
        },

        _resolveVariables: function(text) {
            return text.replace(/\{var:(\d+)\}/g, function(match, idText) {
                var id = Number(idText);
                var table = root.getMetaSession().getVariableTable(0);
                var index = table.getVariableIndexFromId(id);

                if (index < 0) {
                    return '0';
                }

                return table.getVariable(index).toString();
            });
        }
    };

    MapParts.Terrain._drawContent = function(x, y, terrain) {
        var text;
        var textui;
        var font;
        var color;
        var length;
        var customText;

        if (terrain === null) {
            return;
        }

        customText = TerrainHudText._getCustomText();
        if (customText === null) {
            _aliasDrawContent.call(this, x, y, terrain);
            return;
        }

        textui = this._getWindowTextUI();
        font = textui.getFont();
        color = textui.getColor();
        length = this._getTextLength();

        x += 2;
        TextRenderer.drawText(x, y, customText, length, color, font);
    };

    var _aliasGetWindowHeight = MapParts.Terrain._getWindowHeight;
    MapParts.Terrain._getWindowHeight = function() {
        var xCursor;
        var yCursor;
        var terrain;
        var customText;

        xCursor = this.getMapPartsX();
        yCursor = this.getMapPartsY();
        terrain = PosChecker.getTerrainFromPos(xCursor, yCursor);

        if (terrain === null) {
            return 0;
        }

        customText = TerrainHudText._getCustomText();
        if (customText === null) {
            return _aliasGetWindowHeight.call(this);
        }

        return 12 + this.getIntervalY();
    };
})();
