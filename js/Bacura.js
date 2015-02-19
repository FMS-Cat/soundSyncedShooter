bacuraGeometry = new THREE.BoxGeometry( 2, 1.5, .1 );
bacuraMaterial = new THREE.MeshLambertMaterial( {
	shading : THREE.FlatShading
} );

var Bacura = function( _p ){

	this.velocity = new THREE.Vector3( 0, -.05, 0 );

	var p = merge( {
		life : 14,
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

Bacura.prototype.move = function(){

	this.position.add( this.velocity );

	this.modelMain.rotation.x += .1;

	if( this.position.y < -edge.y-2 ){
		this.remove();
	}

};

Bacura.prototype.onDamage = function( _point ){

	if( Enemy.prototype.onDamage.call( this, _point ) ){

		enemies.push( new Particle( {
			position : _point.clone(),
			velocity : new THREE.Vector3( -Math.cos( player.angle ), -Math.sin( player.angle ), 0 ).multiplyScalar( .2 ).add( this.velocity ).add( randomVec3( .05 ) ),
			color : this.color.clone(),
			nonemissive : true,
			scale : .2
		} ) );

		playSample( samples['pianoSlice'+~~(Math.random()*32)] );

	}

};

Bacura.prototype.onDeath = function(){

	Enemy.prototype.onDeath.call( this );

	for( var i=0; i<9; i++ ){
		enemies.push( new Particle( {
			position : this.position.clone(),
			color : new THREE.Color( 1, Math.random()*.6, 0 ),
			scale : .4
		} ) );
	}
	enemies.push( new Particle( {
		position : this.position.clone(),
		velocity : new THREE.Vector3( 0, 0, 0 ),
		color : new THREE.Color( 1, .3, 0 ),
		scale : .4,
		light : true,
		lightPower : 4.5
	} ) );

	playSample( samples['roomDrum8'] );

};
