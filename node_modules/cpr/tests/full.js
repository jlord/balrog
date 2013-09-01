var vows = require('vows'),
    assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    cpr = require('../lib'),
    to = path.join(__dirname, './out/'),
    from = path.join(__dirname, '../node_modules');


var tests = {
    'should be loaded': {
        topic: function () {
            rimraf.sync(to);
            return cpr;
        },
        'should export raw method': function (topic) {
            assert.isFunction(topic);
        },
        'and should export cpr method too': function (topic) {
            assert.isFunction(topic.cpr);
        },
        'and should copy node_modules': {
            topic: function() {
                var out = path.join(to, '0'),
                    self = this;

                this.outDir = out;
                cpr(from, out, function(err, status) {
                    var t = {
                        status: status,
                        dirs: {
                            from: fs.readdirSync(from).sort(),
                            to: fs.readdirSync(out).sort()
                        }
                    };
                    self.callback(err, t);
                });
            },
            'has ./out/0': function(topic) {
                var stat = fs.statSync(this.outDir);
                assert.ok(stat.isDirectory());
            },
            'and dirs are equal': function(topic) {
                assert.deepEqual(topic.dirs.to, topic.dirs.from);
            },
            'and from directory has graceful-fs dir': function(topic) {
                var fromHasGFS = topic.dirs.from.some(function(item) {
                    return (item === 'graceful-fs');
                });
                assert.isTrue(fromHasGFS);
            },
            'and to directory has graceful-fs dir': function(topic) {
                var toHasGFS = topic.dirs.to.some(function(item) {
                    return (item === 'graceful-fs');
                });
                assert.isTrue(toHasGFS);
            }
        },
        'and should NOT copy node_modules': {
            topic: function() {
                var out = path.join(to, '1'),
                    self = this;

                this.outDir = out;
                cpr(from, out, {
                    filter: /node_modules/
                }, function(err) {
                    fs.stat(out, function(e, stat) {
                        var t = {
                            err: err,
                            stat: e
                        };
                        self.callback(null, t);
                    });
                });
            },
            'does not have ./out/1': function(topic) {
                assert.ok(topic.stat); //Should be an error
            },
            'and threw an error': function(topic) {
                assert.ok(topic.err); //Should be an error
                assert.equal(topic.err, 'no files to copy');
            }
        },
        'and should not copy yui-lint from regex': {
            topic: function() {
                var out = path.join(to, '2'),
                    self = this;

                this.outDir = out;
                cpr(from, out, {
                    confirm: true,
                    overwrite: true,
                    filter: /yui-lint/
                }, function(err, status) {
                    var t = {
                        status: status,
                        dirs: {
                            from: fs.readdirSync(from).sort(),
                            to: fs.readdirSync(out).sort()
                        }
                    };
                    self.callback(err, t);
                });
            },
            'and has ./out/2': function(topic) {
                var stat = fs.statSync(this.outDir);
                assert.ok(stat.isDirectory());
            },
            'and dirs are not equal': function(topic) {
                assert.notDeepEqual(topic.dirs.to, topic.dirs.from);
            },
            'and from directory has yui-lint dir': function(topic) {
                var fromHasLint = topic.dirs.from.some(function(item) {
                    return (item === 'yui-lint');
                });
                assert.isTrue(fromHasLint);
            },
            'and to directory does not have yui-lint dir': function(topic) {
                var toHasLint = topic.dirs.to.some(function(item) {
                    return (item === 'yui-lint');
                });
                assert.isFalse(toHasLint);
            }
        },
        'and should not copy minimatch from function': {
            topic: function() {
                var out = path.join(to, '3'),
                    self = this;

                this.outDir = out;
                cpr(from, out, {
                    confirm: true,
                    deleteFirst: true,
                    filter: function (item) {
                        return !(/minimatch/.test(item));
                    }
                }, function(err, status) {
                    var t = {
                        status: status,
                        dirs: {
                            from: fs.readdirSync(path.join(from, 'jshint/node_modules')).sort(),
                            to: fs.readdirSync(path.join(out, 'jshint/node_modules')).sort()
                        }
                    };
                    self.callback(err, t);
                });
            },
            'and has ./out/3': function(topic) {
                var stat = fs.statSync(this.outDir);
                assert.ok(stat.isDirectory());
            },
            'and dirs are not equal': function(topic) {
                assert.notDeepEqual(topic.dirs.to, topic.dirs.from);
            },
            'and from directory has minimatch dir': function(topic) {
                var fromHasGFS = topic.dirs.from.some(function(item) {
                    return (item === 'minimatch');
                });
                assert.isTrue(fromHasGFS);
            },
            'and to directory does not have minimatch dir': function(topic) {
                var toHasGFS = topic.dirs.to.some(function(item) {
                    return (item === 'minimatch');
                });
                assert.isFalse(toHasGFS);
            }
        },
        'and should copy node_modules with overwrite flag': {
            topic: function() {
                var out = path.join(to, '4'),
                    self = this;

                this.outDir = out;

                cpr(from, out, function() {
                    cpr(from, out, {
                        overwrite: true,
                        confirm: true
                    }, function(err, status) {
                        var t = {
                            status: status,
                            dirs: {
                                from: fs.readdirSync(from).sort(),
                                to: fs.readdirSync(out).sort()
                            }
                        };
                        self.callback(err, t);
                    });
                });
            },
            'has ./out/0': function(topic) {
                var stat = fs.statSync(this.outDir);
                assert.ok(stat.isDirectory());
            },
            'and dirs are equal': function(topic) {
                assert.deepEqual(topic.dirs.to, topic.dirs.from);
            },
            'and from directory has graceful-fs dir': function(topic) {
                var fromHasGFS = topic.dirs.from.some(function(item) {
                    return (item === 'graceful-fs');
                });
                assert.isTrue(fromHasGFS);
            },
            'and to directory has graceful-fs dir': function(topic) {
                var toHasGFS = topic.dirs.to.some(function(item) {
                    return (item === 'graceful-fs');
                });
                assert.isTrue(toHasGFS);
            }
        },
    },
    "should fail on non-existant from dir": {
        topic: function() {
            var self = this;
            cpr('./does/not/exist', path.join(to, 'does/not/matter'), function(err, status) {
                self.callback(null, {
                    err: err,
                    status: status
                });
            });
        },
        "should return an error in the callback": function(topic) {
            assert.isUndefined(topic.status);
            assert.ok(topic.err);
            assert.equal('From should be a directory', topic.err);
        }
    },
    "should fail on from not a dir": {
        topic: function() {
            var self = this;
            cpr(__filename, path.join(to, 'does/not/matter'), function(err, status) {
                self.callback(null, {
                    err: err,
                    status: status
                });
            });
        },
        "should return an error in the callback": function(topic) {
            assert.isUndefined(topic.status);
            assert.ok(topic.err);
            assert.equal('From should be a directory', topic.err);
        }
    }
};

vows.describe('CPR Tests').addBatch(tests).export(module);
