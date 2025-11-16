/*
 * TerrainVariableDisplay.js
 *
 * Replaces the standard terrain map part window with the value of a
 * configurable variable. This is useful when the terrain window is not
 * needed and that screen real estate can instead be used to surface
 * information such as objectives, timers, weather, etc.
 *
 * Usage:
 *   1. Drop this file in your project's Plugin folder and enable it in the
 *      plugin manager.
 *   2. Adjust the settings inside TerrainVariableDisplaySettings below.
 *      - variablePageIndex corresponds to the variable table page shown in
 *        the Database -> Variable Table screen (0 is the first page).
 *      - variableId is the ID assigned to the variable you want to show.
 *      - labelText can be used to force a custom label; leave it empty to
 *        re-use the variable's name from the database.
 *      - prefixText / suffixText let you add additional text around the
 *        variable's value (for example "%" or "Turn ").
 *      - showLabelLine controls whether a label line is drawn above the
 *        value line.
 *      - hideWindowIfUnavailable decides if the window should disappear
 *        when the variable cannot be resolved (for example due to a typo in
 *        the ID). Set this to false to keep an empty window visible.
 *      - mapCustomProperty allows per-map overrides. Add an object with the
 *        same fields (variableId, etc.) to a map's custom parameter using
 *        this property name (defaults to "terrainVariableDisplay").
 */

var TerrainVariableDisplaySettings = {
    variablePageIndex: 0,
    variableId: 1,
    labelText: '',
    prefixText: '',
    suffixText: '',
    showLabelLine: true,
    hideWindowIfUnavailable: true,

    // Name of the custom parameter on Map Info entries that contains
    // per-map overrides. For example, set "terrainVariableDisplay" in the
    // map's custom parameter to { variableId: 3 } to show variable 3 only on
    // that map. Leave empty to disable per-map overrides entirely.
    mapCustomProperty: 'terrainVariableDisplay'
};

var TerrainVariableDisplayHelper = {
    getDisplayInfo: function() {
        var settings = this._getSettings();
        var table = this._getVariableTable(settings.variablePageIndex);
        var info = null;
        var labelText = settings.labelText;
        var index, value;

        if (table !== null) {
            index = table.getVariableIndexFromId(settings.variableId);
            if (index >= 0) {
                value = table.getVariable(index);
                if (labelText === '' && settings.showLabelLine) {
                    labelText = table.getVariableName(index);
                }
                info = {
                    label: labelText,
                    valueText: this._formatValue(value, settings)
                };
            }
        }

        if (info === null && settings.hideWindowIfUnavailable) {
            return null;
        }

        if (info === null) {
            info = {
                label: labelText,
                valueText: this._formatValue('', settings)
            };
        }

        return info;
    },

    isDisplayAvailable: function() {
        return this.getDisplayInfo() !== null;
    },

    getLineCount: function() {
        return this._getSettings().showLabelLine ? 2 : 1;
    },

    _formatValue: function(value, settings) {
        var text = '';

        if (typeof value === 'number') {
            text = value.toString();
        }
        else if (typeof value === 'string') {
            text = value;
        }
        else if (value === null || typeof value === 'undefined') {
            text = '';
        }
        else {
            text = '' + value;
        }

        return settings.prefixText + text + settings.suffixText;
    },

    _getVariableTable: function(index) {
        var max = root.getMetaSession().getVariableTableCount ? root.getMetaSession().getVariableTableCount() : 6;

        if (typeof index !== 'number') {
            return null;
        }

        if (index < 0) {
            index = 0;
        }
        else if (index >= max) {
            index = max - 1;
        }

        return root.getMetaSession().getVariableTable(index);
    },

    _getSettings: function() {
        var mapOverride = this._getMapOverride();

        if (mapOverride === null) {
            return TerrainVariableDisplaySettings;
        }

        return this._mergeSettings(TerrainVariableDisplaySettings, mapOverride);
    },

    _getMapOverride: function() {
        var session, mapInfo, custom, key;
        var propertyName = TerrainVariableDisplaySettings.mapCustomProperty;

        if (typeof propertyName !== 'string' || propertyName === '') {
            return null;
        }

        if (typeof root.getCurrentSession !== 'function') {
            return null;
        }

        session = root.getCurrentSession();
        if (session === null) {
            return null;
        }

        if (typeof session.getCurrentMapInfo !== 'function') {
            return null;
        }

        mapInfo = session.getCurrentMapInfo();
        if (mapInfo === null) {
            return null;
        }

        custom = mapInfo.custom;
        if (!custom || typeof custom !== 'object') {
            return null;
        }

        key = custom[propertyName];
        if (!key || typeof key !== 'object') {
            return null;
        }

        return key;
    },

    _mergeSettings: function(baseSettings, override) {
        var merged = {};
        var key;

        for (key in baseSettings) {
            if (baseSettings.hasOwnProperty(key)) {
                merged[key] = baseSettings[key];
            }
        }

        for (key in override) {
            if (override.hasOwnProperty(key)) {
                merged[key] = override[key];
            }
        }

        return merged;
    }
};

(function() {
    MapParts.Terrain._drawContent = function(x, y, terrain) {
        var info = TerrainVariableDisplayHelper.getDisplayInfo();
        var textui = this._getWindowTextUI();
        var font = textui.getFont();
        var color = textui.getColor();
        var length = this._getTextLength();

        if (info === null) {
            return;
        }

        x += 2;
        if (TerrainVariableDisplaySettings.showLabelLine && info.label !== '') {
            TextRenderer.drawText(x, y, info.label, length, color, font);
            y += this.getIntervalY();
        }

        TextRenderer.drawText(x, y, info.valueText, length, color, font);
    };

    MapParts.Terrain._getPartsCount = function(terrain) {
        if (!TerrainVariableDisplayHelper.isDisplayAvailable()) {
            return 0;
        }

        return TerrainVariableDisplayHelper.getLineCount();
    };

    MapParts.Terrain._getWindowHeight = function() {
        if (!TerrainVariableDisplayHelper.isDisplayAvailable()) {
            return 0;
        }

        return 12 + (TerrainVariableDisplayHelper.getLineCount() * this.getIntervalY());
    };
})();
