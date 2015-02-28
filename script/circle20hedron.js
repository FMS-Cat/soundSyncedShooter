circle20hedronGeometry = new THREE.IcosahedronGeometry( 2.2, 1 );

var Circle20hedron = function( _p ){

	this.firstAccel = -.2;
	this.endAccel = 0;
	this.vRotate = new THREE.Vector3( .02, .01, 0 );
	this.circleSegment = 8;

	var p = merge( {
		life : 16,
		damageable : true,
		color : new THREE.Color( .8, .1, .3 ),
		light : true,
		lightPower : 4
	}, _p );

	Enemy.call( this, p );

	this.modelMain = new THREE.Mesh( circle20hedronGeometry, enemyMaterial.clone() );
	this.model.add( this.modelMain );

	playSample( samples['formantix'] );

};

Circle20hedron.prototype = Object.create( Enemy.prototype );
Circle20hedron.prototype.constructor = Circle20hedron;

Circle20hedron.prototype.beat = function(){

	if( step%3 == 0 && 16 < step-this.birthStep && this.endAccel == 0 ){
		this.shot();
	}

};

Circle20hedron.prototype.shot = function(){

	Enemy.prototype.shot.call( this );

	for( var i=0; i<this.circleSegment; i++ ){
		enemies.push( new Bullet( {
			position : this.position.clone(),
			bulletType : 3,
			scale : .5,
			velocity : new THREE.Vector3( Math.cos( i/this.circleSegment*Math.PI*2 + step ), Math.sin( i/this.circleSegment*Math.PI*2 + step ), 0 ).multiplyScalar( .1 ),
			birthAccel : 3
		} ) );
	}

	playSample( samples['tranceChordA1'] );

}

Circle20hedron.prototype.loop = function(){

	var sup = Enemy.prototype.loop.call( this );
	if( sup != 'success' ){
		return sup;
	}

	if( this.birthScale < .02 ){
		this.hazard = true;
	}

	if( 64 < step-this.birthStep ){
		this.endAccel += .01;
		this.position.y += this.endAccel;
	}

	this.position.y += this.firstAccel;
	this.firstAccel *= .98;

	this.model.rotation.z += this.vRotate.x*(1+this.damageScale);
	this.model.scale.copy( scaleVector( (1+this.damageScale*.2+this.shotScale*.4)*(1-this.birthScale) ) );

	var col = this.color.clone().lerp( new THREE.Color( 1, 1, 1 ), this.shotScale*.4+this.damageScale*.5 );
	this.modelMain.material.color = col;
	this.modelMain.material.emissive = col.multiplyScalar(.6);
	this.light.color = col;
	this.light.intensity = this.lightPower*(1-this.birthScale)*( 1+this.damageScale*.5+this.shotScale );

};

Circle20hedron.prototype.onDamage = function( _point ){

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

	playSample( samples['tom808'+~~(Math.random()*3)] );

};

Circle20hedron.prototype.onDeath = function(){

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

};
