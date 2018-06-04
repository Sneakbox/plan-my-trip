function generateSpeechResponse(speech, shouldEndSession) {

  return {
    "outputSpeech": {
      type: 'PlainText',
      text: speech
    },
    shouldEndSession: shouldEndSession
  };

}

function generateFinalOutput(response, sessionAttributes) {

  return {
    version: '1.0',
    sessionAttributes,
    response
  };

}

function processLaunchRequest(event, res) {

  const greeting = 'Welcome to Trip Planner. You can say, Help me plan my trip';

  const response = generateSpeechResponse(greeting, false);
  const sessionAttributes = {};
  const output = generateFinalOutput(response, sessionAttributes);

  res.send(output);
}


function processPlanMyTrip(event, res) {

  if (event.request.dialogState === 'COMPLETED') {


    let speechOutput = "Your itinerary is ";

    const fromCity = event.request.intent.slots.fromCity.value;
    const toCity = event.request.intent.slots.toCity.value;
    const travelDate = event.request.intent.slots.travelDate.value;
    speechOutput += " from "+ fromCity + " to "+ toCity+" on "+travelDate;

    const response = generateSpeechResponse(speechOutput, true);
    const sessionAttributes = {};
    const output = generateFinalOutput(response, sessionAttributes);
    res.send(output);


  } else {

    const response = {
      "outputSpeech" : null,
      "card" : null,
      "directives" : [ {
        "type" : "Dialog.Delegate"
      } ],
      "reprompt" : null,
      "shouldEndSession" : false
    };

    const sessionAttributes = {};
    const output = generateFinalOutput(response, sessionAttributes);
    res.send(output);

  }


}

function processStopIntent(res) {

  const speechText = 'Thank you for using Plan My trip. Good Bye';
  const response = generateSpeechResponse(speechText, true);
  const sessionAttributes = {};
  const output = generateFinalOutput(response, sessionAttributes);
  res.send(output);

}

function processHelpIntent(res) {

  const speechText = 'You can say Help me Plan My trip or you can say something like I wish to visit Dallas from Tampa tomorrow';
  const response = generateSpeechResponse(speechText, false);
  const sessionAttributes = {};
  const output = generateFinalOutput(response, sessionAttributes);
  res.send(output);

}

function processIntentRequest(event, res) {

  switch(event.request.intent.name) {

    case 'AMAZON.CancelIntent':
      processStopIntent(res);
      break;
    case 'AMAZON.HelpIntent':
      processHelpIntent(res);
      break;
    case 'AMAZON.StopIntent':
      processStopIntent(res);
      break;
    case 'PlanMyTrip':
      processPlanMyTrip(event, res);
      break;

  }

}

function processSessionEnded() {
  // close any third-party connections
  // save state
}

exports.process = (req, res) => {

  let event = req.body;

  switch(event.request.type) {

    case 'LaunchRequest':
      processLaunchRequest(event, res);
      break;
    case 'IntentRequest':
      processIntentRequest(event, res);
      break;

    case 'SessionEndedRequest':
      processSessionEnded(event, res);
      break;

  }

};