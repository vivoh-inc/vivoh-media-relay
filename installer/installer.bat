whoami
pwd
echo SHORT-SHA: %1
curl http://binaries.vivoh.com/ffmpeg/FFmpeg.exe --output FFmpeg.exe
curl http://binaries.vivoh.com/assets/globe.mp4 --output globe.mp4
call vSign ..\build\vivoh-media-relay-win.exe
copy ..\build\vivoh-media-relay-win.exe vivoh-media-relay-%1-installer-win.exe
sed s/vivoh-media-relay/vivoh-media-relay-%1/ installer.nsi > installer.nsi.s
sed s/vivoh-media-relay/vivoh-media-relay-%1/ Launch_Webinar_Manager.bat > Launch_Webinar_Manager.bat.s
"C:\Program Files (x86)\NSIS\makensis" installer.nsi.s
call vSign Vivoh_Media_Relay_Installer.exe
copy build/Vivoh_Media_Relay_Installer.exe ..\installer\Vivoh_Media_Relay_Installer_%1.exe
:: print out the entire artifact directory to be uploaded
dir /s ..\installer
