from datetime import datetime
from app.models.user import db  # Importamos la db del modelo principal

class Account(db.Model):
    """
    Modelo de cuentas financieras
    Campos:
        id (int): Llave primaria
        name (str): Nombre de la cuenta (único)
        balance (float): Saldo actual
        initial_balance (float): Saldo inicial
        can_use (bool): Si el dinero está disponible para usar
        created_at (datetime): Fecha de creación
        expenses = Relación con gastos
    """
    __tablename__ = 'accounts'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    balance = db.Column(db.Float, default=0.0)
    initial_balance = db.Column(db.Float, nullable=False)
    can_use = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expenses = db.relationship('Expense', backref='account', cascade='all, delete-orphan')

class Expense(db.Model):
    """
    Modelo de gastos asociados a cuentas
    Campos:
        id (int): Llave primaria
        amount (float): Monto del gasto
        description (str): Descripción del gasto
        category (str): Categoria del Gasto
        date (datetime): Fecha del gasto
        account_id (int): ID de la cuenta relacionada
    """
    __tablename__ = 'expenses'
    
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    category = db.Column(db.String(50))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))