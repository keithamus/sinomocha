(function (sinomocha) {
    "use strict";

    function findNodeJSMocha(moduleToTest, suffix) {
        if (moduleToTest.id.indexOf(suffix, moduleToTest.id.length - suffix.length) !== -1 && moduleToTest.exports) {
            return moduleToTest.exports;
        }

        for (var i = 0; i < moduleToTest.children.length; ++i) {
            var found = findNodeJSMocha(moduleToTest.children[i], suffix);

            if (found) {
                return found;
            }
        }
    }

    // Module systems magic dance.

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // Node.js: plug in automatically, if no argument is provided. This is a good idea since one can run Mocha tests
        // using the Mocha test runner from either a locally-installed package, or from a globally-installed one.
        // In the latter case, naively plugging in `require("mocha")` would end up duck-punching the wrong instance,
        // so we provide this shortcut to auto-detect which Mocha package needs to be duck-punched.
        module.exports = function (mocha) {
            if (!mocha) {
                if (typeof process === "object" && Object.prototype.toString.call(process) === "[object process]") {
                    // We're in *real* Node.js, not in a browserify-like environment. Do automatic detection logic.

                    // Funky syntax prevents Browserify from detecting the require, since it's needed for Node.js-only stuff.
                    var path = (require)("path");
                    var suffix = path.join("mocha", "lib", "mocha.js");
                    mocha = findNodeJSMocha(require.main, suffix);

                    if (mocha === undefined) {
                        throw new Error("Attempted to automatically plug in to Mocha, but could not detect a " +
                                        "running Mocha module.");
                    }

                } else if (typeof Mocha !== "undefined") {
                    // We're in a browserify-like emulation environment. Try the `Mocha` global.
                    mocha = Mocha;
                } else {
                    throw new Error("Attempted to automatically plug in to Mocha, but could not detect the " +
                                    "environment. Plug in manually by passing the running Mocha module.");
                }
            }

            sinomocha(mocha);
        };
    } else if (typeof define === "function" && define.amd) {
        // AMD
        define(function () {
            return sinomocha;
        });
    } else {
        // Other environment (usually <script> tag): plug in global `Mocha` directly and automatically.
        sinomocha(Mocha);
    }
}((function () {
    'use strict';
    var duckPunchedAlready = false,
        nop = function () {},
        sinon;

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        sinon = require('sinon');
    } else {
        sinon = (typeof window === 'undefined' ? global : window).sinon;
    }

    function setupSandbox(context) {
        return function setupSandbox() {
            var oldSandbox = context._sandbox;
            context._sandbox = sinon.sandbox.create({
                injectInto: context,
                properties: ['spy', 'stub', 'mock', 'clock', 'server', 'requests'],
                useFakeTimers: false,
                useFakeServer: false
            });
            context.spy = context.spy.bind(context._sandbox);
            context.stub = context.stub.bind(context._sandbox);
            context.useFakeServer = function () {
                context._sandbox.useFakeServer();
                context.server = context._sandbox.server;
            }
            context.useFakeTimers = function () {
                context._sandbox.useFakeTimers();
                context.clock = context._sandbox.clock;
            }
            context.useFakeXMLHttpRequest = function () {
                context._sandbox.useFakeXMLHttpRequest();
                context.requests = context._sandbox.requests;
            }
            if (oldSandbox) {
                context._sandbox.parent = oldSandbox;
            }
        }
    }

    function teardownSandbox(context) {
        return function teardownSandbox() {
            if (!context._sandbox) return;
            context._sandbox.restore();
            delete context.spy;
            delete context.stub;
            delete context.mock;
            delete context.clock;
            delete context.server;
            delete context.requests;
            delete context.useFakeServer;
            delete context.useFakeTimers;
            delete context.useFakeXMLHttpRequest;
            if (context._sandbox.parent) {
                context._sandbox = context._sandbox.parent;
                context.spy = context._sandbox.spy.bind(context._sandbox);
                context.stub = context._sandbox.stub.bind(context._sandbox);
                context.mock = context._sandbox.mock;
                context.clock = context._sandbox.clock;
                context.server = context._sandbox.server;
                context.requests = context._sandbox.requests;
                context.useFakeServer = context._sandbox.useFakeServer;
                context.useFakeTimers = context._sandbox.useFakeTimers;
                context.useFakeXMLHttpRequest = context._sandbox.useFakeXMLHttpRequest;
            }
        }
    }

    return function sinomocha(mocha) {
        if (duckPunchedAlready) {
            return;
        }
        duckPunchedAlready = true;

        var oldBeforeEach = mocha.Suite.prototype.beforeEach,
            oldBeforeAll = mocha.Suite.prototype.beforeAll,
            oldRun = mocha.Test.prototype.run;

        mocha.Suite.prototype.beforeEach = function beforeEach(beforeFunction) {
            if (!this._sandboxedEach) {
                this._sandboxedEach = true;
                oldBeforeEach.call(this, setupSandbox(this.ctx));
                this.afterEach(teardownSandbox(this.ctx));
            }
            return oldBeforeEach.call(this, beforeFunction);
        };

        mocha.Suite.prototype.beforeAll = function beforeAll(beforeFunction) {
            if (!this._sandboxedAll) {
                this._sandboxedAll = true;
                oldBeforeAll.call(this, setupSandbox(this.ctx));
                this.afterAll(teardownSandbox(this.ctx));
            }
            return oldBeforeAll.call(this, beforeFunction);
        };

        mocha.Test.prototype.run = function (callback) {
            var fn = this.fn, context = this.ctx;
            this.fn = function (done) {
                setupSandbox(context)();
                return fn.call(context, done);
            };
            this.fn.toString = function () {
                return fn.toString();
            }
            return oldRun.call(this, function (err) {
                teardownSandbox(context)();
                return callback.call(context, err || null);
            });
        }

    };
}())));
