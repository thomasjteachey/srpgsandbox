ClassChangeEventCommand.mainEventCommand = function() {
		var count;
		var mhpPrev = ParamBonus.getMhp(this._targetUnit);
		
		Miscellaneous.changeClass(this._targetUnit, this._targetClass);
		autoEquipClassChange(this._targetUnit);
		Miscellaneous.changeHpBonus(this._targetUnit, mhpPrev);
		
		// Increase the number of class changed.
		count = this._targetUnit.getClassUpCount();
		this._targetUnit.setClassUpCount(count + 1);
	};
	
MultiClassInfoWindow.setClass = function(classEntry) {
		if (this._animeRenderParam !== null) {
			this._animeRenderParam.alpha = 255;
		}
		else {
			this._unitRenderParam.alpha = 255;
		}
		
		Miscellaneous.changeClass(this._unit, classEntry.cls);
		autoEquipClassChange(this._unit);
		this._unit.setHp(ParamBonus.getMhp(this._unit));
	};

var autoEquipClassChange = function(unit) {
	var unitId = unit.getId()
  try { root.log("[AutoEquip] Called for unit ID: " + unitId); } catch (e) {}

  if (!unit) {
    try { root.log("[AutoEquip] No unit found with ID: " + unitId); } catch (e) {}
    return;
  }

  var cls = unit.getClass();
  try {
    root.log("[AutoEquip] Found unit: " + unit.getName() + " (Class: " + cls.getName() + ")");
    root.log("[AutoEquip] Clearing inventory...");
  } catch (e) {}

  for (var i = DataConfig.getMaxUnitItemCount() - 1; i >= 0; i--) {
    var item = UnitItemControl.getItem(unit, i);
    if (item) {
      ItemControl.deleteItem(unit, item);
    }
  }

  try { root.log("[AutoEquip] Inventory cleared."); } catch (e) {}

  var itemList = root.getBaseData().getWeaponList();
  var count = itemList.getCount();
  var slot = 0;

  try { root.log("[AutoEquip] Scanning " + count + " items..."); } catch (e) {}

  for (var i = 0; i < count; i++) {
    if (slot >= DataConfig.getMaxUnitItemCount()) break;

    var item = itemList.getData(i);
    if (!item) continue;

    var usable = ItemControl.isWeaponAvailable(unit, item);
    try {
      root.log("  → " + item.getName() + ": weapon usable? " + usable);
    } catch (e) {}

    if (usable) {
      unit.setItem(slot++, item);
      try { root.log("   ↳ Equipped: " + item.getName()); } catch (e) {}
    }
  }

  // Add usable non-weapon items as well
  var miscList = root.getBaseData().getItemList();
  var miscCount = miscList.getCount();

  try { root.log("[AutoEquip] Scanning " + miscCount + " usable items..."); } catch (e) {}

  for (var i = 0; i < miscCount; i++) {
    if (slot >= DataConfig.getMaxUnitItemCount()) break;

    var misc = miscList.getData(i);
    if (!misc) continue;

    var miscUsable = ItemControl.isItemUsable(unit, misc);
    try {
      root.log("  → " + misc.getName() + ": item usable? " + miscUsable);
    } catch (e) {}

    if (miscUsable) {
      unit.setItem(slot++, misc);
      try { root.log("   ↳ Added: " + misc.getName()); } catch (e) {}
    }
  }

  try { root.log("[AutoEquip] Done equipping " + unit.getName()); } catch (e) {}
}; 

var autoEquipParty = function() {
  var list = PlayerList.getAliveList();
  var count = list.getCount();
  for (var i = 0; i < count; i++) {
    autoEquipClassChange(list.getData(i));
  }
};

(function() {
  var _mapStartComplete = MapStartFlowEntry._completeMemberData;
  MapStartFlowEntry._completeMemberData = function(scene) {
    var result = _mapStartComplete.call(this, scene);
    autoEquipParty();
    return result;
  };

  var _mapEndAction = MapEndFlowEntry._doEndAction;
  MapEndFlowEntry._doEndAction = function() {
    autoEquipParty();
    if (_mapEndAction) {
      _mapEndAction.call(this);
    }
  };
})();
