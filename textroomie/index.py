import urllib
from urllib import requests, parse
import json

API_BASE="http://myhappyti.me:3000/textroommate"



def lambda_handler(event, context):
    if (event["session"]["application"]["applicationId"] !=
            "aamzn1.ask.skill.6ab0cacf-e31a-4f5e-beef-b543b190ab34"):
        raise ValueError("Invalid Application ID")
    
    if event["session"]["new"]:
        on_session_started({"requestId": event["request"]["requestId"]}, event["session"])

    if event["request"]["type"] == "LaunchRequest":
        return on_launch(event["request"], event["session"])
    elif event["request"]["type"] == "IntentRequest":
        return on_intent(event["request"], event["session"])
    elif event["request"]["type"] == "SessionEndedRequest":
        return on_session_ended(event["request"], event["session"])

def on_session_started(session_started_request, session):
    print("Starting new session.")

def on_launch(launch_request, session):
    return get_welcome_response()

def on_intent(intent_request, session):
    intent = intent_request["intent"]
    intent_name = intent_request["intent"]["name"]

    if intent_name == "TextRoommate":
        return text_roommate(intent)
    elif intent_name == "AMAZON.HelpIntent":
        return get_welcome_response()
    elif intent_name == "AMAZON.CancelIntent" or intent_name == "AMAZON.StopIntent":
        return handle_session_end_request()
    else:
        raise ValueError("Invalid intent")

def on_session_ended(session_ended_request, session):
    print("Ending session.")
    # Cleanup goes here...

def handle_session_end_request():
    card_title = "ME TIME - Thanks"
    speech_output = "Thank you for using the ME TIME skill.  See you next time!"
    should_end_session = True

    return build_response({}, build_speechlet_response(card_title, speech_output, None, should_end_session))

def get_welcome_response():
    session_attributes = {}
    card_title = "ME TIME"
    speech_output = "Welcome to the Alexa ME TIME skill. " \
                    "You can tell me if you need the room and I will text your roommate"
    reprompt_text = "Please let me know when you want me to text your roommate, " \
                    "for example: now."
    should_end_session = False
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))

def text_roommate(intent):
    session_attributes = {}
    card_title = "ME TIME TEXT ROOMATE"
    speech_output = "I cannot find your identification code. " \
                    "Please try again."
    reprompt_text = ""
    should_end_session = False 
	#API_BASE[idCode]
    speech_output = "I will text your roommate for you. "

    if "Code" in intent["slots"]:
        code_string = intent["slots"]["Code"]

        if (code_string != "unkn"):
            print("Gonna go find happy time now!")
            data = parse.urlencode({"key": "1456"}).encode()
            req = request.Request(API_BASE)
            try:
                # perform HTTP POST request
                with request.urlopen(req, data) as f:
                    print("It returned {}".format(str(f.read().decode('utf-8'))))
            except Exception as e:
                # something went wrong!
                return e

    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))

def build_speechlet_response(title, output, reprompt_text, should_end_session):
    return {
        "outputSpeech": {
            "type": "PlainText",
            "text": output
        },
        "card": {
            "type": "Simple",
            "title": title,
            "content": output
        },
        "reprompt": {
            "outputSpeech": {
                "type": "PlainText",
                "text": reprompt_text
            }
        },
        "shouldEndSession": should_end_session
    }

def build_response(session_attributes, speechlet_response):
    return {
        "version": "1.0",
        "sessionAttributes": session_attributes,
        "response": speechlet_response
    }
