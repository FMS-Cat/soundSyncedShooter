var enemyWave = [];

enemyWave[1] = function(){
  var p = enemyPattern;

  var cue = [];

  for( var i=0; i<6; i++ ){
    cue = cue.concat( p.linearLinear(31) );
  }
  cue = cue.concat( p.bacura(31) );

  return cue;
};

enemyWave[2] = function(){
  var p = enemyPattern;

  var cue = [];

  var li = [
    p.linearLinear,
    p.rollingRhombusDouble
  ]

  for( var i=0; i<8; i++ ){
    cue = cue.concat( li[ Math.floor( Math.random()*li.length ) ]( 15 ) );
  }
  cue = cue.concat( p.bacura(31) );

  return cue;
};

enemyWave[3] = function(){
  var p = enemyPattern;

  var cue = [];

  var li = [
    p.linearLinear,
    p.rollingRhombusDouble,
    p.circle20hedron
  ]

  for( var i=0; i<8; i++ ){
    cue = cue.concat( li[ Math.floor( Math.random()*li.length ) ]( 15 ) );
  }
  cue = cue.concat( p.bacura(31) );

  return cue;
};

enemyWave[4] = function(){
  var p = enemyPattern;

  var cue = [];

  var li = [
    p.linearLinear,
    p.rollingRhombusDouble,
    p.circle20hedron,
    p.rollingRhombusSand
  ]

  for( var i=0; i<8; i++ ){
    cue = cue.concat( li[ Math.floor( Math.random()*li.length ) ]( 15 ) );
  }
  cue = cue.concat( p.bacura(31) );

  return cue;
};

enemyWave[5] = function(){
  var p = enemyPattern;

  var cue = [];

  var li = [
    p.turnSide,
    p.turnForward,
    p.rollingRhombusDouble,
    p.rollingRhombusSand
  ]

  for( var i=0; i<12; i++ ){
    if( Math.random() < .02 ){
      cue = cue.concat( p.can( 15 ) );
    }else{
      cue = cue.concat( li[ Math.floor( Math.random()*li.length ) ]( 15 ) );
    }
  }
  cue = cue.concat( p.bacura(31) );

  return cue;
};

enemyWave[6] = function(){
  var p = enemyPattern;

  var cue = [];

  var li = [
    p.bird,
    p.bird,
    p.rollingRhombusDouble,
    p.rollingRhombusSand
  ]

  for( var i=0; i<12; i++ ){
    if( Math.random() < .04 ){
      cue = cue.concat( p.can( 15 ) );
    }else{
      cue = cue.concat( li[ Math.floor( Math.random()*li.length ) ]( 15 ) );
    }
  }
  cue = cue.concat( p.bacura(31) );

  return cue;
};

enemyWave[7] = function(){
  var p = enemyPattern;

  var cue = [];

  var li = [
    p.turnSide,
    p.turnForward,
    p.bird,
    p.circle20hedron,
    p.rollingRhombusDouble,
    p.rollingRhombusSand
  ]

  for( var i=0; i<12; i++ ){
    if( Math.random() < .04 ){
      cue = cue.concat( p.can( 15 ) );
    }else{
      cue = cue.concat( li[ Math.floor( Math.random()*li.length ) ]( 15 ) );
    }
  }
  cue = cue.concat( p.bacura(31) );

  return cue;
};

enemyWave[8] = function(){
  var p = enemyPattern;

  var cue = [];

  var li = [
    p.turnSide,
    p.turnForward,
    p.bird,
    p.circle20hedronDouble,
    p.rollingRhombusDouble,
    p.rollingRhombusSand
  ]

  for( var i=0; i<16; i++ ){
    if( Math.random() < .07 ){
      cue = cue.concat( p.can( 11 ) );
    }else{
      cue = cue.concat( li[ Math.floor( Math.random()*li.length ) ]( 11 ) );
    }
  }
  cue = cue.concat( p.bacura(31) );

  return cue;
};

enemyWave[9] = function(){
  var p = enemyPattern;

  var cue = [];

  var li = [
    p.turnSide,
    p.turnForward,
    p.bird,
    p.circle20hedronDouble,
    p.rollingRhombusDouble,
    p.rollingRhombusSand,
    p.missile
  ]

  for( var i=0; i<16; i++ ){
    if( Math.random() < .09 ){
      cue = cue.concat( p.can( 11 ) );
    }else{
      cue = cue.concat( li[ Math.floor( Math.random()*li.length ) ]( 11 ) );
    }
  }
  cue = cue.concat( p.bacura(31) );

  return cue;
};

enemyWave[10] = function(){
  var p = enemyPattern;

  var cue = [];

  cue = cue.concat( p.middleBoss( 8 ) );

  return cue;
};

enemyWave[11] = function(){
  var p = enemyPattern;

  var cue = [];

  var li = [
    p.linearLinear,
    p.turnSide,
    p.turnForward,
    p.bird,
    p.circle20hedronDouble,
    p.rollingRhombusDouble,
    p.rollingRhombusSand,
    p.missile
  ]

  for( var i=0; i<48; i++ ){
    if( Math.random() < .1 ){
      cue = cue.concat( p.can( 7 ) );
    }else{
      cue = cue.concat( li[ Math.floor( Math.random()*li.length ) ]( 7 ) );
    }
  }
  cue = cue.concat( p.bacura(31) );

  return cue;
};
