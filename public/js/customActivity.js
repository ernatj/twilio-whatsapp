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
        console.log("DATA SOURCE => "+dataSources);
    }

    function onRequestedInteraction (interaction) {    
        console.log('*** requestedInteraction ***');
        // interaction = JSON.stringify(interaction)
        console.log("INTERACTION =>"+interaction);
     }

     function onRequestedTriggerEventDefinition(eventDefinitionModel) {
        console.log('*** requestedTriggerEventDefinition ***');
        // eventDefinitionModel = JSON.stringify(JSON.parse(eventDefinitionModel), null, 2)
        eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
        console.log("EVENT DEFINITION"+eventDefinitionModel);
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

                if (key === 'DataExtension'){
                    $('#dropdown-element-01').val(val);
                }
                if (key === 'Sender'){
                    $('#dropdown-element-02').val(val);
                }
                if (key === 'Mobile'){
                    $('#form-element-01').val(val);
                }
                if(key === 'Message'){
                    $('#textarea-id-01').val(val);
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
        // var postcardURLValue = $('#postcard-url').val();
        // var postcardTextValue = $('#postcard-text').val();

        var phoneNumberValue = $('#form-element-01').val();
        var dataExtension = $('#dropdown-element-01').val();
        var senderNumberValue = $('#dropdown-element-02').val();
        var messageValue = $('#textarea-id-01').val();
        // var dataExtension = "WelcomeProgramJourney_3"

        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            // Argument (Contact.Attribute) => Attribute terkait dari inArgument
            "DataExtension": dataExtension,
            "Mobile": "{{Contact.Attribute."+dataExtension+".[Mobile Number]}}",
            "Sender": senderNumberValue,
            "Message": messageValue,
            "ContactKey": "{{Contact.Key}}",
            "FirstName": "{{Contact.Attribute."+dataExtension+".FirstName}}",
            "LastName": "{{Contact.Attribute."+dataExtension+".LastName}}"
        }];

        payload['arguments'].execute.outArguments = [{
            "ContactKey": "{{Contact.Key}}",
            "FirstName": "{{Contact.Attribute."+dataExtension+".FirstName}}",
            "LastName": "{{Contact.Attribute."+dataExtension+".LastName}}",
            "Mobile": phoneNumberValue,
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
