var bulletGeometry = new THREE.CylinderGeometry( 0, 1, 3, 4 );
var bulletMaterial = new THREE.MeshLambertMaterial( {
	shading : THREE.FlatShading
} );

var Bullet = function( _p ){

	this.velocity = randomVec3z0( .1 );
	this.birthAccel = 3;

	var p = merge( {
		scale : .4,
		hazard : true
	}, _p );

	Enemy.call( this, p );

	this.modelMain = new THREE.Mesh( bulletGeometry, bulletMaterial.clone() );
	this.modelMain.scale.copy( scaleVector( this.scale ) );
	this.modelMain.rotation.z = Math.atan2( this.velocity.y, this.velocity.x )-Math.PI/2;
	this.modelMain.rotation.order = 'ZXY';
	this.modelMain.material.color = this.color.clone();
	this.modelMain.material.emissive = this.color.clone().multiplyScalar( .5 );

	this.model.add( this.modelMain );

};

Bullet.prototype = Object.create( Enemy.prototype );
Bullet.prototype.constructor = Bullet;

Bullet.prototype.move = function(){

	this.position.add( this.velocity.clone().multiplyScalar( 1+this.birthAccel ) );

	this.birthAccel *= .9;

	this.modelMain.rotation.y += (1+this.birthAccel)*.08;

	if( !isInScreen( this.position, 2 ) ){
		this.remove();
	}

}
