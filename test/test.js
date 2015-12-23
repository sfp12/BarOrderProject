require('should');

var name = 'sfp';
var user = {
	name:'sfp',
	pets:['a', 'b', 'c']
};

describe('user', function(){

	it('the user should', function(){
		user.should.have.property('name', 'sfp');
		user.should.have.property('pets').with.lengthOf(3);
		user.should.
	})
})