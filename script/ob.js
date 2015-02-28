var Ob = function(){

	this.position = new THREE.Vector3( 0, 0, -100 );

};

Ob.prototype.setPosition = function( _v ){

	this.position.copy( _v );

};

Ob.prototype.setProperties = function( _p ){

	// traced from THREE.Material.setValues

	if( _p === undefined ){ return; }

	for( var key in _p ){
		this[key] = _p[key];
	}

};
