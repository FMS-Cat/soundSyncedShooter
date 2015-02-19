linearEnemyGeometry = new THREE.TetrahedronGeometry( 1 );
linearEnemyMaterial = new THREE.MeshLambertMaterial( {
	shading : THREE.FlatShading
} );

var LinearEnemy = function( _p ){

	this.velocity = new THREE.Vector3( 0, -.1, 0 );
	this.damageScale = 0;
	this.shotScale = 0;

	var p = merge( {
		vRotate : new THREE.Vector3( .04, .04, 0 ),
		life : 4,
		damageable : true,
		hazard : true,
		light : true
	}, _p );

	Enemy.call( this, p );

	this.modelMain = new THREE.Mesh( linearEnemyGeometry, linearEnemyMaterial.clone() );
	this.modelMain.material.color = this.color.clone();
	this.modelMain.material.emissive = this.color.clone().multiplyScalar( .5 );

	this.model.add( this.modelMain );

};

LinearEnemy.prototype = Object.create( Enemy.prototype );
LinearEnemy.prototype.constructor = LinearEnemy;

LinearEnemy.prototype.beat = function(){

	if( Math.random() < .03 && !player.missing && isInScreen( this.position, 0 ) ){
		enemies.push( new Bullet( {
			position : this.position.clone(),
			velocity : player.position.clone().sub( this.position ).normalize().multiplyScalar( .1 )
		} ) );

		this.shotScale = 1;

		playSample( samples['hihat909'+~~(Math.random()*3)] );
	}

};

LinearEnemy.prototype.move = function(){

	this.position.add( this.velocity );

	this.modelMain.rotation.x += this.vRotate.x*(1+this.damageScale);
	this.modelMain.rotation.y += this.vRotate.y*(1+this.damageScale);
	
	this.modelMain.scale.copy( scaleVector( 1+this.damageScale*.2+this.shotScale*.4 ) );

	if( this.position.y < -edge.y-2 ){
		this.remove();
	}

};

LinearEnemy.prototype.draw = function(){

	Enemy.prototype.draw.call( this );

	var col = this.color.clone().lerp( new THREE.Color( 1, 1, 1 ), this.shotScale*.4+this.damageScale*.5 );
	this.modelMain.material.color = col;
	this.modelMain.material.emissive = col;
	this.light.color = col;
	this.light.intensity = this.lightPower*( 1+this.damageScale*.5+this.shotScale );

	this.damageScale *= .9;
	this.shotScale *= .9;

};

LinearEnemy.prototype.onDamage = function( _point ){

	if( Enemy.prototype.onDamage.call( this, _point ) ){

		this.damageScale = 1;

		enemies.push( new Particle( {
			position : _point.clone(),
			velocity : new THREE.Vector3( -Math.cos( player.angle ), -Math.sin( player.angle ), 0 ).multiplyScalar( .2 ).add( this.velocity ).add( randomVec3( .05 ) ),
			color : this.color.clone(),
			scale : .2
		} ) );

		playSample( samples['roomDrum'+~~(Math.random()*8)] );

	}

};

LinearEnemy.prototype.onDeath = function(){

	Enemy.prototype.onDeath.call( this );

	for( var i=0; i<9; i++ ){
		enemies.push( new Particle( {
			position : this.position.clone(),
			color : this.color.clone(),
			scale : .4
		} ) );
	}
	enemies.push( new Particle( {
		position : this.position.clone(),
		velocity : new THREE.Vector3( 0, 0, 0 ),
		color : this.color.clone(),
		scale : .4,
		light : true,
		lightPower : 4.5
	} ) );

	playSample( samples['roomDrum8'] );

};
