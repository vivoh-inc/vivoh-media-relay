const { processConfig } = require("../src/config");
const expect = require("expect");

describe("#config", () => {
  it("process a config generally", () => {
    const args = {
      l: "fdgds/sdfsfd",
      d: "abc"
    };
    const config = processConfig(args);
    expect(config).toBeTruthy();
  });

    describe( "#ipAddress", () => {
	it( "should get 0.0.0.0 by default", () => {
	    const config = processConfig( {} );
	    expect( config.ipAddress ).toBe( '0.0.0.0' );
	});

	it( "should allow specifying it", () => {
	    const config = processConfig( { i: "192.168.1.1" } );
	    expect( config.ipAddress ).toBe( '192.168.1.1' );
	});
	
    });
    
    it("should get the correct segmenter (ffmpeg by default)", () => {
	const args = {};
	const config = processConfig(args);
	expect(config.segmenter.name).toBe("ffmpeg");
	expect(config.useFfmpeg).toBeTruthy();
    });
    
    it( "should allow setting ffmpeg", () => {
	const args = {f: true};
	const config = processConfig(args)
	expect(config.useVlc).toBeFalsy();
	expect(config.useFfmpeg).toBeTruthy();
	expect(config.segmenter.name).toBe("ffmpeg");
    })

});
