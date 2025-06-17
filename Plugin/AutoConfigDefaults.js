/*
 * AutoConfigDefaults.js
 * Automatically sets certain configuration options when the game starts.
 * Place this file in your project's Plugin folder and enable it in the plugin manager.
 * Adjust the values in AutoConfig.settings to your desired defaults.
 */

var AutoConfig = {
    // Index numbers correspond to the config items defined in screen-config.js.
    // Each property below maps to one option so you can quickly see which values
    // can be changed. 0 represents the first choice shown in the config screen.
    settings: {
        musicPlay: 0,          // 0..4   Music volume
        soundEffect: 0,        // 0..4   Sound effect volume
        realBattle: 0,         // 0:Off, 1:On
        autoTurnEnd: 1,        // 0:On, 1:Off
        autoTurnSkip: 2,       // 0:Direct, 1:Quick, 2:None
        mapGrid: 1,            // 0:Show, 1:Hide
        unitSpeed: 1,          // 0:Fast, 1:Normal, 2:Slow
        messageSpeed: 1,       // 0:Fast, 1:Normal, 2:Slow
        unitMenuStatus: 0,     // 0:HP, 1:Condition
        loadCommand: 0,        // 0:Show, 1:Hide
        autoCursor: 0,         // 0:On, 1:Off
        mouseOperation: 0,     // 0:On, 1:Off
        mouseCursorTracking: 0,// 0:On, 1:Off
        voice: 0,              // 0..4   Voice volume
        realBattleScaling: 0,  // 0:Normal, 1:Zoom
        scrollSpeed: 1,        // 0:Fast, 1:Normal, 2:Slow
        enemyMarking: 0,       // 0:Show, 1:Hide
        mapUnitHpVisible: 0,   // 0:Number, 1:Gauge, 2:None
        mapUnitSymbol: 0,      // 0:Show, 1:Hide
        damagePopup: 0,        // 0:On, 1:Off
        skipControl: 0         // 0:All input, 1:Mouse, 2:None
    },

    apply: function() {
        var s = this.settings;
        root.getMetaSession().setDefaultEnvironmentValue(0,  s.musicPlay);
        root.getMetaSession().setDefaultEnvironmentValue(1,  s.soundEffect);
        root.getMetaSession().setDefaultEnvironmentValue(2,  s.realBattle);
        root.getMetaSession().setDefaultEnvironmentValue(3,  s.autoTurnEnd);
        root.getMetaSession().setDefaultEnvironmentValue(4,  s.autoTurnSkip);
        root.getMetaSession().setDefaultEnvironmentValue(5,  s.mapGrid);
        root.getMetaSession().setDefaultEnvironmentValue(6,  s.unitSpeed);
        root.getMetaSession().setDefaultEnvironmentValue(7,  s.messageSpeed);
        root.getMetaSession().setDefaultEnvironmentValue(8,  s.unitMenuStatus);
        root.getMetaSession().setDefaultEnvironmentValue(9,  s.loadCommand);
        root.getMetaSession().setDefaultEnvironmentValue(10, s.autoCursor);
        root.getMetaSession().setDefaultEnvironmentValue(11, s.mouseOperation);
        root.getMetaSession().setDefaultEnvironmentValue(12, s.mouseCursorTracking);
        root.getMetaSession().setDefaultEnvironmentValue(13, s.voice);
        root.getMetaSession().setDefaultEnvironmentValue(14, s.realBattleScaling);
        root.getMetaSession().setDefaultEnvironmentValue(15, s.scrollSpeed);
        root.getMetaSession().setDefaultEnvironmentValue(16, s.enemyMarking);
        root.getMetaSession().setDefaultEnvironmentValue(17, s.mapUnitHpVisible);
        root.getMetaSession().setDefaultEnvironmentValue(18, s.mapUnitSymbol);
        root.getMetaSession().setDefaultEnvironmentValue(19, s.damagePopup);
        root.getMetaSession().setDefaultEnvironmentValue(20, s.skipControl);
    }
};

(function() {
    var aliasSetup = SetupControl.setup;
    SetupControl.setup = function() {
        aliasSetup.call(this);
        AutoConfig.apply();
    };
})();
