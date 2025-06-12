/*
 * DisableHighestLevelBonus.js
 * This plugin prevents units at the highest player level from receiving
 * bonus experience. It blocks distributing bonus XP via the distribution
 * screen and event commands.
 *
 * Place this file in your project's Plugin folder and include it in the
 * plugin manager.
 */

var HighestLevelControl = {
    getHighestLevel: function() {
        var list = PlayerList.getAliveList();
        var count = list.getCount();
        var i, unit, lv = 0;

        for (i = 0; i < count; i++) {
            unit = list.getData(i);
            if (unit.getLv() > lv) {
                lv = unit.getLv();
            }
        }

        return lv;
    },

    isHighestLevelUnit: function(unit) {
        if (unit === null) {
            return false;
        }
        return unit.getLv() >= this.getHighestLevel();
    }
};

(function() {
    var aliasUnitEnabled = ExperienceDistributionScreen._isUnitEnabled;
    ExperienceDistributionScreen._isUnitEnabled = function(unit) {
        if (HighestLevelControl.isHighestLevelUnit(unit)) {
            return false;
        }
        return aliasUnitEnabled.call(this, unit);
    };

    var aliasExpAvailable = BonusInputWindow._isExperienceValueAvailable;
    BonusInputWindow._isExperienceValueAvailable = function() {
        if (HighestLevelControl.isHighestLevelUnit(this._unit)) {
            return false;
        }
        return aliasExpAvailable.call(this);
    };

    var aliasCheckEvent = ExperiencePlusEventCommand._checkEventCommand;
    ExperiencePlusEventCommand._checkEventCommand = function() {
        if (HighestLevelControl.isHighestLevelUnit(this._targetUnit)) {
            return false;
        }
        return aliasCheckEvent.call(this);
    };
})();
