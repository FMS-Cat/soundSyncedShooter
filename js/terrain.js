var Terrain = function(){

	Ob.call( this );

	var geo = new THREE.PlaneGeometry( 96, 96, 48, 48 );
	var mat = new THREE.MeshLambertMaterial( {
		color : 0x111111,
		shading : THREE.FlatShading
	} );
	var matWire = new THREE.MeshLambertMaterial( {
		color : 0x555555,
		shading : THREE.FlatShading,
		wireframe : true
	} );
	this.model = new THREE.Mesh( geo, mat );
	this.model.position.set( 0, 0, -10 );
	scene.add( this.model );

	this.modelWire = new THREE.Mesh( geo, matWire );
	this.modelWire.position.set( 0, 0, .1 );
	this.model.add( this.modelWire );

	this.position.y = 0;

};

Terrain.prototype = Object.create( Ob.prototype );
Terrain.prototype.constructor = Terrain;

Terrain.prototype.draw = function(){

	this.position.y += .03;
	this.model.position.y = -(this.position.y%2);

	for( var i=0; i<this.model.geometry.vertices.length; i++ ){
		var v = this.model.geometry.vertices[i];
		v.z = noise.simplex2( ~~(v.x)*.1, (v.y+~~(this.position.y/2)*2)*.1 )*2;
	}

	this.model.geometry.computeFaceNormals();
	this.model.geometry.computeVertexNormals();

	this.model.geometry.verticesNeedUpdate = true;
	this.model.geometry.normalsNeedUpdate = true;

}
