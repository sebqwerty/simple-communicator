from flask import Flask
from flask import request
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash

from datetime import datetime

app = Flask(__name__)

auth = HTTPBasicAuth()

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

server_users_association_table = db.Table('association', db.Model.metadata,
    db.Column('user_id', db.ForeignKey('users.id')),
    db.Column('server_id', db.ForeignKey('servers.id'))
)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, index=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    servers_owned = db.relationship("Server")
    servers = db.relationship("Server", secondary=server_users_association_table)

    def __init__(self, name, password):
        self.username = name
        self.password = password

class Server(db.Model):
    __tablename__ = "servers"
    id = db.Column(db.Integer, primary_key=True, index=True)
    name = db.Column(db.String(100))
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    owner = db.relationship("User", back_populates="servers_owned", uselist=False) #one to many
    members = db.relationship("User", secondary=server_users_association_table)
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
    file = db.relationship("File", uselist=False) #one to one

    def __init__(self, server, user, text):
        self.server = server
        self.user = user
        date_time = datetime.now()
        self.text = text

class File(db.Model):
    __tablename__ = "files"
    id = db.Column(db.Integer, primary_key=True, index=True)
    is_image = db.Column(db.Boolean)
    name = db.Column(db.String(100))
    path = db.Column(db.String(100))

    def __init__(self, is_image, name, path):
        self.is_image = is_image
        self.name = name
        self.path = path


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
    user = User(req['username'], generate_password_hash(req['password']))
    if User.query.filter_by(username=user.username).first() != None:
        return "User with the username already exists", 400
    else:
        db.session.add(user)
        db.session.commit()
    user = User.query.filter_by(username=user.username).first()
    return {"username": user.username, "id": user.id}

if __name__ == '__main__':
    db.create_all()

    app.debug = False

    app.run()
