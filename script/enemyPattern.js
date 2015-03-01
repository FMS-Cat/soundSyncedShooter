var enemyPattern = {};

enemyPattern.linearLinear = function( _s ){
  var f = function( _x, _g ){
    return function(){
      enemies.push( new LinearEnemy( {
        position : new THREE.Vector3( _x, edge.y, 0 ),
        group : _g
      } ) );
    };
  };

  var cue = [];

  var x = (Math.random()-.5)*edge.x*1.6;
  var g = new EnemyGroup( 5, 100, 1000, 'cosmicBellpad1' );
  for( var i=0; i<5; i++ ){
    cue[_s+i*6] = f( x, g );
  }

  return cue;
};

enemyPattern.turnSide = function( _s ){
  var f = function( _g ){
    return function(){
      enemies.push( new TurnEnemy( {
        angle : 0,
        position : new THREE.Vector3( -edge.x, -13, 0 ),
        invertDirection : true,
        group : _g
      } ) );
      enemies.push( new TurnEnemy( {
        angle : Math.PI,
        position : new THREE.Vector3( edge.x, -13, 0 ),
        group : _g
      } ) );
    };
  };

  var cue = [];

  var g = new EnemyGroup( 6, 200, 2000, 'cosmicBellpad1' );
  for( var i=0; i<3; i++ ){
    cue[_s+i*8] = f( g );
  }

  return cue;
};

enemyPattern.turnForward = function( _s ){
  var f = function( _g ){
    return function(){
      enemies.push( new TurnEnemy( {
        angle : -Math.PI/2,
        position : new THREE.Vector3( -10, edge.y, 0 ),
        invertDirection : true,
        group : _g
      } ) );
      enemies.push( new TurnEnemy( {
        angle : -Math.PI/2,
        position : new THREE.Vector3( 10, edge.y, 0 ),
        group : _g
      } ) );
    };
  };

  var cue = [];

  var g = new EnemyGroup( 6, 200, 2000, 'cosmicBellpad1' );
  for( var i=0; i<3; i++ ){
    cue[_s+i*8] = f( g );
  }

  return cue;
};

enemyPattern.bird = function( _s ){
  var f = function( _x, _i, _g ){
    return function(){
      enemies.push( new Bird( {
        position : new THREE.Vector3( _x+_i*2, edge.y, 0 ),
        group : _g
      } ) );
      if( _i != 0 ){
        enemies.push( new Bird( {
          position : new THREE.Vector3( _x-_i*2, edge.y, 0 ),
          group : _g
        } ) );
      }
    };
  };

  var cue = [];

  var x = (Math.random()-.5)*edge.x;
  var g = new EnemyGroup( 5, 150, 1500, 'cosmicBellpad1' );
  for( var i=0; i<3; i++ ){
    cue[_s+i*6] = f( x, i, g );
  }

  return cue;
};

enemyPattern.missile = function( _s ){
  var f = function( _x, _g ){
    return function(){
      for( var i=0; i<3; i++ ){
        enemies.push( new Missile( {
          position : new THREE.Vector3( _x+i*2-2, edge.y, 0 ),
          group : _g
        } ) );
      }
    };
  };

  var cue = [];

  var g = new EnemyGroup( 6, 100, 1000, 'roomDrum3' );
  for( var i=0; i<2; i++ ){
    var x = (Math.random()-.5)*edge.x*1.4;
    cue[_s+i*6] = f( x, g );
  }

  return cue;
};

enemyPattern.circle20hedron = function( _s ){
  var f = function( _g ){
    return function(){
      enemies.push( new Circle20hedron( {
        position : new THREE.Vector3( edge.x*(Math.random()-.5)*1.4, edge.y, 0 ),
        group : g
      } ) );
    };
  };

  var cue = [];

  var g = new EnemyGroup( 1, 0, 1000 );
  cue[_s] = f( g );

  return cue;
};

