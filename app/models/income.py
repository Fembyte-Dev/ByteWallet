from datetime import datetime
from app.models.user import db
from app.models.accounts import Account

class Income(db.Model):
    """
    Modelo de ingresos financieros
    Campos:
        id (int): Llave primaria
        amount (float): Monto del ingreso
        description (str): Descripción del ingreso
        date (datetime): Fecha del ingreso
        account_id (int): ID de la cuenta relacionada
    """
    __tablename__ = 'incomes'
    
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    
    account = db.relationship('Account', backref='incomes')