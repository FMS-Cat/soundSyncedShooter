missileGeometry = new THREE.CylinderGeometry( 0, .7, 1.4, 3 );

var Missile = function( _p ){

	this.velocity = 0;
	this.accel = .002+Math.random()*.002;
	this.angle = -Math.PI/2;
	this.rotateSub = 0;

	var p = merge( {
		life : 1,
		damageable : true,
		color : new THREE.Color( .9, .3, .1 ),
		light : true
	}, _p );

	Enemy.call( this, p );

	this.modelMain = new THREE.Mesh( missileGeometry, enemyMaterial.clone() );
	this.model.rotation.order = 'ZXY';
	this.model.add( this.modelMain );

	this.modelSub = [];
	for( var i=0; i<3; i++ ){
		this.modelSub[i] = new THREE.Mesh( missileGeometry, enemyMaterial.clone() );
		this.modelSub[i].scale.copy( scaleVector( .4 ) );
		this.modelMain.add( this.modelSub[i] );
	}

};

Missile.prototype = Object.create( Enemy.prototype );
Missile.prototype.constructor = Missile;

Missile.prototype.beat = function(){

	if( Math.random() < .07 && !player.missing && isInScreen( this.position, 0 ) && this.birthScale < .02 ){
		this.shot();
	}

};

Missile.prototype.shot = function(){

	Enemy.prototype.shot.call( this );

	for( var ix=0; ix<2; ix++ ){
		for(var iy=0; iy<3; iy++ ){
			var b = (ix*2-1)*1;
			var pos = this.position.clone().add( new THREE.Vector3( -Math.sin(this.angle)*b, Math.cos(this.angle)*b, 0 ) );
			enemies.push( new Bullet( {
				position : pos.clone(),
				bulletType : 1,
				scale : .3,
				velocity : new THREE.Vector3( Math.cos(this.angle-b*.1), Math.sin(this.angle-b*.1), 0 ).multiplyScalar(.07+.03*iy),
				birthAccel : 3
			} ) );
		}
	}

	playSample( samples['zap'] );

}

Missile.prototype.loop = function(){

	var sup = Enemy.prototype.loop.call( this );
	if( sup != 'success' ){
		return sup;
	}

	if( this.birthScale < .02 ){
		this.hazard = true;
	}

	this.position.x += this.velocity*Math.cos( this.angle );
	this.position.y += this.velocity*Math.sin( this.angle );
	this.velocity += this.accel;
	this.velocity *= .98;

	this.angle -= Math.sign( ( Math.atan2( player.position.y-this.position.y, player.position.x-this.position.x )-this.angle+Math.PI )%Math.PI*2-Math.PI )*.01;

	this.model.rotation.z = this.angle-Math.PI/2;
	this.model.rotation.y += .08;
	this.model.scale.copy( scaleVector( (1-this.birthScale) ) );

	this.rotateSub += .04;
	for( var i=0; i<3; i++ ){
		this.modelSub[i].position.x = Math.cos(i*Math.PI/3*2 + this.rotateSub);
		this.modelSub[i].position.z = Math.sin(i*Math.PI/3*2 + this.rotateSub);
	}

	var col = this.color.clone().lerp( new THREE.Color( 1, 1, 1 ), this.shotScale*.4+this.damageScale*.5 );
	this.modelMain.material.color = col.clone();
	this.modelMain.material.emissive = col.clone().multiplyScalar(.6);
	for( var i=0; i<3; i++ ){
		this.modelSub[i].material.color = col.clone();
		this.modelSub[i].material.emissive = col.clone().multiplyScalar(.6);
	}
	this.light.color = col;
	this.light.intensity = this.lightPower*(1-this.birthScale)*( 1+this.damageScale*.5+this.shotScale );

};

Missile.prototype.onDamage = function( _point ){

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

Missile.prototype.onDeath = function(){

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

	playSample( samples['snare808'] );

};
