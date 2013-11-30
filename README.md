sinomocha
===========

Sinon.JS integration for the Mocha test harness

Do you get annoyed when writing your Mocha tests with Sinon stubs - that you
have to ceremoniously stub and restore methods in each test, like so:

```javascript
beforeEach(function () {
    sinon.stub(my, 'method');
});

afterEach(function () {
    my.method.restore();
});
```

Maybe you've discovered sinon sandboxes, but you still have the same rigmorale:

```javascript
beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
    sinon.stub(my, 'method');
});

afterEach(function () {
    this.sandbox.restore();
});
```

Well then look no further! This convinient wrapper will add `stub`, `spy`,
`mock`, `useFakeTimers`, `useFakeServer` and `useFakeXMLHttpRequest` to the
Mocha context, and automatically restores them in the right way. It seemlessly
works with `before()`, `beforeEach()` and `it()`s so that it **just works**:

 * `before()` spies/timers/requests will survive for the whole `describe()`
 * `beforeEach()` spies/timers/requests will be reset for each `it()`
 * `it()` spies/timers/requests will live for the duration of that single `it()`

### Install

Simply add `sinomocha` to your npm dependencies:

```bash
npm install --save sinomocha
```

Then require the method and run it (it require's sinon, so don't sweat it):

```javascript
require('sinomocha')();
```

### Examples


```javascript
require('sinomocha')();
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
```

### Thanks

Thanks goes to [Domenic Denicola's](https://github.com/domenic)
[mocha as promised](https://github.com/domenic/mocha-as-promised). This is based
off of his original work.
