from flask import Flask, request, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_cors import CORS
from datetime import datetime
import os
import uuid

app = Flask(__name__)
CORS(app)
auth = HTTPBasicAuth()

UPLOAD_FOLDER = '/app/uploads' 
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

server_users_association_table = db.Table('association', db.Model.metadata,
    db.Column('user_id', db.ForeignKey('users.id'), primary_key=True),
    db.Column('server_id', db.ForeignKey('servers.id'), primary_key=True)
)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, index=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    servers_owned = db.relationship("Server")
    servers = db.relationship("Server", secondary=server_users_association_table, back_populates="members")

    def __init__(self, name, password):
        self.username = name
        self.password = password
    def is_a_member(self, server):
        server = Server.query.get(server)
        return server in self.servers or server in self.servers_owned
    def is_an_owner(self, server):
        server = Server.query.get(server)
        return server in self.servers_owned

class Server(db.Model):
    __tablename__ = "servers"
    id = db.Column(db.Integer, primary_key=True, index=True)
    name = db.Column(db.String(100))
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    owner = db.relationship("User", back_populates="servers_owned", uselist=False) #one to many
    members = db.relationship("User", secondary=server_users_association_table, back_populates="servers")
    messages = db.relationship("Message")

    def __init__(self, name, owner):
        self.name = name
        self.owner = owner


class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True, index=True)
    server_id = db.Column(db.Integer, db.ForeignKey("servers.id"))
    server = db.relationship("Server", back_populates="messages")
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship("User")
    date_time = db.Column(db.DateTime)
    text = db.Column(db.String(1000))
    file_id = db.Column(db.Integer, db.ForeignKey("files.id"))
    file = db.relationship("File", uselist=False, back_populates="message") #one to one

    def __init__(self, server, user, text, file = None):
        self.server = server
        self.user = user
        self.date_time = datetime.now()
        self.text = text
        self.file = file

class File(db.Model):
    __tablename__ = "files"
    id = db.Column(db.Integer, primary_key=True, index=True)
    is_image = db.Column(db.Boolean)
    name = db.Column(db.String(100))
    path = db.Column(db.String(100))
    message = db.relationship("Message", uselist=False)

    def __init__(self, is_image, name, path):
        self.is_image = is_image
        self.name = name
        self.path = path


def get_user(auth):
    return User.query.filter_by(username=auth.current_user()).first()

@auth.verify_password
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return
    if check_password_hash(user.password, password):
        return username

@app.route('/register', methods=['POST'])
def register():
    req = request.json
    if req['username'] == "" or req['password'] == "":
        return "No username or password", 400
    user = User(req['username'], generate_password_hash(req['password']))
    if User.query.filter_by(username=user.username).first() != None:
        return "User with the username already exists", 400
    else:
        db.session.add(user)
        db.session.commit()
        return {"username": user.username, "id": user.id}

@app.route('/file/<id>', methods=['GET'])
@auth.login_required
def get_file(id):
    file = File.query.get(id)
    if not get_user(auth).is_a_member(file.message.server.id):
        return "Not allowed", 403
    try:
        return send_file(file.path, attachment_filename=file.name)
    except Exception as e:
        return str(e)

@app.route('/sendMessage', methods=['POST'])
@auth.login_required
def send_message():
    server_id = request.form['server_id']
    if not get_user(auth).is_a_member(server_id):
        return "Not allowed", 403

    message_text = request.form['text']
    if 'file' in request.files:
        file = request.files['file']
        filename = secure_filename(file.filename)
        is_image = filename.endswith('.png') or filename.endswith('jpg') or filename.endswith('bmp')
        saved_filename = str(uuid.uuid4())
        path = os.path.join(app.config['UPLOAD_FOLDER'], saved_filename)
        file.save(path)
        file_db = File(is_image, filename, path)
        db.session.add(file_db)
        message = Message(Server.query.get(server_id), get_user(auth), message_text, file_db)
        db.session.add(message)
        db.session.commit()
        return "Message sent"
    else:
        message = Message(Server.query.get(server_id), get_user(auth), message_text)
        db.session.add(message)
        db.session.commit()
        return "Message sent"

@app.route('/getLastMessages/<server_id>/<count>', methods=['GET'])
@auth.login_required
def get_last_messages(server_id, count):
    if not get_user(auth).is_a_member(server_id):
        return "Not allowed", 403
    messages = Message.query.filter_by(server_id = server_id)\
           .order_by(Message.id.desc())\
           .limit(count)
    response = {"messages" : []}
    for msg in messages:
        if msg.file is not None:
            message = {"id": msg.id, "text": msg.text, "user_id": msg.user_id, "username": msg.user.username, \
                "file": {"id": msg.file.id, "isImage": msg.file.is_image}, "dateTime": msg.date_time}
        else:
            message = {"id": msg.id, "text": msg.text, "user_id": msg.user_id, "username": msg.user.username, \
                "file": msg.file, "dateTime": msg.date_time}
        response['messages'].append(message)
    return response
    
@app.route('/addToServer', methods=['POST'])
@auth.login_required
def add_to_server():
    req = request.json
    server_id = req['server_id']
    username = req['username']
    if not get_user(auth).is_an_owner(server_id):
        return "User is not an owner", 401
    user = User.query.filter_by(username=username).first()
    if user is None:
        return "No such user", 400
    user.servers.append(Server.query.get(server_id))
    db.session.add(user)
    db.session.commit()
    return "Added to server"

@app.route('/availableServers', methods=['GET'])
@auth.login_required
def get_available_servers():
    user = get_user(auth)
    servers = {'servers': []}
    for server in user.servers:
        servers['servers'].append({'name': server.name, 'id': server.id})
    for server in user.servers_owned:
        servers['servers'].append({'name': server.name, 'id': server.id})
    return servers

@app.route('/ownedServers', methods=['GET'])
@auth.login_required
def get_servers_owned():
    user = get_user(auth)
    servers = {'servers': []}
    for server in user.servers_owned:
        servers['servers'].append({'name': server.name, 'id': server.id})
    return servers

@app.route('/createServer/<name>', methods=['POST'])
@auth.login_required
def create_server(name):
    server = Server(name, get_user(auth)) 
    db.session.add(server)
    db.session.commit()
    return str(server.id)

@app.route('/login', methods=['GET'])
@auth.login_required
def login():
    user = get_user(auth)
    return str(user.id)

if __name__ == '__main__':
    db.create_all()

    app.debug = False

    app.run()
