// Don't catch errors.
FrontendCore.debug = true;

describe('code', function() {

	beforeEach(function(done) {
		FrontendCore.require(['code'], function() {
            if (done !== undefined) {
                done();
            }
		});
	});

	it('should exist', function( done ) {
		oTestedModule = FrontendCore.instantiate( 'code' );
		expect(oTestedModule).toBeTruthy();
	});

	describe('onStart', function() {

		beforeEach(function() {
			spyOn( FrontendTools, 'getDataModules');
			spyOn( FrontendTools, 'trackModule');
			spyOn( oTestedModule, 'autobind');
			oTestedModule.onStart();
		});

		it('should exist', function( done ) {
			expect(oTestedModule.onStart).toBeTruthy();
		});

		it('should call FrontendTools.trackModule with "JS_Libraries", "call", "code"', function( done ) {
			expect(FrontendTools.trackModule).toHaveBeenCalledWith('JS_Libraries', 'call', 'code' );
		});

	});

	describe('autobind', function( done ) {

		beforeEach(function() {
			var $Object =  $('<pre><code></code></pre>');
			spyOn(hljs, "highlightBlock");
			oTestedModule.autobind($Object[0]);
		});

		it('should exist', function( done ) {
			spyOn( oTestedModule, 'autobind');
			expect(oTestedModule.autobind).toBeTruthy();
		});

		it('should call hljs highlightBlock', function( done ) {
			expect(hljs.highlightBlock).toHaveBeenCalled();
		});

	});



});
