/*
Custom EXP Gain Script (for all unit types):
- On HIT (not miss/0-damage):
  - +50 EXP if attacker is lower level
  - +25 EXP if same level
  - +0 EXP if higher level
- On KILL:
  - +100 EXP if enemy is same or higher level
  - +0 EXP if enemy is lower level
- No EXP if miss or 0 damage
*/

// HIT (non-lethal) EXP
ExperienceCalculator._getNormalValue = function(data) {
    var attacker = data.active;
    var target = data.passive;

    var attackerLevel = attacker.getLv();
    var targetLevel = target.getLv();

    if (attackerLevel < targetLevel) {
        return 50;
    } else if (attackerLevel === targetLevel) {
        return 25;
    }

    return 0; // Higher level than target
};

// KILL (lethal attack) EXP
ExperienceCalculator._getVictoryExperience = function(data) {
    var attacker = data.active;
    var target = data.passive;

    var attackerLevel = attacker.getLv();
    var targetLevel = target.getLv();

    if (targetLevel >= attackerLevel) {
        return 100;
    } else {
        return 0; // No EXP if attacker is higher level
    }
};

// No EXP on miss or 0 damage
ExperienceCalculator._getNoDamageExperience = function(data) {
    return 0;
};
// Override the default EXP gain function to apply to all units
ExperienceControl.addExperience = function(unit, exp) {
    if (!unit || unit.getClass().getExpSetting() === ExperienceSetting.NONE) {
        return;
    }

    var growth = unit.getClass().getExpSetting();
    var curExp = unit.getExp();
    var totalExp = curExp + exp;
    var levelUpCount = 0;

    // Loop for possible multiple level-ups
    while (totalExp >= 100) {
        if (unit.getLv() >= unit.getClass().getMaxLv()) {
            totalExp = 0;
            break;
        }

        totalExp -= 100;
        unit.setLv(unit.getLv() + 1);
        levelUpCount++;
    }

    unit.setExp(totalExp);

    // Play level-up animation for visible units only
    if (levelUpCount > 0 && unit.isCommandDisplayable()) {
        var generator = root.getEventGenerator();
        generator.levelupUnit(unit, levelUpCount);
        generator.execute();
    }
};
