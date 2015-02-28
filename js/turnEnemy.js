
var turnEnemyGeometryCore = new THREE.OctahedronGeometry( .8 );
var turnEnemyGeometryWingShape = new THREE.Shape();
(function(){
	var s = turnEnemyGeometryWingShape;
	s.moveTo( .1, -.5 );
	s.lineTo( .3, -.3 );
	s.lineTo( .3, .4 );
	s.lineTo( .2, .5 );
	s.lineTo( .1, .4 );
	s.lineTo( .1, 0 );
	s.lineTo( 0, -.1 );
	s.lineTo( 0, -.4 );
	s.lineTo( .1, -.5 );
}());
var turnEnemyGeometryWing = new THREE.ExtrudeGeometry( turnEnemyGeometryWingShape, {
	amount : .1,
	bevelEnabled : false
} );

var TurnEnemy = function( _p ){

	this.velocity = .14;
	this.angle = Math.PI/2;
	this.angleSum = 0;
	this.vRotate = new THREE.Vector3( .04, .04, 0 );
	this.phase = 0;
	this.wingRotate = 0;
	this.invertDirection = false;

	var p = merge( {
		life : 4,
		damageable : true,
		color : new THREE.Color( .4, .2, .8 ),
		light : true
	}, _p );

	Enemy.call( this, p );

	this.modelCore = new THREE.Mesh( turnEnemyGeometryCore, enemyMaterial.clone() );
	this.model.add( this.modelCore );

	this.modelWing = [];
	for( var i=0; i<4; i++ ){
		this.modelWing[i] = new THREE.Mesh( turnEnemyGeometryWing, enemyMaterial.clone() );
		this.modelWing[i].rotation.order = 'ZYX';
		this.model.add( this.modelWing[i] );
	}

};

TurnEnemy.prototype = Object.create( Enemy.prototype );
TurnEnemy.prototype.constructor = TurnEnemy;

TurnEnemy.prototype.beat = function(){

	if( Math.random() < .07 && this.phase == 1 && !player.missing && isInScreen( this.position, 0 ) ){
		this.shot();
	}

};

TurnEnemy.prototype.shot = function(){

	Enemy.prototype.shot.call( this );

	enemies.push( new Bullet( {
		position : this.position.clone(),
		bulletType : 11,
		velocity : player.position.clone().sub( this.position ).normalize().multiplyScalar( .1 ),
		birthAccel : 3
	} ) );

	playSample( samples['roomDrum5'] );

}

TurnEnemy.prototype.loop = function(){

	var sup = Enemy.prototype.loop.call( this );
	if( sup != 'success' ){
		return sup;
	}

	if( this.birthScale < .02 ){
		this.hazard = true;
	}

	if( 16 < step-this.birthStep ){
		this.phase = 1;
	}

	if( this.phase == 1 && this.angleSum < Math.PI ){
		this.angle += this.invertDirection ? .01 : -.01;
		this.angleSum += .01;
	}

	this.position.x += this.velocity*Math.cos( this.angle );
	this.position.y += this.velocity*Math.sin( this.angle );

	this.model.scale.copy( scaleVector( (1+this.damageScale*.2+this.shotScale*.4)*(1-this.birthScale) ) );
	this.modelCore.rotation.x += this.vRotate.x*(1+this.damageScale);
	this.modelCore.rotation.y += this.vRotate.y*(1+this.damageScale);
	this.wingRotate += .05;
	for( var i=0; i<4; i++ ){
		this.modelWing[i].position.x = (
			Math.cos( Math.PI/2*i + this.wingRotate )*Math.sin( this.angle )*.7
		);
		this.modelWing[i].position.y = (
			-Math.cos( Math.PI/2*i + this.wingRotate )*Math.cos( this.angle )*.7
		);
		this.modelWing[i].position.z = Math.sin( Math.PI/2*i + this.wingRotate );
		this.modelWing[i].rotation.y = Math.PI/2*i + this.wingRotate;
		this.modelWing[i].rotation.z = -Math.PI/2+this.angle;
	}

	var col = this.color.clone().lerp( new THREE.Color( 1, 1, 1 ), this.shotScale*.4+this.damageScale*.5 );
	this.modelCore.material.color = col.clone();
	this.modelCore.material.emissive = col.clone().multiplyScalar(.6);
	for( var i=0; i<4; i++ ){
		this.modelWing[i].material.color = col.clone();
		this.modelWing[i].material.emissive = col.clone().multiplyScalar(.6);
	}
	this.light.color = col;
	this.light.intensity = this.lightPower*(1-this.birthScale)*( 1+this.damageScale*.5+this.shotScale );

};

TurnEnemy.prototype.onDamage = function( _point ){

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

	playSample( samples['tranceArpPluck'+~~(Math.random()*9)] );

};

TurnEnemy.prototype.onDeath = function(){

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
