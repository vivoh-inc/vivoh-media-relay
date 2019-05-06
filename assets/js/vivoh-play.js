let ip = undefined;
let port = undefined;
let player = undefined;

function play() {
    const host = document.location.host;
    const url = `ws://${host}/239.0.0.1:1234`;
    const canvas = document.getElementById('video-canvas');
    console.log( "Will play: ", url, "canvas", canvas )
    if (player) {
	player.destroy();
    }
    else {
	player = new JSMpeg.Player(url, {canvas});
    }
}

