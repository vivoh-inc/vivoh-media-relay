Thank you for installing the Vivoh Media Relay!

You can start it with the start-relay.bat script or by running vivoh-media-relay-win.exe
from the command line.

You can create a test source with test_source.bat ... and you can launch the player page by clicking the "Vivoh Playback" browser short cut or by opening http://localhost.com/hls.html?s=rtp://239.0.0.1:1234

Please contact support with any questions on: support@vivoh.com

The following are advanced options that you may want to add to your start-relay.bat script.

-p port of local web server ... eg "8888"
-i IP address to bind to.
-d temporary directory for TS files (use -o to overwrite existing TS files)
-e HTTPS
-u URL to status server
-t polling time for status server
-s segmenter (default to 'ffmpeg'. Future releases may include 'tsduck' or 'vlc')

--ffmpegExtras eg: --ffmpegExtras='-c:a aac -ar 48000 -b:a 128k -c:v h264 -profile:v main -crf 20 -g 48 -keyint_min 48 -sc_threshold 0 -b:v 2500k -maxrate 2675k -bufsize 3750k -hls_time 4 -hls_flags delete_segments'

--ffmpegBin: ffmpeg binary, eg: --ffmpegBin=/usr/local/bin/ffmpeg

--ffmpegLogFile: log file for ffmpeg to use, eg: --ffmpegLogFile=./ffmpeg.log