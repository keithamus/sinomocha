(function (global) {
    var assert, sinonMocha;
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        assert = require('./assert');
        sinonMocha = require('../index')();
    } else {
        assert = global.assert;
    }

    describe('sinomocha', function () {

        describe('stubbing-test only', function () {
            var object = {},
                methodOne = object.methodOne = function () {},
                methodTwo = object.methodTwo = function () {},
                methodThree = object.methodThree = function () {};

            it('stubs methodOne successfully', function () {
                this.stub(object, 'methodOne');
                assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
            });

            it('stub are reset per test', function () {
                assert.equal(object.methodOne, methodOne, 'methodOne should not be a stub');
            });

            it('stubs can be re-run per test', function () {
                this.stub(object, 'methodOne');
                assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
            });

        });

        describe('stubbing-beforeEach', function () {
            var object = {},
                methodOne = object.methodOne = function () {},
                methodTwo = object.methodTwo = function () {},
                methodThree = object.methodThree = function () {};

            beforeEach(function () {
                this.stub(object, 'methodOne');
                assert(this.spy, 'this.spy should exist');
                assert(this.stub, 'this.stub should exist');
                assert(this.mock, 'this.mock should exist');
            });

            it('stubs methodOne successfully', function () {
                assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
            });

            it('resets stubs on each test...', function () {
                object.methodOne();
                assert(object.methodOne.called, 'methodOne should be called');
            });

            it('...so each test gets a new stub', function () {
                assert.equal(object.methodOne.called, false, 'methodOne should not be called');
            });

            it('does not stub methodTwo', function () {
                assert.equal(object.methodTwo, methodTwo, 'methodTwo should not be a stub');
            });

            it('does not stub methodThree', function () {
                assert.equal(object.methodThree, methodThree, 'methodThree should not be a stub');
            });

            describe('second layer', function () {

                beforeEach(function () {
                    this.stub(object, 'methodTwo');
                });

                it('stubs methodOne successfully', function () {
                    assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
                });

                it('stubs methodTwo successfully', function () {
                    assert(object.methodTwo.restore.sinon, 'methodTwo should be a stub');
                });

                it('resets stubs on each test...', function () {
                    object.methodOne();
                    object.methodTwo();
                    assert(object.methodOne.called, 'methodOne should be called');
                    assert(object.methodTwo.called, 'methodTwo should be called');
                });

                it('...so each test gets a new stub', function () {
                    assert.equal(object.methodOne.called, false, 'methodOne should not be called');
                    assert.equal(object.methodTwo.called, false, 'methodTwo should not be called');
                });

                it('does not stub methodThree', function () {
                    assert.equal(object.methodThree, methodThree, 'methodThree should not be a stub');
                });

                it('can still have a function stubbed on inside a test...', function () {
                    this.spy(object, 'methodThree');
                    assert(object.methodThree.restore.sinon, 'methodThree should be a spy');
                });

                it('...but the method is reset after the test', function () {
                    assert.equal(object.methodThree, methodThree, 'methodThree should not be a stub');
                });

                describe('third layer', function () {

                    beforeEach(function () {
                        this.stub(object, 'methodThree');
                    });

                    it('stubs methodOne successfully', function () {
                        assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
                    });

                    it('stubs methodTwo successfully', function () {
                        assert(object.methodTwo.restore.sinon, 'methodTwo should be a stub');
                    });

                    it('stubs methodThree successfully', function () {
                        assert(object.methodThree.restore.sinon, 'methodThree should be a stub');
                    });

                    it('resets stubs on each test...', function () {
                        object.methodOne();
                        object.methodTwo();
                        object.methodThree();
                        assert(object.methodOne.called, 'methodOne should be called');
                        assert(object.methodTwo.called, 'methodTwo should be called');
                        assert(object.methodThree.called, 'methodThree should be called');
                    });

                    it('...so each test gets a new stub', function () {
                        assert.equal(object.methodOne.called, false, 'methodOne should not be called');
                        assert.equal(object.methodTwo.called, false, 'methodTwo should not be called');
                        assert.equal(object.methodThree.called, false, 'methodThree should not be called');
                    });

                });

                describe('outside of third layer', function () {

                    it('stubs methodOne successfully', function () {
                        assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
                    });

                    it('stubs methodTwo successfully', function () {
                        assert(object.methodTwo.restore.sinon, 'methodTwo should be a stub');
                    });

                    it('does not stub methodThree', function () {
                        assert.equal(object.methodThree, methodThree, 'methodThree should not be a stub');
                    });

                });

            });

            describe('outside of second layer', function () {

                it('stubs methodOne successfully', function () {
                    assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
                });

                it('does not stub methodTwo', function () {
                    assert.equal(object.methodTwo, methodTwo, 'methodTwo should not be a stub');
                });

                it('does not stub methodThree', function () {
                    assert.equal(object.methodThree, methodThree, 'methodThree should not be a stub');
                });

            });

            describe('weird test with multiple beforeEaches', function () {

                var sandbox;

                beforeEach(function () {
                    sandbox = this._sandboxEach;
                });
                beforeEach(function () {
                    assert.equal(sandbox, this._sandboxEach, 'sandbox should not change');
                });
                beforeEach(function () {
                    assert.equal(sandbox, this._sandboxEach, 'sandbox should not change');
                });
                beforeEach(function () {
                    assert.equal(sandbox, this._sandboxEach, 'sandbox should not change');
                });
                afterEach(function () {});
                afterEach(function () {});
                afterEach(function () {});
                afterEach(function () {});

                it('stubs methodOne successfully', function () {
                    assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
                });

                it('resets stubs on each test...', function () {
                    object.methodOne();
                    assert(object.methodOne.called, 'methodOne should be called');
                });

                it('...so each test gets a new stub', function () {
                    assert.equal(object.methodOne.called, false, 'methodOne should not be called');
                });

                it('does not stub methodTwo', function () {
                    assert.equal(object.methodTwo, methodTwo, 'methodTwo should not be a stub');
                });

                it('does not stub methodThree', function () {
                    assert.equal(object.methodThree, methodThree, 'methodThree should not be a stub');
                });

            });

        });

        describe('stubbing-before', function () {
            var object = {},
                methodOne = object.methodOne = function () {},
                methodTwo = object.methodTwo = function () {},
                methodThree = object.methodThree = function () {};

            before(function () {
                this.stub(object, 'methodOne');
                assert(this.spy, 'this.spy should exist');
                assert(this.stub, 'this.stub should exist');
                assert(this.mock, 'this.mock should exist');
            });

            it('stubs methodOne successfully', function () {
                assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
            });

            it('stubs are reset per describe...', function () {
                object.methodOne();
                assert(object.methodOne.called, 'methodOne should be called');
            });

            it('...so each test can still assert on the same stub', function () {
                assert(object.methodOne.called, 'methodOne should be called');
            });

            it('does not stub methodTwo', function () {
                assert.equal(object.methodTwo, methodTwo, 'methodTwo should not be a stub');
            });

            it('does not stub methodThree', function () {
                assert.equal(object.methodThree, methodThree, 'methodThree should not be a stub');
            });

            it('can still have a function stubbed on inside a test...', function () {
                this.spy(object, 'methodThree');
                assert(object.methodThree.restore.sinon, 'methodThree should be a spy');
            });

            it('...but the method is reset after the test', function () {
                assert.equal(object.methodThree, methodThree, 'methodThree should not be a stub');
            });

            describe('second layer', function () {

                before(function () {
                    this.stub(object, 'methodTwo');
                });

                it('stubs methodOne successfully', function () {
                    assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
                });

                it('stubs methodTwo successfully', function () {
                    assert(object.methodTwo.restore.sinon, 'methodTwo should be a stub');
                });

                it('stubs are reset per describe...', function () {
                    object.methodOne();
                    object.methodTwo();
                    assert(object.methodOne.called, 'methodOne should be called');
                    assert(object.methodTwo.called, 'methodTwo should be called');
                });

                it('...so each test can still assert on the same stub', function () {
                    assert(object.methodOne.called, 'methodOne should be called');
                    assert(object.methodTwo.called, 'methodTwo should be called');
                });

                it('does not stub methodThree', function () {
                    assert.equal(object.methodThree, methodThree, 'methodThree should not be a stub');
                });

                describe('third layer', function () {

                    before(function () {
                        this.stub(object, 'methodThree');
                    });

                    it('stubs methodOne successfully', function () {
                        assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
                    });

                    it('stubs methodTwo successfully', function () {
                        assert(object.methodTwo.restore.sinon, 'methodTwo should be a stub');
                    });

                    it('stubs methodThree successfully', function () {
                        assert(object.methodThree.restore.sinon, 'methodThree should be a stub');
                    });

                    it('stubs are reset per describe...', function () {
                        object.methodOne();
                        object.methodTwo();
                        object.methodThree();
                        assert(object.methodOne.called, 'methodOne should be called');
                        assert(object.methodTwo.called, 'methodTwo should be called');
                        assert(object.methodThree.called, 'methodThree should be called');
                    });

                    it('...so each test can still assert on the same stub', function () {
                        assert(object.methodOne.called, 'methodOne should be called');
                        assert(object.methodTwo.called, 'methodTwo should be called');
                        assert(object.methodThree.called, 'methodThree should be called');
                    });

                });

                describe('outside of third layer', function () {

                    it('stubs methodOne successfully', function () {
                        assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
                    });

                    it('stubs methodTwo successfully', function () {
                        assert(object.methodTwo.restore.sinon, 'methodTwo should be a stub');
                    });

                    it('does not stub methodThree', function () {
                        assert.equal(object.methodThree, methodThree, 'methodThree should not be a stub');
                    });

                });

            });

            describe('outside of second layer', function () {

                it('stubs methodOne successfully', function () {
                    assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
                });

                it('does not stub methodTwo', function () {
                    assert.equal(object.methodTwo, methodTwo, 'methodTwo should not be a stub');
                });

                it('does not stub methodThree', function () {
                    assert.equal(object.methodThree, methodThree, 'methodThree should not be a stub');
                });

            });

            describe('weird test with multiple befores', function () {

                var sandbox;

                before(function () {
                    sandbox = this._sandboxAll;
                });
                before(function () {
                    assert.equal(sandbox, this._sandboxAll, 'sandbox should not change');
                });
                before(function () {
                    assert.equal(sandbox, this._sandboxAll, 'sandbox should not change');
                });
                before(function () {
                    assert.equal(sandbox, this._sandboxAll, 'sandbox should not change');
                });
                after(function () {});
                after(function () {});
                after(function () {});
                after(function () {});

                it('stubs methodOne successfully', function () {
                    assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
                });

                it('stubs are reset per describe...', function () {
                    object.methodOne();
                    assert(object.methodOne.called, 'methodOne should be called');
                });

                it('...so each test can still assert on the same stub', function () {
                    assert(object.methodOne.called, 'methodOne should be called');
                });

                it('does not stub methodTwo', function () {
                    assert.equal(object.methodTwo, methodTwo, 'methodTwo should not be a stub');
                });

                it('does not stub methodThree', function () {
                    assert.equal(object.methodThree, methodThree, 'methodThree should not be a stub');
                });

            });

        });

        describe('beforeEach and beforeAll', function () {
            var object = {},
                methodOne = object.methodOne = function () {},
                methodTwo = object.methodTwo = function () {};

            before(function () {
                this.stub(object, 'methodOne');
                assert(this.spy, 'this.spy should exist');
                assert(this.stub, 'this.stub should exist');
                assert(this.mock, 'this.mock should exist');
            });

            beforeEach(function () {
                this.stub(object, 'methodTwo');
                assert(this.spy, 'this.spy should exist');
                assert(this.stub, 'this.stub should exist');
                assert(this.mock, 'this.mock should exist');
            });

            it('stubs methodOne successfully', function () {
                assert(object.methodOne.restore.sinon, 'methodOne should be a stub');
            });

            it('`all` stubs are reset per describe...', function () {
                object.methodOne();
                assert(object.methodOne.called, 'methodOne should be called');
            });

            it('...so each test can still assert on the same stub', function () {
                assert(object.methodOne.called, 'methodOne should be called');
            });

            it('resets `each` stubs on each test...', function () {
                object.methodTwo();
                assert(object.methodTwo.called, 'methodTwo should be called');
            });

            it('...so each test gets a new stub', function () {
                assert.equal(object.methodTwo.called, false, 'methodTwo should not be called');
            });

            it('resets `each` stubs on each test...', function () {
                object.methodTwo();
                assert(object.methodTwo.called, 'methodTwo should be called');
            });

            it('...so each test gets a new stub', function () {
                assert.equal(object.methodTwo.called, false, 'methodTwo should not be called');
            });

        });

        describe('fake timers-test only', function () {

            it('works', function (done) {
                this.useFakeTimers();
                setTimeout(done, 3000);
                this.clock.tick(3000);
            });

            it('are only created per test, so other tests return back to normal', function (done) {
                setTimeout(done, 1);
            })

        });

        describe('fake timers-beforeEach', function () {

            beforeEach(function () {
                this.useFakeTimers();
            });

            it('works', function (done) {
                setTimeout(done, 3000);
                this.clock.tick(3000);
            });

            it('is reset after each test', function () {
                this.clock.tick(1);
                assert.equal(this.clock.now, 1, 'this.clock.now should equal 1');
            })

        });

        describe('fake timers-before', function () {

            before(function () {
                this.useFakeTimers();
            });

            it('works', function (done) {
                setTimeout(done, 3000);
                this.clock.tick(3000);
            });

            it('is not reset after each test', function () {
                this.clock.tick(1);
                assert.equal(this.clock.now, 3001, 'this.clock.now should equal 3001');
            });

            it('can have a temporary fake timer added from the test...', function (done) {
                this.useFakeTimers();
                setTimeout(done, 10240);
                this.clock.tick(10240);
            });

            it('...but the main timer still works the same', function () {
                this.clock.tick(1);
                assert.equal(this.clock.now, 3002, 'this.clock.now should equal 3001');
            });

        });

        describe('sample tests', function () {

            describe('long tests', function () {

                describe('durations', function () {

                    describe('when slow', function () {

                        it('should highlight in red', function (done){
                            setTimeout(function () {
                                done();
                            }, 100);
                        });

                    });

                    describe('when reasonable', function () {

                        it('should highlight in yellow', function (done){
                            setTimeout(function () {
                                done();
                            }, 50);
                        });

                    });

                    describe('when fast', function () {

                        it('should highlight in green', function (done){
                            setTimeout(function () {
                                done();
                            }, 10);
                        });

                    });

                });

            });

            describe('non-async but async', function () {

                it('works', function (done) {
                    done();
                });

            });

            describe('Context', function () {

                beforeEach(function () {
                    this.calls = ['before'];
                });

                describe('nested', function () {

                    beforeEach(function () {
                        this.calls.push('before two');
                    });

                    it('should work', function () {
                        assert.deepEqual(this.calls, ['before', 'before two'], '[before, before two]');
                        this.calls.push('test');
                    });

                    after(function () {
                        assert.deepEqual(this.calls, ['before', 'before two', 'test'], '[before, before two, test]');
                        this.calls.push('after two');
                    });

                });

                after(function () {
                    assert.deepEqual(this.calls, ['before', 'before two', 'test', 'after two'], '[before, before two, test, after two]');
                });

            });

        });

        describe('all together now', function () {
            var object = {
                    methodOne: function () {},
                    methodTwo: function () {},
                    methodThree: function () {},
                };

            before(function () {
                this.stub(object, 'methodOne');
            });

            beforeEach(function () {
                this.stub(object, 'methodTwo');
            });

            it('stubs in before work', function () {
                assert(object.methodOne.restore.sinon);
                object.methodOne();
                assert(object.methodOne.called);
            });

            it('stubs in before survive through the description', function () {
                assert(object.methodOne.called);
            });

            it('stubs in beforeEach work', function () {
                assert(object.methodTwo.restore.sinon);
                object.methodTwo();
                assert(object.methodTwo.called);
            });

            it('stub in beforeEach will be reset for each test', function () {
                assert(object.methodTwo.called === false);
            });

            it('stubs in an test work', function () {
                this.stub(object, 'methodThree');
                object.methodThree();
                assert(object.methodThree.called);
            });

            it('stub in an test exist only for that test', function () {
                assert(object.methodThree.restore === undefined);
            });

        });

    });
})(typeof window === 'undefined' ? global : window);
