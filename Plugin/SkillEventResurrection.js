/*
 * SkillEventResurrection.js
 *
 * Extends the built-in resurrection helpers so that skills and events can
 * reuse the standard resurrection list UI and targeting logic without
 * requiring an item object. Install by dropping this file into the Plugin
 * directory and enabling it in the project.
 */
(function() {
    var _buildResurrection = ScreenBuilder.buildResurrection;
    ScreenBuilder.buildResurrection = function() {
        var screenParam = _buildResurrection.call(this);

        // Provide consistent slots for any caller that wants to launch the
        // resurrection screen. Items fill in the item field, while skills or
        // events can pass the originating skill or arbitrary filter data.
        screenParam.unit = null;
        screenParam.item = null;
        screenParam.skill = null;
        screenParam.filter = screenParam.filter || 0;
        screenParam.targetAggregation = screenParam.targetAggregation || null;

        return screenParam;
    };

    ResurrectionScreen._combineDeathList = function(screenParam) {
        var source = screenParam.item || screenParam.skill || null;
        var arr = ResurrectionControl.getTargetArray(screenParam.unit || null, source, screenParam);
        var list = StructureBuilder.buildDataList();

        list.setDataArray(arr);

        return list;
    };

    ResurrectionControl.getTargetArray = function(unit, source, extraData) {
        var i, j, count, list, targetUnit;
        var context = this._createTargetContext(unit || null, source || null, extraData || null);
        var listArray = FilterControl.getDeathListArray(context.filter);
        var listCount = listArray.length;
        var arr = [];

        for (i = 0; i < listCount; i++) {
            list = listArray[i];
            count = list.getCount();
            for (j = 0; j < count; j++) {
                targetUnit = list.getData(j);
                if (context.aggregation !== null && !context.aggregation.isCondition(targetUnit)) {
                    continue;
                }

                if (!this._isTargetAllowed(unit, targetUnit, source || null, extraData || null)) {
                    continue;
                }

                arr.push(targetUnit);
            }
        }

        return arr;
    };

    ResurrectionControl._createTargetContext = function(unit, source, extraData) {
        return {
            filter: this._resolveFilter(unit, source, extraData),
            aggregation: this._resolveAggregation(source, extraData)
        };
    };

    ResurrectionControl._resolveFilter = function(unit, source, extraData) {
        if (source !== null && typeof source.getFilterFlag === 'function' && unit !== null) {
            return FilterControl.getBestFilter(unit.getUnitType(), source.getFilterFlag());
        }

        if (extraData !== null && typeof extraData.filter === 'number' && extraData.filter !== 0) {
            return extraData.filter;
        }

        return this._getDefaultFilter(unit);
    };

    ResurrectionControl._resolveAggregation = function(source, extraData) {
        if (source !== null && typeof source.getTargetAggregation === 'function') {
            return source.getTargetAggregation();
        }

        if (extraData !== null && extraData.targetAggregation !== undefined) {
            return extraData.targetAggregation;
        }

        return null;
    };

    ResurrectionControl._getDefaultFilter = function(unit) {
        if (unit !== null) {
            return FilterControl.getNormalFilter(unit.getUnitType());
        }

        return UnitFilterFlag.PLAYER;
    };
})();
