# name the installer
OutFile "Vivoh_Media_Relay_Installer.exe"

# add branding
BrandingText "Vivoh"

 # set name of installer
Name "Vivoh Media Relay"

# set icon
# need .ico File

# set install directory to where user chooses
InstallDir $%HOMEDRIVE%

Page directory
Page instfiles

Section Install
    # define the output path for this file
    CreateDirectory $INSTDIR\Vivoh
    SetOutPath $INSTDIR\Vivoh

    # output the directory user chooses

    DetailPrint "The user has chose the directory: $INSTDIR for the install."

    # define what to install and place it in the outpath folder
    File vivoh-media-relay-win.exe
    File FFmpeg.exe
    File License.txt
    File globe.mp4
    File start-relay.bat
    File test_source.bat
    File readme.txt

SectionEnd
