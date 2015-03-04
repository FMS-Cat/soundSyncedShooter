canGeometry = new THREE.CylinderGeometry( .5, .5, 1, 16 );
canMaterial = new THREE.MeshLambertMaterial( {
	shading : THREE.FlatShading
} );

var Can = function( _p ){

	this.velocity = new THREE.Vector3( Math.random()<.5?.07:-.07, 0, 0 );
	this.gravity = .008;
	this.vRotate = new THREE.Vector3( Math.random()*.1, Math.random()*.1, 0 );
	this.blink = 0;

	var p = merge( {
		life : 5,
		hazard : true,
		damageable : true
	}, _p );

	Enemy.call( this, p );

	this.modelMain = new THREE.Mesh( canGeometry, canMaterial.clone() );
	this.model.add( this.modelMain );

	playSample( samples['upTri'] );

};

Can.prototype = Object.create( Enemy.prototype );
Can.prototype.constructor = Can;

Can.prototype.loop = function(){

	var sup = Enemy.prototype.loop.call( this );
	if( sup != 'success' ){
		return sup;
	}

	this.position.add( this.velocity );
	this.velocity.y -= this.gravity;

	this.model.rotation.z += this.vRotate.x*(1+this.damageScale);
	this.model.rotation.y += this.vRotate.y*(1+this.damageScale);
	this.model.scale.copy( scaleVector( (1+this.damageScale*.2)*(1-this.birthScale) ) );

	this.blink += 1;
	var col = new THREE.Color( 1, .8, .5 ).lerp( new THREE.Color( 1, .1, .4 ), (Math.sin(this.blink)+1)*.5 );
	this.modelMain.material.color = col;
	this.modelMain.material.emissive = col.multiplyScalar(.6);
	this.light.color = col;
	this.light.intensity = this.lightPower*(1-this.birthScale)*( 1+this.damageScale*.5+this.shotScale );

};

Can.prototype.onDamage = function( _point ){

	var sup = Enemy.prototype.onDamage.call( this, _point );
	if( sup != 'success' ){
		return sup;
	}

	this.velocity.x = -this.velocity.x*1.4;
	this.velocity.y = .1;
	this.position.x += this.velocity.x*4;
	this.position.y += this.velocity.y*4;
	this.vRotate = new THREE.Vector3( Math.random()*.1, Math.random()*.1, 0 );

	enemies.push( new Particle( {
		position : _point.clone(),
		velocity : new THREE.Vector3( -Math.cos( player.angle ), -Math.sin( player.angle ), 0 ).multiplyScalar( .2 ).add( this.velocity ).add( randomVec3( .05 ) ),
		color : new THREE.Color( 1, 1, 0 ),
		scale : .2
	} ) );

	score += Math.pow(2,(4-this.life))*200;
	enemies.push( new Score( {
		position : this.position.clone(),
		string : String( Math.pow(2,(4-this.life))*200 ),
		scale : .1+(4-this.life)*.1,
		lifeDecay : .9
	} ) );
	playSample( samples['fami9th'+(4-this.life)] );

};

Can.prototype.onDeath = function(){

	Enemy.prototype.onDeath.call( this );

	for( var i=0; i<9; i++ ){
		enemies.push( new Particle( {
			position : this.position.clone(),
			velocity : randomVec3( .1 ),
			color : new THREE.Color( 1, Math.random(), 0 ),
			scale : .4
		} ) );
	}
	enemies.push( new Particle( {
		position : this.position.clone(),
		color : new THREE.Color( 1, .5, 0 ),
		scale : .4,
		light : true,
		lightPower : 4.5
	} ) );

	score += 3200;
	enemies.push( new Score( {
		position : this.position.clone(),
		string : String( 3200 ),
		scale : .5,
		lifeDecay : .9
	} ) );
	playSample( samples['fami9th4'] );

};
