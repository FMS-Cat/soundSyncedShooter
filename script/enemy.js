enemyMaterial = new THREE.MeshLambertMaterial( {
	shading : THREE.FlatShading
} );
enemyMaterialWire = new THREE.MeshLambertMaterial( {
	shading : THREE.FlatShading,
	color : 0x222222,
	wireframe : true
} );

var enemyModel = new THREE.Object3D();
enemyLight = new THREE.PointLight();
enemyLight.intensity = 1;
enemyLight.distance = 13;

var Enemy = function( _p ){

	Ob.call( this );

	this.life = 0;
	this.birthStep = step;
	this.birthScale = 1;
	this.shotScale = 0;
	this.damageScale = 0;

	this.unpierceable = false;
	this.damageable = false;
	this.hazard = false;

	this.color = new THREE.Color( 1, 1, 1 );

	this.light = false;
	this.lightPower = 1;

	this.model = enemyModel.clone();
	this.model.position.copy( this.position );
	this.model.enemy = this;
	scene.add( this.model );

	this.setProperties( _p );

	if( this.light ){
		this.light = enemyLight.clone();
		this.model.add( this.light );
		this.light.color.copy( this.color );
	}

};

Enemy.prototype = Object.create( Ob.prototype );
Enemy.prototype.constructor = Enemy;

Enemy.prototype.beat = function(){

};

Enemy.prototype.shot = function(){

	this.shotScale = 1;

}

Enemy.prototype.loop = function(){

	this.model.position.copy( this.position );

	this.birthScale *= .9;
	this.shotScale *= .9;
	this.damageScale *= .9;

	if( !isInScreen( this.position, 5 ) && this.birthScale < .02 ){
		this.remove();
		return 'removed';
	}

	return 'success';

};

Enemy.prototype.onDamage = function( _point ){

	if( this.lastDamagedStep == step ){ return 'doublehit'; }
	this.lastDamagedStep = step;
	this.damageScale = 1;

	this.life --;

	if( this.life == 0 ){
		this.onDeath();
		return 'dead';
	}

	return 'success';

};

Enemy.prototype.onDeath = function(){

	if( this.group ){
		this.group.score( this.position );
	}
	this.remove();

};

Enemy.prototype.remove = function(){

	enemies.splice( enemies.indexOf( this ), 1 );
	scene.remove( this.model );

};
