from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """
    Modelo de usuario para la base de datos
    Campos:
        id (int): Llave primaria
        username (str): Nombre de usuario único
        email (str): Correo electrónico único
        password (str): Contraseña hasheada
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

