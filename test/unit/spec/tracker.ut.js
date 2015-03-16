import tracker from '../../../src/services/tracker.js';

describe('tracker',function(){
    beforeEach(function(){
        tracker.constructor();
    });

    afterAll(function() {
        tracker.constructor();
    });

    describe('tracker',function(){
        describe('api',function(){
            it('defaults to ga',function(){
                expect(tracker.api()).toEqual('ga');
            });

            it('can be overridden',function(){
                expect(tracker.api('other')).toEqual('other');
            });
        });
    });

    describe('tracker',function(){
        describe('TrackerContext',function(){
            let TrackerContext;
            beforeEach(function(){
                TrackerContext = tracker.get().constructor;
                tracker.api('_c6_');
                global._c6_ = jasmine.createSpy('global._c6_()');
            });
            describe('methodContext',function(){
                it('uses ctxName if initted with one',function(){
                    let tc = new TrackerContext('xyz');
                    expect(tc.methodContext('send')).toEqual('xyz.send');
                });

                it('uses nothing if initted with _default',function(){
                    let tc = new TrackerContext('_default');
                    expect(tc.methodContext('send')).toEqual('send');
                });

                it('uses nothing if initted with nothing',function(){
                    let tc = new TrackerContext();
                    expect(tc.methodContext('send')).toEqual('send');
                });
            });

            describe('alias',function(){
                let context;
                beforeEach(function(){
                    context = new TrackerContext();
                });
                it('sets an alias of you pass in a name and val',function(){
                    context.alias('a1','b1');
                    context.alias('a2','b2');
                    expect(context.aliases.a1).toEqual('b1');
                    expect(context.aliases.a2).toEqual('b2');
                });

                it('returns an alias if you only pass in a name',function(){
                    context.alias('a1','b1');
                    context.alias('a2','b2');
                    expect(context.alias('a1')).toEqual('b1');
                    expect(context.alias('a2')).toEqual('b2');
                });

                it('returns the name passed if not an alias',function(){
                    expect(context.alias('a1')).toEqual('a1');
                    expect(context.alias('a2')).toEqual('a2');
                });

                it('clears an alias if you pass null as the value',function(){
                    context.alias('a1','b1');
                    context.alias('a2','b2');
                    context.alias('a1',null);
                    expect(context.alias('a1')).toEqual('a1');
                    expect(context.alias('a2')).toEqual('b2');
                });

                it('can take a hash of name,vals',function(){
                    context.alias({
                        a1 : 'b1',
                        a2 : 'b2',
                        a3 : 'b3'
                    });
                    expect(context.alias('a1')).toEqual('b1');
                    expect(context.alias('a2')).toEqual('b2');
                    expect(context.alias('a3')).toEqual('b3');
                    context.alias({
                        a1 : 'c1',
                        a2 : null,
                        a3 : 'c3'
                    });
                    expect(context.alias('a1')).toEqual('c1');
                    expect(context.alias('a2')).toEqual('a2');
                    expect(context.alias('a3')).toEqual('c3');
                });
            });

            describe('create',function(){
                it('proxies call to underlying api create',function(){
                    let tc = new TrackerContext('tt');
                    tc.create('param1','param2');
                    expect(global._c6_.calls.argsFor(0))
                        .toEqual(['create','param1','param2']);
                    expect(global._c6_.calls.argsFor(1))
                        .toEqual(['tt.require','displayfeatures']);
                });

                it('sets the created property when called',function(){
                    let tc = new TrackerContext('tt');
                    expect(tc.created).toEqual(false);
                    tc.create('param1','param2');
                    expect(tc.created).toEqual(true);
                });
            });

            describe('set',function(){
                let context;
                beforeEach(function(){
                    context = new TrackerContext('tt');
                });

                it('handles a single property',function(){
                    context.set('prop1','val1');
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.set','prop1','val1');
                });

                it('handles a property object',function(){
                    let obj = {
                        prop1 : 'val1',
                        prop2 : 'val2'
                    };
                    context.set(obj);
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.set',obj);
                });

                it('handles a single property with an alias',function(){
                    context.alias('algebra','prop1');
                    context.set('algebra','val1');
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.set','prop1','val1');
                });

                it('handles a property object with aliases',function(){
                    context.alias('algebra','prop1');
                    context.alias('geometry','prop2');
                    context.set({
                        algebra : 'val1',
                        geometry : 'val2'
                    });
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.set',{
                            prop1 : 'val1',
                            prop2 : 'val2'
                        });
                });

            });

            describe('trackPage',function(){
                let context;
                beforeEach(function(){
                    context = new TrackerContext('tt');
                });

                it('works with no arguments',function(){
                    context.trackPage();
                    expect(global._c6_).toHaveBeenCalledWith('tt.send','pageview');
                });

                it('works with just a page',function(){
                    context.trackPage('/somepage');
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send','pageview','/somepage');
                });

                it('works with a page and title as params',function(){
                    context.trackPage('/mypage','My Page');
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send','pageview',{
                            page  : '/mypage',
                            title : 'My Page'
                        });
                });

                it('works with a page object',function(){
                    context.trackPage({
                        page : '/mypage',
                        title: 'My Page'
                    });
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send','pageview',{
                            page  : '/mypage',
                            title : 'My Page'
                        });
                });

                it('works with a page object with aliases',function(){
                    context.alias('prop1','dimension1');
                    context.alias('prop2','dimension2');
                    context.trackPage({
                        page  : '/mypage',
                        title : 'My Page',
                        prop1 : 'val1',
                        prop2 : 'val2',
                    });
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send','pageview',{
                            page  : '/mypage',
                            title : 'My Page',
                            dimension1 : 'val1',
                            dimension2 : 'val2'
                        });
                });
            });

            describe('trackEvent',function(){
                let context;
                beforeEach(function(){
                    context = new TrackerContext('tt');
                });

                it('works with category and action params',function(){
                    context.trackEvent('cat1','action1');
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send',{
                            hitType         : 'event',
                            eventCategory   : 'cat1',
                            eventAction     : 'action1'
                        });
                });

                it('works with category, action and label params',function(){
                    context.trackEvent('cat1','action1','label1');
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send',{
                            hitType         : 'event',
                            eventCategory   : 'cat1',
                            eventAction     : 'action1',
                            eventLabel      : 'label1'
                        });
                });

                it('works with category, action ,label and value params',function(){
                    context.trackEvent('cat1','action1','label1',99);
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send',{
                            hitType         : 'event',
                            eventCategory   : 'cat1',
                            eventAction     : 'action1',
                            eventLabel      : 'label1',
                            eventValue      : 99
                        });
                });

                it('works with an event object', function(){
                    context.trackEvent({
                        eventCategory : 'cat1',
                        eventAction   : 'action1',
                    });
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send',{
                            hitType         : 'event',
                            eventCategory   : 'cat1',
                            eventAction     : 'action1'
                        });
                });

                it('works with an event object using aliases', function(){
                    context.alias('category','eventCategory');
                    context.alias('action','eventAction');
                    context.alias('customProp','dimension1');
                    context.trackEvent({
                        category : 'cat1',
                        action   : 'action1',
                        customProp : 'val1'
                    });
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send',{
                            hitType         : 'event',
                            eventCategory   : 'cat1',
                            eventAction     : 'action1',
                            dimension1      : 'val1'
                        });
                });
            });

            describe('trackTiming',function(){
                let context;
                beforeEach(function(){
                    context = new TrackerContext('tt');
                });

                it('works with category, let and value params',function(){
                    context.trackTiming('cat1','action1',400);
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send',{
                            hitType         : 'timing',
                            timingCategory  : 'cat1',
                            timingVar       : 'action1',
                            timingValue     : 400
                        });
                });

                it('works with category, let, value and label params',function(){
                    context.trackTiming('cat1','action1',276,'label1');
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send',{
                            hitType         : 'timing',
                            timingCategory   : 'cat1',
                            timingVar        : 'action1',
                            timingValue      : 276,
                            timingLabel      : 'label1'
                        });
                });

                it('works with a timing object', function(){
                    context.trackTiming({
                        timingCategory : 'cat1',
                        timingVar   : 'action1',
                        timingValue : 42
                    });
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send',{
                            hitType         : 'timing',
                            timingCategory   : 'cat1',
                            timingVar     : 'action1',
                            timingValue   : 42
                        });
                });

                it('works with a timing object using aliases', function(){
                    context.alias('category','timingCategory');
                    context.alias('tvar','timingVar');
                    context.alias('tval','timingValue');
                    context.alias('customProp','dimension1');
                    context.trackTiming({
                        category : 'cat1',
                        tvar   : 'action1',
                        tval   : 33,
                        customProp : 'val1'
                    });
                    expect(global._c6_)
                        .toHaveBeenCalledWith('tt.send',{
                            hitType         : 'timing',
                            timingCategory  : 'cat1',
                            timingVar       : 'action1',
                            timingValue     : 33,
                            dimension1      : 'val1'
                        });
                });
            });

        });

        describe('get()',function(){
            it('returns a default context if none passed',function(){
                let def = tracker.get();
                expect(tracker.__private__.contexts._default).toBe(def);
            });

            it('creates a new named context if referenced',function(){
                expect(tracker.__private__.contexts).toEqual({});
                let t = tracker.get('abc');
                expect(tracker.__private__.contexts.abc).toBe(t);
            });

            it('returns an existing named context if exists',function(){
                let tracker1 = tracker.get('abc'),
                    tracker2 = tracker.get('abc');
                expect(tracker2).toBe(tracker1);

            });
        });
    });
});
