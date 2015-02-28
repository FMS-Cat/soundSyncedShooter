birdGeometryCore = new THREE.TetrahedronGeometry( .8 );
var birdGeometryWingShape = new THREE.Shape();
(function(){
	var s = birdGeometryWingShape;
	s.moveTo( .4, -.2 );
	s.lineTo( .6, -.4 );
	s.lineTo( 1., -.4 );
	s.lineTo( 1.8, .4 );
	s.lineTo( 1.8, .6 );
	s.lineTo( 1., .4 );
	s.lineTo( .4, -.2 );
}());
var birdGeometryWing = new THREE.ExtrudeGeometry( birdGeometryWingShape, {
	amount : .1,
	bevelEnabled : false
} );

var Bird = function( _p ){

	this.velocity = .04;
	this.accel = .001;
	this.angle = -Math.PI/2;
	this.angleVel = (Math.random()-.5)*.01;
	this.vRotate = new THREE.Vector3( .04, .04, 0 );
	this.flap = 0;
	this.attack = -1;

	var p = merge( {
		life : 3,
		damageable : true,
		color : new THREE.Color( .6, .8, .1 ),
		light : true
	}, _p );

	Enemy.call( this, p );

	this.modelCore = new THREE.Mesh( birdGeometryCore, enemyMaterial.clone() );
	this.model.add( this.modelCore );

	this.modelWing = [];
	for( var i=0; i<2; i++ ){
		this.modelWing[i] = new THREE.Mesh( birdGeometryWing, enemyMaterial.clone() );
		this.modelWing[i].rotation.order = 'ZYX';
		this.modelWing[i].scale.copy( scaleVector(.7) );
		this.model.add( this.modelWing[i] );
	}

};

Bird.prototype = Object.create( Enemy.prototype );
Bird.prototype.constructor = Bird;

Bird.prototype.beat = function(){

	if( Math.random() < .055 && !player.missing && isInScreen( this.position, 0 ) && this.birthScale < .02 && this.attack == -1 ){
		this.attack = 5;
	}

	if( isInScreen( this.position, 0 ) && 0 < this.attack ){
		this.attack --;
		if( !player.missing ){
			this.shot();
		}
	}

};

Bird.prototype.shot = function(){

	Enemy.prototype.shot.call( this );

	for( var i=0; i<3; i++ ){
		enemies.push( new Bullet( {
			position : this.position.clone(),
			bulletType : 4,
			scale : .2,
			velocity : player.position.clone().sub( this.position.clone() ).normalize().multiplyScalar( .15 ).applyAxisAngle( new THREE.Vector3( 0, 0, 1 ), i*.2-.2 ),
			birthAccel : 0
		} ) );
	}

	playSample( samples['birdChord'+~~(Math.random()*3)] );

}

Bird.prototype.loop = function(){

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
	this.angle += this.angleVel;
	this.modelCore.rotation.x += this.vRotate.x*(1+this.damageScale);
	this.modelCore.rotation.y += this.vRotate.y*(1+this.damageScale);
	this.flap += .05;
	this.modelCore.rotation.z = -Math.PI/2+this.angle;
	for( var i=0; i<2; i++ ){
		this.modelWing[i].rotation.y = Math.PI*i + Math.sin(this.flap)*(1-i*2);
		this.modelWing[i].rotation.z = -Math.PI/2+this.angle;
	}

	this.model.scale.copy( scaleVector( (1+this.damageScale*.2+this.shotScale*.4)*(1-this.birthScale) ) );

	var col = this.color.clone().lerp( new THREE.Color( 1, 1, 1 ), this.shotScale*.4+this.damageScale*.5 );
	this.modelCore.material.color = col.clone();
	this.modelCore.material.emissive = col.clone().multiplyScalar(.6);
	for( var i=0; i<2; i++ ){
		this.modelWing[i].material.color = col.clone();
		this.modelWing[i].material.emissive = col.clone().multiplyScalar(.6);
	}
	this.light.color = col;
	this.light.intensity = this.lightPower*(1-this.birthScale)*( 1+this.damageScale*.5+this.shotScale );

};

Bird.prototype.onDamage = function( _point ){

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

Bird.prototype.onDeath = function(){

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

	playSample( samples['roomDrum8'] );

};
