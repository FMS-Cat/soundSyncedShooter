var scoreGeometry = new THREE.BoxGeometry( 1., 1., 1. );
var scoreMaterial = new THREE.MeshLambertMaterial( {
	shading : THREE.FlatShading
} );

var scoreFont = {
	'0' : 15259182,
	'1' : 6426756,
	'2' : 16267327,
	'3' : 16268815,
	'4' : 18415120,
	'5' : 32554511,
	'6' : 14728750,
	'7' : 33079824,
	'8' : 15252014,
	'9' : 15268366,
	' ' : 0,
	'w' : 18536126,
	'a' : 16285247,
	'v' : 18400580,
	'e' : 33094718,
	'g' : 32568895,
	'm' : 16438965,
	'o' : 33080895,
	'r' : 33094961
}

var Score = function( _p ){

	this.string = '';
	this.sublife = 1;
	this.lifeDecay = .9;
	_p.position.z = -3;

	var p = merge( {
		scale : .1,
		life : 1
	}, _p );

	Enemy.call( this, p );

	this.mat = scoreMaterial.clone();
	this.mat.color = this.color.clone();
	this.mat.emissive = this.color.clone().multiplyScalar( .5 );
	this.modelMain = new THREE.Object3D();
	this.modelMain.scale.y = 0;
	this.modelBox = [];

	var index = 0;
	for( var il=0; il<this.string.length; il++ ){
		for( var ip=0; ip<25; ip++ ){
			if( scoreFont[this.string.charAt(il)] & Math.pow(2,ip) ){
				this.modelBox[index] = new THREE.Mesh( scoreGeometry, this.mat );
				this.modelBox[index].position.set( ip%5-2 + (il-(this.string.length-1)/2)*6, ~~(ip/5)-2, 0 );
				this.modelMain.add( this.modelBox[index] );
				index ++;
			}
		}
	}

	this.model.add( this.modelMain );

};

Score.prototype = Object.create( Enemy.prototype );
Score.prototype.constructor = Score;

Score.prototype.loop = function(){

	var sup = Enemy.prototype.loop.call( this );
	if( sup != 'success' ){
		return sup;
	}

	this.modelMain.rotation.x = this.birthScale*Math.PI/2;

	this.modelMain.scale.copy( scaleVector( this.scale*(1-(1-this.sublife)*.05) ) );

	this.life *= this.lifeDecay;

	if( this.life < .1 ){
		for( var i=0; i<3; i++ ){
			if( this.modelBox.length == 0 ){
				this.remove();
				return;
			}else{
				var dice = Math.floor( Math.random()*this.modelBox.length );
				this.modelMain.remove( this.modelBox[dice] );
				this.modelBox.splice( dice, 1 );
			}
		}
	}

}
