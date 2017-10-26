var sfdx = require('salesforce-alm')
var _ = require('lodash');

var _optsDefaults = {
    softExit: true
}
var _flagDefaults = {
    loglevel: 'warn'
}
var sfdxApi = {};

//if they dont have CLI
if(!sfdx.cliNamespaceSupported){
    //remap commands and topics for our purposes anyway
    _.forEach(sfdx.commands, function(command){
        if(command.command){
            var arr = command.command.split(':');
            command.topic = arr.splice(0,1)[0];
            command.command = arr.join(':')
        }
    });
}

var commandsByTopic = _.groupBy(sfdx.commands, 'topic');
_.forEach(commandsByTopic, function(commands, topic){
    var sfdxTopic = sfdxApi[topic] = {};
    _.forEach(commands, function(command){
        sfdxTopic[_.camelCase(command.command)] = _createCommand(command.run);
    })
});

function _createCommand(fn){
    return function(flags, opts){
        var ctx = _.defaults(opts || {}, _optsDefaults);
        ctx.flags = _.defaults(flags || {}, _flagDefaults);
        return fn(ctx);
    }
}


module.exports = sfdxApi;