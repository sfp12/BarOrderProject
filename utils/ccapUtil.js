var ccap = require('ccap')({
		width:128,
		height:45,
		offset:30,
		quality:100,
		fontsize:30,
		generate:function(){
			return '1234';
		}
	});

exports.code = function(){

	var result = {};

	var ary = ccap.get();

    result.txt = ary[0];

    result.buf = ary[1];

    return result;
}
