describe ("Load Sample\n", function (){
	var harness = new ngHarness([
			'sample',
			'template.html'
	]),
	parent={
		message:'Hello'
	};

	it('Expect innerHTML to contain message', function (){
		expect( 
			harness.compileElement('<sample-demo message="message"></sample-demo>', parent).html()
		).toContain('Hello');
	});

	it('Expect scope.message to equal message', function (){
		expect(
			harness.getIsolate('<sample-demo message="message"></sample-demo>', parent).message
		).toEqual('Hello');
	});

	it('Expect div element to have the class from the incoming html', function (){
		var elm = harness.compileElement('<sample-demo class="showMe" message="message"></sample-demo>', parent);
		expect( 
			elm.hasClass ('showMe')
		).toBeTruthy();
	});
})
