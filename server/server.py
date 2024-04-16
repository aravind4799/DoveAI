from flask import Flask,jsonify,request
from flask_cors import CORS

# import the OpenAI Python library for calling the OpenAI API
from openai import OpenAI
import os
from dotenv import load_dotenv
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
load_dotenv()
app = Flask(__name__)
CORS(app)

# GET CONNECTION TO THE MONGODB ATLAS CLOUD DB
app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
db = PyMongo(app).db

# DOCUMENT STRUCTURE IN MONGODB:
# {
#     _id: UNIQUE ID THAT MONDODB CREATES TO UNIQUELY IDENTIFY A DOCUMENT,
#     message: [
#         {"role":"user",content:"user query"},
#         {"role":"assistant",content:"assistant reply"}
#     ],
#     title: "user_query"
# }

# TITLE corresponds to the first typed query which is used to reference the chat

# MESSAGE field is a array of objects, where each object has 2 keys role and content
# from openai api documentation role could be either user,system or assistant

# user corresponds to user interacting with the openAI api
# assistant corresponds to the reply that the AI responds with for a user fed query
# system is used to instruct how the assistant has to reply to the user queries, its used typically by the developers modify how the assistant wants to 
# reply to the user queries,
# IN THIS APPLICATION I HAVE USED SYSTEM COMMAND TO INJECT SOME KNOWLEDGE, PRIOR LETTING IT KNOW IT WAS CREATED BY ARAVIND AND TO GIVE THE RESPONSES BACK IN 
# MARKED DOWN TEXT -- so that I format these markdown text in my front end with REACTMARKDOWN


# GLOBAL VAR TO LET THE SERVER KNOW WHICH DOCUMENT(CHATID) ARE MODIFYING
insertedID = "6618b8b355c4f534fe1ff335"
# GLOBAL VAR TO LET THE SERVER KNOW WHETHER IT SHOULD CREATE A NEW RECORD OR UPDATE EXISTING RECORD
isNewChat="no"

# POST THE USER QUERY TO THE OpenAI api and persist the responses in the database
@app.route("/api/openAPIresponse",methods=['POST'])
def handle_request():
    global insertedID
    global isNewChat
    try:
        data = request.json
        query = data.get('content')
        print("query from user"+query)
        #I need to save this query that the user entered into mongodb database only once
        if isNewChat=="yes":
            insertedID=db.chats.insert_one({
            "message":[{"role":"user","content":query}],
            "title": query
            }).inserted_id
            print("I was here")
            print(insertedID)
            # UPDATE THE isNewChat to "no"
            isNewChat="no"
        # IF THIS CHAT IS NOT A NEW CHAT WE NEED TO PUSH THE QUERY INTO THE MESSAGES
        else:
            document = db.chats.find_one_and_update(
                {"_id": ObjectId(insertedID)},
                {
                    "$push":{
                    "message":{
                        "role":"user",
                        "content":query
                    }
                    }
                })
            if document:
                print("found document")
            else:
                print("I couldn't find your document")
        # I want to feed  history of all the converstaions for this specific chatID to openAi api
        # not just the current user query
        document = db.chats.find_one(
            {
            "_id":ObjectId(insertedID)
           },
        )
        if document:
            print("I know your history")
            historyMessages = list(document['message'])
        
        # LET THE OPENAI know that The responses should be in markdown text
        SystemConfig = {
            "role":"system",
            "content":"You were created by ARAVIND and this github repo as a link: https://github.com/aravind4799 and all your responses must be formatted as markdown respond kindly"
        }
        
        #APPEND THE SystemConfig To the historyMessages
        historyMessages.insert(0,SystemConfig)
        print("value of recent message :" + str(historyMessages[len(historyMessages)-1]))

        # historyMessages.
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", os.getenv("API_KEY")))
        MODEL = "gpt-3.5-turbo"
        # pass the entire history of messages to the OPENAI api
        response = client.chat.completions.create(
        model=MODEL,
        messages=
        historyMessages,
        temperature=0,
        )

        print("Response from chatgpt: "+response.choices[0].message.content)
        
        # now i need to add the respose from the bot as well in the same insertedID
        document = db.chats.find_one_and_update(
                {"_id": ObjectId(insertedID)},
                {
                    "$push":{
                    "message":{
                        "role":"assistant",
                        "content":response.choices[0].message.content
                    }
                    }
                })
        if document:
            print("found document am adding bot response")
        else:
            print("I couldn't find your document sadge")
            
        return jsonify(str(insertedID)),200
    
    except Exception as e:
        print("error encounter!",e)
        return jsonify({'error':'error occurred'}),500



# ROUTE TO GET ALL CHATS TITLE TO POPULATE THE SIDEBAR
@app.route("/api/getAllChats",methods=['GET'])
def getAllChats():
    data=[]
    cursor = list(db.chats.find({}).sort({"_id":-1}))

    for doc in cursor:
        doc['_id'] = str(doc['_id']) # This does the trick!
        data.append({"id":doc['_id'],"title":doc['title']})
    print(jsonify(data))
    return jsonify(data),200

# ROUTE TO GET ALL PREVIOUS CHATS by ID TO LOAD HISTORY OF PREVIOUS CONVERSATIONS
@app.route("/api/chatsById",methods=['POST'])
def getChatsById():
    try:
        data = request.json
        id = data.get('id')
        print("ID I AM GETTING FROM CLIENT",id)
        document = db.chats.find_one(
            {
            "_id":ObjectId(id)
           },
        )
        if document:
        # Convert ObjectId to str for JSON serialization
            document["_id"] = str(document["_id"])
        # Return the document as JSON
            return list(document['message']), 200
        else:
        # Return a 404 Not Found response if document not found
            return jsonify({"error": "Document not found"}), 404

    except Exception as e:
        print("error encounter!",e)
        return jsonify({'error':'error occurred'}),500


# ROUTE TO RESET THE insertedID to welcome document
@app.route("/api/resetId",methods=['GET'])
def reset_id():
    global insertedID
    print("I was hit")
    insertedID = "6618b8b355c4f534fe1ff335"
    return jsonify("success"),200

# ROUTE WHICH INDICATES SERVER THAT THIS IS A NEW CHAT , THUS IT SHOULD CREATE A NEW DOCUMENT
@app.route("/api/newChat",methods=['GET'])
def handle_newChat():
    global isNewChat
    isNewChat="yes"
    return jsonify("success"),200

# ROUTE THAT UPDATES THE insertedID from the client
@app.route("/api/updateChatID",methods=['POST'])
def update_chatID():
    global insertedID
    try:
        data = request.json
        insertedID = data.get('id')
        print("ID I GOT FROM CLIENT: "+ insertedID)
        print("GLOBAL INSERT ID:"+ insertedID)
        return jsonify("success"),200
    except Exception as e:
        print("error encounter!",e)
        return jsonify({'error':'error occurred'}),500

#servers runs at port 8080
if __name__ =="__main__":
    app.run(debug=True,port=8080)