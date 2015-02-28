middleBossGeometry = new THREE.TorusKnotGeometry( 3, 2 );
middleBossGeometryChild = new THREE.OctahedronGeometry( 1, 0 );

var MiddleBoss = function( _p ){

	this.vRotate = new THREE.Vector3( .007, .013, 0 );
  this.childRotate = 0;
	this.shotScaleMain = 0;
	this.shotScaleChild = [];
	for( var i=0; i<8; i++ ){
		this.shotScaleChild[i] = 0;
	}
	this.enemyCue = [];

	var p = merge( {
		position : new THREE.Vector3( edge.x-8, 0, 0 ),
		life : 128,
		damageable : true,
		color : new THREE.Color( .5, .1, .2 ),
		light : true,
		lightPower : 4
	}, _p );

	Enemy.call( this, p );

	this.modelMain = new THREE.Mesh( middleBossGeometry, enemyMaterial.clone() );
	this.model.add( this.modelMain );

  this.modelChild = [];
  for( var i=0; i<8; i++ ){
    this.modelChild[i] = new THREE.Mesh( middleBossGeometryChild, enemyMaterial.clone() );
    this.model.add( this.modelChild[i] );
  }
	this.model.scale.copy( scaleVector( 0 ) );

	playSample( samples['bpfSquare'] );

  boss ++;

};

MiddleBoss.prototype = Object.create( Enemy.prototype );
MiddleBoss.prototype.constructor = MiddleBoss;

MiddleBoss.prototype.beat = function(){

	if( 16 < step-this.birthStep ){
		this.shot();
	}

	if( step%48 == 0 ){
		enemies.push( new MiddleBossSmall( {
			position : new THREE.Vector3( -edge.x, edge.y-5, 0 ),
			invertDirection : false,
			groupId : 0,
		} ) );
		enemies.push( new MiddleBossSmall( {
			position : new THREE.Vector3( -edge.x, -edge.y+5, 0 ),
			invertDirection : false,
			groupId : 3,
			invertAim : true,
		} ) );
	}

};

MiddleBoss.prototype.shot = function(){

	Enemy.prototype.shot.call( this );

	enemies.push( new Bullet( {
		position : this.position.clone().add( this.modelChild[step%8].position ),
		bulletType : 12,
		scale : .5,
		velocity : player.position.clone().sub( this.position ).normalize().multiplyScalar( .1 ),
		birthAccel : 2
	} ) );
	this.shotScaleChild[step%8] = 1;

	playSample( samples['pianoSlice'+~~(Math.random()*32)] );
	playSample( samples['hihat909'+~~(Math.random()*3)] );

}

MiddleBoss.prototype.loop = function(){

	var sup = Enemy.prototype.loop.call( this );
	if( sup != 'success' ){
		return sup;
	}

	if( this.birthScale < .02 ){
		this.hazard = true;
	}

	this.position.y = Math.sin( this.childRotate*.1 )*edge.y*.7;

	this.modelMain.rotation.x += this.vRotate.x*(1+this.damageScale);
	this.modelMain.rotation.y += this.vRotate.x*(1+this.damageScale);
	this.model.scale.copy( scaleVector( (1-this.birthScale) ) );

	this.modelMain.scale.copy( scaleVector( (1+this.damageScale*.2) ) );

	for( var i=0; i<8; i++ ){
		this.shotScaleChild[i] *= .85;
		this.modelChild[i].scale.copy( scaleVector( 1+this.shotScaleChild[i]*.4 ) );
	}

  this.childRotate += .02;
  for( var i=0; i<8; i++ ){
    this.modelChild[i].position.x = Math.cos( this.childRotate+Math.PI/4*i )*8;
    this.modelChild[i].position.y = Math.sin( this.childRotate+Math.PI/4*i )*8;
  }

	var col = this.color.clone().lerp( new THREE.Color( 1, 1, 1 ), this.damageScale*.5 );
	this.modelMain.material.color = col.clone();
	this.modelMain.material.emissive = col.clone().multiplyScalar(.6);
	this.light.color = col;
	this.light.intensity = this.lightPower*(1-this.birthScale)*( 1+this.damageScale*.5+this.shotScale );
  for( var i=0; i<8; i++ ){
		var col = this.color.clone().lerp( new THREE.Color( 1, 1, 1 ), this.shotScaleChild[i]*.4 );
    this.modelChild[i].material.color = col.clone();
    this.modelChild[i].material.emissive = col.clone().multiplyScalar(.6);
  }

};

MiddleBoss.prototype.onDamage = function( _point ){

	var sup = Enemy.prototype.onDamage.call( this, _point );
	if( sup != 'success' ){
		return sup;
	}

	enemies.push( new Particle( {
		position : _point.clone(),
		velocity : new THREE.Vector3( -Math.cos( player.angle ), -Math.sin( player.angle ), 0 ).multiplyScalar( .2 ).add( randomVec3( .05 ) ),
		color : this.color.clone(),
		scale : .4
	} ) );

	playSample( samples['amen'+~~(Math.random()*5)] );

};

MiddleBoss.prototype.onDeath = function(){

	Enemy.prototype.onDeath.call( this );

	for( var i=0; i<9; i++ ){
		enemies.push( new Particle( {
			position : this.position.clone().add( randomVec3( .7 ) ),
			velocity : randomVec3( .4 ),
			color : this.color.clone(),
			scale : 3.2
		} ) );
	}
	enemies.push( new Particle( {
		position : this.position.clone(),
		color : this.color.clone(),
		scale : 3.2,
		light : true,
		lightPower : 8.5
	} ) );

	playSample( samples['snare909'] );
	playSample( samples['chime'] );

  boss --;

};
