var bulletGeometry = [];
bulletGeometry[1] = new THREE.TetrahedronGeometry( 1 ); // tetra
bulletGeometry[2] = new THREE.BoxGeometry( 1, 1, 1 ); // box
bulletGeometry[3] = new THREE.OctahedronGeometry( 1 ); // octa
bulletGeometry[4] = new THREE.IcosahedronGeometry( 1, 0 ); // icosa
bulletGeometry[11] = new THREE.CylinderGeometry( 0, .7, 1.4, 4 ); // sendan
bulletGeometry[12] = new THREE.CylinderGeometry( 0, .5, 1.5, 8 ); // moreEdgeySendan
var bulletMaterial = new THREE.MeshLambertMaterial( {
	shading : THREE.FlatShading,
	color : 0x222222
} );
var bulletMaterialWire = new THREE.MeshLambertMaterial( {
	shading : THREE.FlatShading,
	wireframe : true
} );

var Bullet = function( _p ){

	this.velocity = new THREE.Vector3( 0, 0, 0 );
	this.accel = new THREE.Vector3( 0, 0, 0 );
	this.birthAccel = 0;
	this.bulletType = 0;
	this.birthScale = 1;
	this.rotateX = 0;

	var p = merge( {
		scale : .4,
		hazard : true
	}, _p );

	Enemy.call( this, p );

	this.modelMain = new THREE.Mesh( bulletGeometry[this.bulletType], bulletMaterial.clone() );

	this.model.add( this.modelMain );

	this.modelWire = new THREE.Mesh( bulletGeometry[this.bulletType], bulletMaterialWire.clone() );
	this.modelWire.scale.copy( scaleVector( 1.3 ) );
	this.modelWire.material.color = this.color.clone();
	this.modelWire.material.emissive = this.color.clone().multiplyScalar( .5 );

	this.model.add( this.modelWire );

	this.model.rotation.z = Math.atan2( this.velocity.y, this.velocity.x )-Math.PI/2;
	this.model.rotation.order = 'ZXY';

	this.model.rotation.x = this.rotateX;

};

Bullet.prototype = Object.create( Enemy.prototype );
Bullet.prototype.constructor = Bullet;

Bullet.prototype.loop = function(){

	var sup = Enemy.prototype.loop.call( this );
	if( sup != 'success' ){
		return sup;
	}

	this.velocity.add( this.accel );
	this.position.add( this.velocity.clone().multiplyScalar( 1+this.birthAccel ) );

	this.model.scale.copy( scaleVector( this.scale*(1.01-this.birthScale) ) );

	this.birthAccel *= .9;
	this.birthScale *= .9;

	this.model.rotation.y += (1+this.birthAccel)*.08;

}
