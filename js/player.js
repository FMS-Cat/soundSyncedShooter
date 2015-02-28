var Player = function(){

	Ob.call( this );

	this.position.set( 0, 0, 0 );
	this.velocity = new THREE.Vector3( 0, 0, 0 );
	this.angle = 0;

	this.lineHue = 0;
	this.lineSaturation = 0;

	this.missing = 0;
	this.invincible = 0;
	this.birthScale = 0;

	this.model = new THREE.Object3D();
	scene.add( this.model );

	var geo = new THREE.BoxGeometry( 1, 1, 1 );
	this.color = new THREE.Color( .1, .4, 1. );
	var mat = new THREE.MeshLambertMaterial( {
		color : this.color,
		emissive : this.color.clone().multiplyScalar( .7 ),
		shading : THREE.FlatShading,
		transparent : true,
		opacity : .7
	} );
	this.modelBox = new THREE.Mesh( geo, mat );
	this.model.add( this.modelBox );

	var geo = new THREE.BoxGeometry( .15, .15, .15 );
	var mat = new THREE.MeshLambertMaterial( {
		shading : THREE.FlatShading,
		emissive: 0xffffff
	} );
	this.modelCore = new THREE.Mesh( geo, mat );
	this.model.add( this.modelCore );

	var geo = new THREE.Geometry();
	geo.vertices.push(
		new THREE.Vector3( 0, 0, 0 ),
		new THREE.Vector3( 100, 0, 0 )
	);
	var mat = new THREE.LineBasicMaterial( {
		color : 0xffffff,
		transparent : true,
		opacity : .5
	} );
	this.modelLine = new THREE.Line( geo, mat );
	this.model.add( this.modelLine );

	var geo = new THREE.CircleGeometry( .5, 16 );
	geo.vertices.shift();
	var mat = new THREE.MeshBasicMaterial( {
		color : 0xffffff,
		transparent : true,
		opacity : .5,
		wireframe : true
	} );
	this.modelPoint = new THREE.Line( geo, mat );
	this.model.add( this.modelPoint );

	this.light = new THREE.PointLight( this.color, 2, 20 );
	this.model.add( this.light );

};

Player.prototype = Object.create( Ob.prototype );
Player.prototype.constructor = Player;

Player.prototype.raycast = function(){

	if( this.missing ){
		return;
	}

	var ray = new THREE.Raycaster( this.position, new THREE.Vector3( Math.cos(this.angle), Math.sin(this.angle), 0 ) );
	var ints = ray.intersectObjects( scene.children, true );

	for( var i=0; i<ints.length; i++ ){
		if( !isInScreen( ints[i].point, 0 ) ){ return; }

		if(
			ints[i].object.parent &&
			ints[i].object.parent.enemy &&
			ints[i].object.parent.enemy.damageable
		){

			this.lineHue = .45;
			this.lineSaturation = 1;

			ints[i].object.parent.enemy.onDamage( ints[i].point );
			if( ints[i].object.parent.enemy.unpierceable ){
				this.lineHue = .95;
				break;
			}

		}
	}

};

Player.prototype.collision = function(){

	if( left < 0 ){
		return;
	}
	if( this.missing ){
		this.missing --;
		if( this.missing == 0 ){
			this.revive();
		}
		return;
	}

		if( this.invincible ){
			this.invincible --;
			return;
		}

	for( var i=0; i<4; i++ ){
		var ray = new THREE.Raycaster( this.position, new THREE.Vector3( Math.cos(Math.PI*(1/4+i/2)), Math.sin(Math.PI*(1/4+i/2)), 0 ) );
		var ints = ray.intersectObjects( scene.children, true );

		for( var ii=0; ii<ints.length; ii++ ){
			if(
				ints[ii].object.parent &&
				ints[ii].object.parent.enemy &&
				ints[ii].object.parent.enemy.hazard &&
				ints[ii].distance < .1
			){
				this.miss();
				return;
			}
		}

	}

};

Player.prototype.loop = function(){

	if( this.missing ){
		return;
	}

	var velTemp = new THREE.Vector3( 0, 0, 0 );
	if( keyP[65] && -edge.x+2 < this.position.x ){ // A
		velTemp.x --;
	}
	if( keyP[68] && this.position.x < edge.x-2 ){ // D
		velTemp.x ++;
	}
	if( keyP[83] && -edge.y+2 < this.position.y ){ // S
		velTemp.y --;
	}
	if( keyP[87] && this.position.y < edge.y-2 ){ // W
		velTemp.y ++;
	}
	var shift = keyP[16] ? .015 : 0;
	this.velocity.add( velTemp.normalize().multiplyScalar( .03-shift ) );
	this.velocity.multiplyScalar( .86 );
	this.position.add( this.velocity );
	this.model.position.copy( this.position );

	this.angle = Math.atan2( mousePos.y-this.position.y, mousePos.x-this.position.x );

	if( this.invincible ){
		this.modelBox.material.opacity = .5+Math.sin(this.invincible*.5)*.2;
	}

	this.modelBox.rotation.x += .013;
	this.modelBox.rotation.y += .047;

	var sc = ( 1+beat*.3 )*( 1-this.birthScale );
	this.modelBox.scale.set( sc, sc, sc );

	var col = this.color.clone().lerp( new THREE.Color( 1, 1, 1 ), beat*.2 );
	this.modelBox.material.color = col;
	this.modelBox.material.emissive = col;
	this.light.color = col;

	this.modelLine.rotation.z = this.angle;

	this.modelPoint.position.copy( mousePos.clone().sub( this.position ) );

	this.modelLine.material.color.setHSL( this.lineHue, 1, 1-.5*this.lineSaturation );
	this.modelPoint.material.color.setHSL( this.lineHue, 1, 1-.5*this.lineSaturation );
	this.modelPoint.scale.copy( scaleVector( 1+this.lineSaturation+beat ) );
	this.lineSaturation *= .8;

	this.light.intensity = ( 1+beat )*( 1-this.birthScale );

	this.birthScale *= .9;

};

Player.prototype.miss = function(){

	left --;
	this.missing = 60;
	this.model.visible = false;
	playSample( samples['miss'] );

	if( left < 0 ){
		enemies.push( new Score( {
			position : new THREE.Vector3( 0, 0, 0 ),
			string : 'game over',
			scale : .5,
			lifeDecay : .98
		} ) );
	}

	for( var i=0; i<9; i++ ){
		enemies.push( new Particle( {
			position : this.position.clone(),
			velocity : randomVec3( .1 ),
			color : this.color.clone(),
			scale : .4
		} ) );
	}
	enemies.push( new Particle( {
		position : this.position.clone(),
		color : this.color.clone(),
		scale : .4,
		light : true,
		lightPower : 4.5
	} ) );

	this.position.set( 0, 0, 0 );
	this.velocity.set( 0, 0, 0 );

};

Player.prototype.revive = function(){

	this.missing = false;
	this.invincible = 120;
	this.model.visible = true;
	this.birthScale = 1;

}
