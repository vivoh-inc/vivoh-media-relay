const expect = require('expect');
const sinon = require('sinon');
const ffmpeg = require('../src/ffmpeg');

const url = 'rtp://239.0.0.1:1234';

describe('#ffmpeg', () => {
    describe('gets the correct arguments', () => {
        it('should give back nothing when no args / empty object provided', () => {
            const exeAndArgs = ffmpeg.getArgumentsForFfmpeg();
            expect(exeAndArgs).toEqual({});
            const exeAndArgs2 = ffmpeg.getArgumentsForFfmpeg({});
            expect(exeAndArgs2).toEqual({});
        });

        it('should work with just the address', () => {
            const exeAndArgs = ffmpeg.getArgumentsForFfmpeg({ url });
            expect(exeAndArgs).toEqual({
                exe: 'ffmpeg',
                args: [
                    '-i',
                    'rtp://239.0.0.1:1234',
                    '-codec',
                    'copy',
                    '-hls_flags',
                    'delete_segments',
                    'vivoh_media_relay/redirect.m3u8',
                ],
            });
        });

        it('should permit extras', () => {
            const exeAndArgs = ffmpeg.getArgumentsForFfmpeg({
                extras: { extras: '-foobar -barfoo' },
                url,
            });
            expect(exeAndArgs).toEqual({
                exe: 'ffmpeg',
                args: [
                    '-i',
                    'rtp://239.0.0.1:1234',
                    '-foobar',
                    '-barfoo',
                    'vivoh_media_relay/redirect.m3u8',
                ],
            });
        });

        it('should work with a PID', () => {
            const exeAndArgs = ffmpeg.getArgumentsForFfmpeg({
                url,
                programId: '12345',
            });
            expect(exeAndArgs).toEqual({
                exe: 'ffmpeg',
                args: [
                    '-i',
                    'rtp://239.0.0.1:1234',
                    '-codec',
                    'copy',
                    '-hls_flags',
                    'delete_segments',
                    'vivoh_media_relay/12345/redirect.m3u8',
                ],
            });
        });
    });

    describe('#launchFfmpeg', () => {
        it('should launch twice with two programs', () => {
            const _launchFfmpeg = sinon.spy();
            const _isFfmpegRunning = () => new Promise((resolve) => resolve(false));
            const config = { fixedDirectory: 'foobar', ipAddress: '2.2.2.2' };
            const dynamic = {
                on: true,
                programs: [{ programId: '12123' }, { programId: '123123' }]
            };
            ffmpeg.launchIfNecessary(config, dynamic, { _launchFfmpeg, _isFfmpegRunning }).then((_) => {
                expect(_launchFfmpeg.callCount).toBe(2);
            });
        });
    });

    describe('#checkForFfmpeg', () => {
        xit('should see if things work with faked make', (done) => {
            ffmpeg.checkForBinary({ extras: { bin: 'make' } }).then((_) => {
                expect(true).toBeTruthy();
                done();
            });
        });

        it('should fail if binary is not real', (done) => {
            ffmpeg
                .checkForBinary({ extras: { bin: '123123098091309138' } })
                .catch((_) => {
                    expect(true).toBeTruthy();
                    done();
                });
        });
    });
});