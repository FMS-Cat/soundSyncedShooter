middleBossSmallGeometry = new THREE.TorusGeometry( .7, .4, 16, 16 );

var MiddleBossSmall = function( _p ){

	this.invertAim = false;
	this.groupId = 0;

	var p = merge( {
		life : 4,
		damageable : true,
		color : new THREE.Color( .5, .1, .2 ),
		light : true
	}, _p );

	Enemy.call( this, p );

	this.velocity = new THREE.Vector3( .07, 0, 0 );

	this.modelMain = new THREE.Mesh( middleBossSmallGeometry, enemyMaterial.clone() );
	this.model.add( this.modelMain );

};

MiddleBossSmall.prototype = Object.create( Enemy.prototype );
MiddleBossSmall.prototype.constructor = MiddleBossSmall;

MiddleBossSmall.prototype.beat = function(){

	if( (step+this.groupId)%6 == 0 && isInScreen( this.position, 0 ) && this.birthScale<.02 ){
		this.shot();
	}

};

MiddleBossSmall.prototype.shot = function(){

	Enemy.prototype.shot.call( this );

	for( var i=0; i<3; i++ ){
		enemies.push( new Bullet( {
			position : this.position.clone().add( new THREE.Vector3( 0, this.invertAim?.9:-.9, 0 ) ),
			bulletType : 1,
			velocity : new THREE.Vector3( 0, this.invertAim?.12:-.12, 0 ).applyAxisAngle( new THREE.Vector3( 0, 0, 1 ), i*.3-.3 ),
			birthAccel : 2
		} ) );
	}

	playSample( samples['ties'+~~(Math.random()*4)] );

};

MiddleBossSmall.prototype.loop = function(){

	var sup = Enemy.prototype.loop.call( this );
	if( sup != 'success' ){
		return sup;
	}

	if( this.birthScale < .02 ){
		this.hazard = true;
	}

	this.position.add( this.velocity );

	this.model.rotation.x += .04;
	this.model.rotation.y += .03;
	this.model.scale.copy( scaleVector( (1+this.damageScale*.2+this.shotScale*.4)*(1-this.birthScale) ) );

	var col = this.color.clone().lerp( new THREE.Color( 1, 1, 1 ), this.shotScale*.4+this.damageScale*.5 );
	this.modelMain.material.color = col;
	this.modelMain.material.emissive = col.multiplyScalar(.6);
	this.light.color = col;
	this.light.intensity = this.lightPower*(1-this.birthScale)*( 1+this.damageScale*.5+this.shotScale );

};

MiddleBossSmall.prototype.onDamage = function( _point ){

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

	playSample( samples['tom808'+~~(Math.random()*3)] );
};

MiddleBossSmall.prototype.onDeath = function(){

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

	playSample( samples['snareLinn'] );

};
