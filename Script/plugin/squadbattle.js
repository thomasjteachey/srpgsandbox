var SquadBattle = {
    engage: function(attackerSquad, defenderSquad) {
        var attackers = attackerSquad.getUnits();
        var defenders = defenderSquad.getUnits();
        var i, unit, target;

        // Attackers perform actions
        for (i = 0; i < attackers.length; i++) {
            unit = attackers[i];
            if (unit === null) {
                continue;
            }

            // If unit is equipped with a wand, heal a random ally
            var item = ItemControl.getEquippedWeapon(unit);
            if (item !== null && item.isWand && item.isWand()) {
                target = attackers[Math.floor(Math.random() * attackers.length)];
                this._heal(unit, target, item);
            }
            else if (item !== null) {
                target = defenders[Math.floor(Math.random() * defenders.length)];
                this._attack(unit, target, item);
            }
        }

        // Defenders act in return
        for (i = 0; i < defenders.length; i++) {
            unit = defenders[i];
            if (unit === null) {
                continue;
            }

            var item = ItemControl.getEquippedWeapon(unit);
            if (item !== null && item.isWand && item.isWand()) {
                target = defenders[Math.floor(Math.random() * defenders.length)];
                this._heal(unit, target, item);
            }
            else if (item !== null) {
                target = attackers[Math.floor(Math.random() * attackers.length)];
                this._attack(unit, target, item);
            }
        }
    },

    _attack: function(attacker, target, weapon) {
        var atk = ParamGroup.getUnitValue(attacker, ParamType.POW) + weapon.getPow();
        var def = ParamGroup.getUnitValue(target, ParamType.DEF);
        var damage = atk - def;
        if (damage < 0) {
            damage = 0;
        }
        target.setHp(target.getHp() - damage);
    },

    _heal: function(unit, target, wand) {
        var recovery = wand.getRecoveryValue();
        var maxHp = ParamBonus.getMhp(target);
        var hp = target.getHp() + recovery;
        if (hp > maxHp) {
            hp = maxHp;
        }
        target.setHp(hp);
    }
};
