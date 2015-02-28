var EnemyGroup = function( _c, _baseScore, _bonusScore, _sample ){

	this.enemyCount = _c;
	this.enemyKilled = 0;

	this.baseScore = _baseScore;
	this.bonusScore = _bonusScore;
	this.sample = _sample;

}

EnemyGroup.prototype.score = function( _v ){

	score += this.baseScore;
	this.enemyKilled ++;

	if( this.baseScore !== 0 ){
		enemies.push( new Score( {
			position : _v.clone(),
			string : String( this.baseScore ),
			scale : .1,
			lifeDecay : .85
		} ) );
	}

	if( this.enemyKilled == this.enemyCount ){
		score += this.bonusScore;
		if( this.sample ){
			playSample( samples[this.sample] );
		}

		if( this.bonusScore !== 0 ){
			enemies.push( new Score( {
				position : _v.clone().add( new THREE.Vector3( 0, 1.2, 0 ) ),
				string : String( this.bonusScore ),
				scale : .3,
				lifeDecay : .95
			} ) );
		}
	}

};
