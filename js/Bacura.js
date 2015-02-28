bacuraGeometry = new THREE.BoxGeometry( 2, 1.5, .1 );
bacuraMaterial = new THREE.MeshLambertMaterial( {
	shading : THREE.FlatShading
} );

var Bacura = function( _p ){

	this.velocity = new THREE.Vector3( 0, -.1, 0 );

	var p = merge( {
		life : 256,
		color : new THREE.Color( .8, .8, .8 ),
		hazard : true,
		damageable : true,
		unpierceable : true
	}, _p );

	Enemy.call( this, p );

	this.modelMain = new THREE.Mesh( bacuraGeometry, bacuraMaterial.clone() );
	this.modelMain.material.color = this.color.clone();

	this.model.add( this.modelMain );

};

Bacura.prototype = Object.create( Enemy.prototype );
Bacura.prototype.constructor = Bacura;

Bacura.prototype.loop = function(){

	var sup = Enemy.prototype.loop.call( this );
	if( sup != 'success' ){
		return sup;
	}

	this.position.add( this.velocity );

	this.modelMain.rotation.x += .1;
	this.model.scale.copy( scaleVector( (1-this.birthScale) ) );

};

Bacura.prototype.onDamage = function( _point ){

	var sup = Enemy.prototype.onDamage.call( this, _point );
	if( sup != 'success' ){
		return sup;
	}

	enemies.push( new Particle( {
		position : _point.clone(),
		velocity : new THREE.Vector3( -Math.cos( player.angle ), -Math.sin( player.angle ), 0 ).multiplyScalar( .2 ).add( this.velocity ).add( randomVec3( .05 ) ),
		color : this.color.clone(),
		nonemissive : true,
		scale : .2
	} ) );

	playSample( samples['bacura'] );

};

Bacura.prototype.onDeath = function(){

	Enemy.prototype.onDeath.call( this );

};
