/*
 * TurnChangeResourceToggle.js
 *
 * Dynamically hides/shows these resources during turn changes:
 *   - turnchange (sound)
 *   - playerturn_frame (UI frame)
 *   - enemyturn_frame (UI frame)
 *
 * Set `mode` to decide which game state controls the toggle.
 * If the chosen source resolves to true, the resources are treated as "none".
 */

var TurnChangeResourceToggle = {
	settings: {
		// 'map-custom' | 'global-variable' | 'global-switch' | 'local-switch'
		mode: 'map-custom',

		// Used when mode === 'map-custom'
		// Example map custom parameter: { disableTurnChangeResources: true }
		mapCustomKey: 'disableTurnChangeResources',

		// Used when mode === 'global-variable'
		// variableTableId is 1..6, variableIndex is 0-based index in that table.
		variableTableId: 1,
		variableIndex: 0,

		// Used when mode === 'global-switch' or 'local-switch'
		// switchIndex is 0-based index in the switch table.
		switchIndex: 0,

		// If true, reverse ON/OFF meaning.
		invert: false
	},

	isDisabled: function() {
		var disabled = false;
		var session = root.getCurrentSession();
		var mapInfo = session !== null ? session.getCurrentMapInfo() : null;
		var mode = this.settings.mode;

		if (mode === 'map-custom') {
			if (mapInfo !== null && mapInfo.custom) {
				disabled = !!mapInfo.custom[this.settings.mapCustomKey];
			}
		}
		else if (mode === 'global-variable') {
			disabled = this._isGlobalVariableOn();
		}
		else if (mode === 'global-switch') {
			disabled = this._isGlobalSwitchOn();
		}
		else if (mode === 'local-switch') {
			disabled = this._isLocalSwitchOn();
		}

		if (this.settings.invert) {
			disabled = !disabled;
		}

		return disabled;
	},

	_isGlobalVariableOn: function() {
		var tableIndex = this.settings.variableTableId - 1;
		var index = this.settings.variableIndex;
		var table = root.getMetaSession().getVariableTable(tableIndex);

		if (table === null || index < 0 || index >= table.getVariableCount()) {
			return false;
		}

		return table.getVariable(index) !== 0;
	},

	_isGlobalSwitchOn: function() {
		var index = this.settings.switchIndex;
		var table = root.getMetaSession().getGlobalSwitchTable();

		if (table === null || index < 0 || index >= table.getSwitchCount()) {
			return false;
		}

		return table.isSwitchOn(index);
	},

	_isLocalSwitchOn: function() {
		var session = root.getCurrentSession();
		var mapInfo = session !== null ? session.getCurrentMapInfo() : null;
		var table = mapInfo !== null ? mapInfo.getLocalSwitchTable() : null;
		var index = this.settings.switchIndex;

		if (table === null || index < 0 || index >= table.getSwitchCount()) {
			return false;
		}

		return table.isSwitchOn(index);
	}
};

(function() {
	var _aliasQueryUI = root.queryUI;
	root.queryUI = function(name) {
		if (TurnChangeResourceToggle.isDisabled()) {
			if (name === 'playerturn_frame' || name === 'enemyturn_frame') {
				return null;
			}
		}

		return _aliasQueryUI.call(this, name);
	};

	var _aliasSoundDirect = MediaControl.soundDirect;
	MediaControl.soundDirect = function(name) {
		if (TurnChangeResourceToggle.isDisabled() && name === 'turnchange') {
			return;
		}

		return _aliasSoundDirect.call(this, name);
	};
})();
