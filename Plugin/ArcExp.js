ExperienceCalculator._getExperience = function(data, baseExp) 
{
	var n;
	var lv = data.passive.getLv() - data.active.getLv();
	
	if (data.passiveHp > 0) {
		// If the opponent cannot be beaten, add the level difference.
		n = baseExp + lv;
	}
	else 
	{
		if (lv > 0) 
		{
			// If the level is bigger than the opponent, increase by 8 according to the difference.
			n = lv * 8;
		}
		else 
		{
			// If the level is smaller than the opponent, decrease by 12 according to the difference (Iv is minus so decrease).
			n = lv * 12;
		}
	}
		
	if (data.active.getClass().getClassRank() === data.passive.getClass().getClassRank()) {
		// Battle between low class, or high class, no adjust the exp any more.
		return n;
	}
	
	if (data.active.getClass().getClassRank() === ClassRank.LOW) {
		// Process if the low class attacked high class.
		n = Math.floor(n * (DataConfig.getLowExperienceFactor() / 100));
	}
	else {
		// Process if the high class attacked low class.
		n = Math.floor(n * (DataConfig.getHighExperienceFactor() / 100));
	}
	
	return n;
};