enemyPattern.circle20hedronDouble = function( _s ){
  var f = function( _g, _g2 ){
    return function(){
      var x = (Math.random()*.5+.3)*edge.x;
      enemies.push( new Circle20hedron( {
        position : new THREE.Vector3( x, edge.y, 0 ),
        group : g
      } ) );
      enemies.push( new Circle20hedron( {
        position : new THREE.Vector3( -x, edge.y, 0 ),
        group : g2
      } ) );
    };
  };

  var cue = [];

  var g = new EnemyGroup( 1, 0, 1000 );
  var g2 = new EnemyGroup( 1, 0, 1000 );
  cue[_s] = f( g, g2 );

  return cue;
};

enemyPattern.rollingRhombusDouble = function( _s ){
  var f = function( _g, _g2, _i, _inv ){
    return function(){
      enemies.push( new RollingRhombus( {
        position : new THREE.Vector3( _inv ? edge.x : -edge.x, edge.y-3, 0 ),
        invertDirection : _inv,
        group : g,
        groupId : _i
      } ) );
      enemies.push( new RollingRhombus( {
        position : new THREE.Vector3( !_inv ? edge.x : -edge.x, edge.y-8, 0 ),
        invertDirection : !_inv,
        group : g2,
        groupId : _i
      } ) );
    };
  };

  var cue = [];

  var g = new EnemyGroup( 4, 50, 200, 'roomDrum3' );
  var g2 = new EnemyGroup( 4, 50, 200, 'roomDrum3' );
  var isInvert = Math.random()<.5 ? false : true;
  for( var i=0; i<4; i++ ){
    cue[_s+i*6] = f( g, g2, i, isInvert );
  }

  return cue;
};

enemyPattern.rollingRhombusSand = function( _s ){
  var f = function( _g, _g2, _i, _inv ){
    return function(){
      enemies.push( new RollingRhombus( {
        position : new THREE.Vector3( _inv ? edge.x : -edge.x, edge.y-5, 0 ),
        invertDirection : _inv,
        group : g,
        groupId : _i
      } ) );
      enemies.push( new RollingRhombus( {
        position : new THREE.Vector3( !_inv ? edge.x : -edge.x, -edge.y+5, 0 ),
        invertDirection : !_inv,
        invertAim : true,
        group : g2,
        groupId : _i
      } ) );
    };
  };

  var cue = [];

  var g = new EnemyGroup( 4, 50, 200, 'roomDrum3' );
  var g2 = new EnemyGroup( 4, 50, 200, 'roomDrum3' );
  var isInvert = Math.random()<.5 ? false : true;
  for( var i=0; i<4; i++ ){
    cue[_s+i*6] = f( g, g2, i, isInvert );
  }

  return cue;
};

enemyPattern.middleBoss = function( _s ){
  var f = function( _g ){
    return function(){
      enemies.push( new MiddleBoss( {
        group : _g
      } ) );
    };
  };

  var cue = [];

  var g = new EnemyGroup( 1, 0, 8000, 'cosmicBellpadR2' );
  cue[_s] = f( g );

  return cue;
};

enemyPattern.can = function( _s ){
  var f = function( _g ){
    return function(){
      enemies.push( new Can( {
        position : new THREE.Vector3( (Math.random()-.5)*edge.x, edge.y-5, 0 ),
        group : _g
      } ) );
    };
  };

  var cue = [];

  var g = new EnemyGroup( 0, 0, 0 );
  cue[_s] = f( g );

  return cue;
};

enemyPattern.bacura = function( _s ){
  var f = function( _g ){
    return function(){
      enemies.push( new Bacura( {
        position : new THREE.Vector3( (Math.random()-.5)*edge.x*1.5, edge.y, 0 ),
        group : _g
      } ) );
    };
  };

  var cue = [];

  var g = new EnemyGroup( 0, 0, 0 );
  for( var i=0; i<8; i++ ){
    cue[_s+i*6] = f( g );
  }
  cue[128] = undefined;

  return cue;
};
