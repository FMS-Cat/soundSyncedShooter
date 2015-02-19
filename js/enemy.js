var enemyModel = new THREE.Object3D();
enemyLight = new THREE.PointLight();
enemyLight.intensity = 1;
enemyLight.distance = 13;

var Enemy = function( _p ){

	Ob.call( this );

	this.life = 0;
	this.birthStep = 0;

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

Enemy.prototype.move = function(){

};

Enemy.prototype.draw = function(){

	this.model.position.copy( this.position );

};

Enemy.prototype.onDamage = function( _point ){

	if( this.lastDamagedStep == step ){ return false; }
	this.lastDamagedStep = step;

	this.life --;

	if( this.life == 0 ){
		this.onDeath();
		return false;
	}

	return true;

};

Enemy.prototype.onDeath = function(){

	this.remove();

};

Enemy.prototype.remove = function(){

	enemies.splice( enemies.indexOf( this ), 1 );
	scene.remove( this.model );

};
