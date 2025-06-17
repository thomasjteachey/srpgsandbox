/*
 * AutoConfigDefaults.js
 * Automatically sets certain configuration options when the game starts.
 * Place this file in your project's Plugin folder and enable it in the plugin manager.
 * Adjust the values in AutoConfig.settings to your desired defaults.
 */

var AutoConfig = {
    // Index numbers correspond to the config items defined in screen-config.js.
    // Example values below:
    settings: {
        musicVolume: 0,      // 0:100%, 1:75%, 2:50%, 3:25%, 4:0%
        soundVolume: 0,      // 0:100%, 1:75%, 2:50%, 3:25%, 4:0%
        autoTurnEnd: 1,      // 0:On, 1:Off
        mapGrid: 1           // 0:Show grid, 1:Hide grid
    },

    apply: function() {
        root.getMetaSession().setDefaultEnvironmentValue(0, this.settings.musicVolume);
        root.getMetaSession().setDefaultEnvironmentValue(1, this.settings.soundVolume);
        root.getMetaSession().setDefaultEnvironmentValue(3, this.settings.autoTurnEnd);
        root.getMetaSession().setDefaultEnvironmentValue(5, this.settings.mapGrid);
    }
};

(function() {
    var aliasSetup = SetupControl.setup;
    SetupControl.setup = function() {
        aliasSetup.call(this);
        AutoConfig.apply();
    };
})();
