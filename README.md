# vivoh-media-relay

## Usage

`vivoh-media-relay`

## Required components

Needs FFmpeg installed.

## Command line options

```
-p port of local web server ... eg "8888"
-i IP address to bind to.
-d temporary directory for TS files (use -o to overwrite existing TS files)

--ffmpegExtras eg: --ffmpegExtras='-c:a aac -ar 48000 -b:a 128k -c:v h264 -profile:v main -crf 20 -g 48 -keyint_min 48 -sc_threshold 0 -b:v 2500k -maxrate 2675k -bufsize 3750k -hls_time 4 -hls_flags delete_segments'
--ffmpegBin: ffmpeg binary, eg: --ffmpegBin=/usr/local/bin/ffmpeg
--ffmpegLogFile: log file for ffmpeg to use, eg: -ffmpegLogFile=./ffmpeg.log
```
