var Squad = defineObject(BaseObject, {
    initialize: function() {
        this._units = [];
    },

    addUnit: function(unit) {
        if (this._units.indexOf(unit) === -1) {
            this._units.push(unit);
        }
    },

    removeUnit: function(unit) {
        var index = this._units.indexOf(unit);
        if (index !== -1) {
            this._units.splice(index, 1);
        }
    },

    getUnits: function() {
        return this._units;
    },

    getUnitCount: function() {
        return this._units.length;
    }
});

var SquadManager = {
    squads: [],

    createSquad: function() {
        var squad = createObject(Squad);
        this.squads.push(squad);
        return squad;
    },

    removeSquad: function(squad) {
        var index = this.squads.indexOf(squad);
        if (index !== -1) {
            this.squads.splice(index, 1);
        }
    },

    getSquads: function() {
        return this.squads;
    }
};
