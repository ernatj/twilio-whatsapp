define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    var eventDefinitionKey;
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedInteraction', onRequestedInteraction);
    connection.on('requestedTriggerEventDefinition', onRequestedTriggerEventDefinition);
    connection.on('requestedDataSources', onRequestedDataSources);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestInteraction');
        connection.trigger('requestTriggerEventDefinition');
        connection.trigger('requestDataSources');  
    }

    function onRequestedDataSources(dataSources){
        console.log('*** requestedDataSources ***');
        // dataSources = JSON.stringify(dataSources)

        // Request Data Extension Name using dataExtensionId with data extension APi
        console.log("DATA SOURCE => "+JSON.stringify(dataSources));
    }

    function onRequestedInteraction (interaction) {    
        console.log('*** requestedInteraction ***');
        // interaction = JSON.stringify(interaction)
        console.log("INTERACTION =>"+JSON.stringify(interaction));
     }

     function onRequestedTriggerEventDefinition(eventDefinitionModel) {
        console.log('*** requestedTriggerEventDefinition ***');
        // eventDefinitionModel = JSON.stringify(JSON.parse(eventDefinitionModel), null, 2)
        eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
        console.log("EVENT DEFINITION"+JSON.stringify(eventDefinitionModel))
    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                // Your image content that you willing to sent
                // if (key === 'postcardURL'){
                //     $('#postcard-url').val(val);
                //     $('.postcard-preview-content').css('background-image', 'url')
                // }

                // if (key === 'postcardText'){
                //     $('#postcard-text').val(val);
                //     $('#postcard-preview-text').html($('#postcard-text').val());
                // }

                if (key === 'DataExtensionSource'){
                    $('#dropdown-element-dataextension-source').val(val);
                }
                if (key === 'DataExtensionResponse'){
                    $('#dropdown-element-dataextension-response').val(val);
                }
                if (key === 'Sender'){
                    $('#dropdown-element-sender').val(val);
                }
                if (key === 'PhoneNumber'){
                    $('#form-element-01').val(val);
                }
                if(key === 'Message'){
                    $('#textarea-id-message').val(val);
                }
            });
        });

        var hasOutArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.outArguments &&
            payload['arguments'].execute.outArguments.length > 0
        );

        var outArguments = hasOutArguments ? payload['arguments'].execute.outArguments : {};

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        // var phoneNumberValue = $('#form-element-01').val();
        var dataExtensionSource = $('#dropdown-element-dataextension-source').val();
        var dataExtensionResponse = $('#dropdown-element-dataextension-response').val();
        var senderNumberValue = $('#dropdown-element-sender').val();
        var phoneNumberAttribute = $('#form-element-01').val();
        var messageValue = $('#textarea-id-message').val();
        // var dataExtensionSource = "WelcomeProgramJourney_3"

        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            // Argument (Contact.Attribute) => Attribute terkait dari inArgument
            "DataExtensionSource": dataExtensionSource,
            "DataExtensionResponse": dataExtensionResponse,
            "PhoneNumber": "{{Contact.Attribute."+dataExtensionSource+"."+phoneNumberAttribute+"}}",
            "Sender": senderNumberValue,
            "Message": messageValue,
            "ContactKey": "{{Contact.Key}}",
            "Name": "{{Contact.Attribute."+dataExtensionSource+".Name}}",
        }];

        payload['arguments'].execute.outArguments = [{
            "ContactKey": "{{Contact.Key}}",
            "Name": "{{Contact.Attribute."+dataExtensionSource+".Name}}",
            "PhoneNumber": "{{Contact.Attribute."+dataExtensionSource+"."+phoneNumberAttribute+"}}",
            "Sent": true
        }]
        
        payload['metaData'].isConfigured = true;

        // console.log("Phone Number ");
        // console.dir(phoneNumberValue);
        // console.log("Message ");
        // console.dir(messageValue);
        console.log("Payload "+JSON.stringify(payload));
        //console.log("Payload"+ JSON.stringify(JSON.parse(payload),null,2));
        connection.trigger('updateActivity', payload);
    }

});
