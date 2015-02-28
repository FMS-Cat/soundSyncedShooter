linearEnemyGeometry = new THREE.TetrahedronGeometry( 1 );

var LinearEnemy = function( _p ){

	this.velocity = new THREE.Vector3( 0, -.1, 0 );
	this.vRotate = new THREE.Vector3( .04, .04, 0 );

	var p = merge( {
		life : 4,
		damageable : true,
		color : new THREE.Color( .2, .8, .5 ),
		light : true
	}, _p );

	Enemy.call( this, p );

	this.modelMain = new THREE.Mesh( linearEnemyGeometry, enemyMaterial.clone() );
	this.model.add( this.modelMain );

};

LinearEnemy.prototype = Object.create( Enemy.prototype );
LinearEnemy.prototype.constructor = LinearEnemy;

LinearEnemy.prototype.beat = function(){

	if( Math.random() < .1 && !player.missing && isInScreen( this.position, 0 ) && this.birthScale < .02 ){
		this.shot();
	}

};

LinearEnemy.prototype.shot = function(){

	Enemy.prototype.shot.call( this );

	enemies.push( new Bullet( {
		position : this.position.clone(),
		bulletType : 11,
		velocity : player.position.clone().sub( this.position ).normalize().multiplyScalar( .1 ),
		birthAccel : 3
	} ) );

	playSample( samples['roomDrum5'] );

}

LinearEnemy.prototype.loop = function(){

	var sup = Enemy.prototype.loop.call( this );
	if( sup != 'success' ){
		return sup;
	}

	if( this.birthScale < .02 ){
		this.hazard = true;
	}

	this.position.add( this.velocity );

	this.model.rotation.x += this.vRotate.x*(1+this.damageScale);
	this.model.rotation.y += this.vRotate.y*(1+this.damageScale);
	this.model.scale.copy( scaleVector( (1+this.damageScale*.2+this.shotScale*.4)*(1-this.birthScale) ) );

	var col = this.color.clone().lerp( new THREE.Color( 1, 1, 1 ), this.shotScale*.4+this.damageScale*.5 );
	this.modelMain.material.color = col;
	this.modelMain.material.emissive = col.multiplyScalar(.6);
	this.light.color = col;
	this.light.intensity = this.lightPower*(1-this.birthScale)*( 1+this.damageScale*.5+this.shotScale );

};

LinearEnemy.prototype.onDamage = function( _point ){

	var sup = Enemy.prototype.onDamage.call( this, _point );
	if( sup != 'success' ){
		return sup;
	}

	enemies.push( new Particle( {
		position : _point.clone(),
		velocity : new THREE.Vector3( -Math.cos( player.angle ), -Math.sin( player.angle ), 0 ).multiplyScalar( .2 ).add( this.velocity ).add( randomVec3( .05 ) ),
		color : this.color.clone(),
		scale : .2
	} ) );

	playSample( samples['hihat909'+~~(Math.random()*3)] );

};

LinearEnemy.prototype.onDeath = function(){

	Enemy.prototype.onDeath.call( this );

	for( var i=0; i<9; i++ ){
		enemies.push( new Particle( {
			position : this.position.clone(),
			velocity : randomVec3( .1 ),
			color : this.color.clone(),
			scale : .4
		} ) );
	}
	enemies.push( new Particle( {
		position : this.position.clone(),
		color : this.color.clone(),
		scale : .4,
		light : true,
		lightPower : 4.5
	} ) );

	playSample( samples['hihat909open'] );

};
