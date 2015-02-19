function merge( _a, _b ){

	ret = {};
	for( var key in _a ) { ret[key] = _a[key]; }
  for( var key in _b ) { ret[key] = _b[key]; }
	return ret;

}
