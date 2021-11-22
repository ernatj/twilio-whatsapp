define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
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
        console.log(dataSources);
    }

    function onRequestedInteraction (interaction) {    
        console.log('*** requestedInteraction ***');
        console.log(interaction);
     }

     function onRequestedTriggerEventDefinition(eventDefinitionModel) {
        console.log('*** requestedTriggerEventDefinition ***');
        console.log(eventDefinitionModel);
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

        // $.each(inArguments, function (index, inArgument) {
        //     $.each(inArgument, function (key, val) {
        //         // Your image content that you willing to sent
        //         // if (key === 'postcardURL'){
        //         //     $('#postcard-url').val(val);
        //         //     $('.postcard-preview-content').css('background-image', 'url')
        //         // }

        //         // if (key === 'postcardText'){
        //         //     $('#postcard-text').val(val);
        //         //     $('#postcard-preview-text').html($('#postcard-text').val());
        //         // }
        //         if (key === 'phoneNumberValue'){
        //             $('#form-element-01').val(val);
        //         }

        //         if(key === 'messageValue'){
        //             $('#textarea-id-01').val(val);
        //         }
        //     });
        // });

        var hasOutArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.outArguments &&
            payload['arguments'].execute.outArguments.length > 0
        );

        var outArguments = hasOutArguments ? payload['arguments'].execute.outArguments : {};
        
        console.log(inArguments);
        console.log(outArguments);

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
        // var postcardURLValue = $('#postcard-url').val();
        // var postcardTextValue = $('#postcard-text').val();

        var phoneNumberValue = $('#form-element-01').val();
        var messageValue = $('#textarea-id-01').val();

        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            // Argument (Contact.Attribute) => Attribute terkait dari inArgument
            "phoneNumberValue": phoneNumberValue,
            "messageValue": messageValue,
            "ContactKey": "{{Contact.Key}}",
            "FirstName": "{{Event.eventDefinitionKey.FirstName}}",
            "LastName": "{{Event.eventDefinitionKey.LastName}}"
        }];C

        payload['arguments'].execute.outArguments = [{
            "ContactKey": "{{Contact.Key}}",
            "FirstName": "{{Event.eventDefinitionKey.FirstName}}",
            "LastName": "{{{Event.eventDefinitionKey.LastName}}",
            "Mobile": phoneNumberValue,
            "Sent": true
        }]
        
        payload['metaData'].isConfigured = true;

        console.log("Payload"+ payload);
        connection.trigger('updateActivity', payload);
    }

});
