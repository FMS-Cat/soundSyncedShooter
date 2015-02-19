var particleGeometry = new THREE.TetrahedronGeometry( 1 );
var particleMaterial = new THREE.MeshLambertMaterial( {
	shading : THREE.FlatShading
} );

var Particle = function( _p ){

	this.velocity = randomVec3( .1 );
	this.vRotate = randomVec3( .06 );

	var p = merge( {
		scale : .1,
		life : 1
	}, _p );

	Enemy.call( this, p );

	this.modelMain = new THREE.Mesh( particleGeometry, particleMaterial.clone() );
	this.modelMain.material.color = this.color.clone();
	if( !this.nonemissive ){
		this.modelMain.material.emissive = this.color.clone().multiplyScalar( .5 );
	}

	this.model.add( this.modelMain );


};

Particle.prototype = Object.create( Enemy.prototype );
Particle.prototype.constructor = Particle;

Particle.prototype.move = function(){

	this.position.add( this.velocity.clone().multiplyScalar( this.life ) );

	this.modelMain.rotation.x += this.vRotate.x;
	this.modelMain.rotation.y += this.vRotate.y;
	this.modelMain.rotation.z += this.vRotate.z;

	this.life *= .9;

	if( this.life < .01 ){
		this.remove();
	}

}

Particle.prototype.draw = function(){

	Enemy.prototype.draw.call( this );

	this.modelMain.scale.copy( scaleVector( this.scale*this.life ) );
	if( this.light ){
		this.light.intensity = this.life*this.lightPower;
	}

}
