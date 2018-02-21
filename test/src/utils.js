import 'jsdom-global/register'
import Utils from 'utils';

describe('Utils', function () {
    describe('parseUrlParams', function () {
        context('when url contains player link', function () {
            it('parses base_url and name correctly', function (done) {
                const res = Utils.parseUrlParams('http://www.example.com/pc/CobraKiller');

                expect(res.name).to.equal('CobraKiller');
                expect(res.base_url).to.equal('http://www.example.com');
                expect(res.game).to.be.undefined;
                done();
            });

            it('parses PC platform correctly', function (done) {
                const res = Utils.parseUrlParams('http://www.example.com/pc/CobraKiller');

                expect(res.platform).to.equal(4);
                done();
            });

            it('parses psn platform correctly', function (done) {
                const res = Utils.parseUrlParams('http://www.example.com/psn/CobraKiller');

                expect(res.platform).to.equal(2);
                done();
            });

            it('parses xbox platform correctly', function (done) {
                const res = Utils.parseUrlParams('http://www.example.com/xbox/CobraKiller');

                expect(res.platform).to.equal(1);
                done();
            });
        });

        context('when url contains game link', function () {
            it('parses game ID correctly', function (done) {
                const res = Utils.parseUrlParams('http://www.example.com/game/1234567890');

                expect(res.game).to.equal('1234567890');
                done();
            });

            it('does not parse platform and name', function (done) {
                const res = Utils.parseUrlParams('http://www.example.com/game/1234567890');

                expect(res.name).to.be.undefined;
                expect(res.platform).to.be.undefined;
                done();
            });
        });
    });

    describe('isNumeric', function () {
        it('returns true for numeric/int string', function (done) {
            expect(Utils.isNumeric('12345')).to.be.true;
            done();
        });

        it('returns true for numeric/float string', function (done) {
            expect(Utils.isNumeric('12345.093')).to.be.true;
            done();
        });

        it('returns true for numeric/negative string', function (done) {
            expect(Utils.isNumeric('-12345')).to.be.true;
            done();
        });

        it('returns true for numeric/positive string', function (done) {
            expect(Utils.isNumeric('+12345')).to.be.true;
            done();
        });

        it('returns false for numeric string with characters at the beginning', function (done) {
            expect(Utils.isNumeric('aaa12345')).to.be.false;
            done();
        });

        it('returns false for numeric string with characters at the end', function (done) {
            expect(Utils.isNumeric('12345aa')).to.be.false;
            done();
        });
    });

    describe('formatDate', function () {
        context('when includeTime is true', function () {
            it('returns date with time', function (done) {
                expect(Utils.formatDate('2018-01-05T20:06:21Z', true)).to.equal('Fri 01-05-2018 03:06');
                done();
            });
        });

        context('when includeTime is false', function () {
            it('returns date without time', function (done) {
                expect(Utils.formatDate('2018-01-05T20:06:21Z', false)).to.equal('01-05-2018');
                done();
            });
        });
    });
});
