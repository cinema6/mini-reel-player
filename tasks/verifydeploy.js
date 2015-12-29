var AWS = require('aws-sdk');
var Bluebird = require('bluebird');
var formatURL = require('url').format;
var request  = require('request-promise');
var inspect = require('util').inspect;

function concat(arrays) {
    'use strict';
    return Array.prototype.concat.apply([], arrays);
}

module.exports = function verifyDeployFactory(grunt) {
    'use strict';

    function verifyDeploy() {
        /* jshint validthis:true */
        var options = this.options({
            // required options:
            awsRegion: undefined, // aws region (to configure the aws SDK)
            asgNames: undefined, // Array of ASG names to check

            // optional options:
            protocol: 'https:', // Protocol that should be used when polling the instance.
            pathname: '/', // Pathname that should be used when polling the instance.
            query: {}, // Query params that should be used when polling the instnace.
            interval: 10, // Amount of time that should pass (in seconds) in-between instance polls.
            timeout: 600, // Amount of time to poll (in seconds) before the check fails.
            predicate: function() { return true; }, // Function that will be used to determine the
                // success of a check. Will be called with the response body of the request/
            json: true // Boolean indicating if the response body should be parsed as JSON.
        });
        var done = this.async();
        var awsConfig = {
            region: options.awsRegion
        };
        var asg = Bluebird.promisifyAll(new AWS.AutoScaling(awsConfig));

        function checkURL(url) {
            return request.get(url, { json: options.json }).then(function check(response) {
                if (options.predicate(response)) {
                    return true;
                } else {
                    return Bluebird.delay(options.interval * 1000).then(checkURL.bind(null, url));
                }
            });
        }

        grunt.log.writeln('Describing ' + options.asgNames.length + ' ASGs.');

        asg.describeAutoScalingGroupsAsync({
            AutoScalingGroupNames: options.asgNames
        }).then(function getInstanceData(response) {
            var instanceIds = concat(response.AutoScalingGroups.map(function(group) {
                return group.Instances.filter(function(instance) {
                    return instance.LifecycleState === 'InService';
                }).map(function(instance) {
                    return instance.InstanceId;
                });
            }));
            var ec2 = Bluebird.promisifyAll(new AWS.EC2(awsConfig));

            grunt.log.writeln('Describing ' + instanceIds.length + ' EC2 instances.');

            return ec2.describeInstancesAsync({ InstanceIds: instanceIds });
        }).then(function getURLs(response) {
            return concat(response.Reservations.map(function(reservation) {
                return reservation.Instances.map(function(instance) {
                    return formatURL({
                        protocol: options.protocol,
                        pathname: options.pathname,
                        query: options.query,
                        host: instance.PublicIpAddress
                    });
                });
            }));
        }).then(function pollURLs(urls) {
            grunt.log.writeln('Begin polling URLs: ' + inspect(urls) + '.');

            return Bluebird.all(urls.map(function pollURL(url) {
                return checkURL(url).timeout(options.timeout * 1000);
            }));
        }).then(function logSuccess() {
            return grunt.log.oklns('All checks passed!');
        }).catch(done).finally(done);
    }

    grunt.registerMultiTask(
        'verifydeploy',
        'Ensure that a player version has been deployed to an ASG.',
        verifyDeploy
    );
};
