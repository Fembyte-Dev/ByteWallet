from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from app.models.income import Income, Account
from app.models.user import db
from functools import wraps

income_bp = Blueprint('income', __name__, template_folder='templates/income')

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Debes iniciar sesión', 'danger')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

@income_bp.route('/add/<int:account_id>', methods=['GET', 'POST'])
@login_required
def add(account_id):
    """Agregar nuevo ingreso a una cuenta"""
    account = Account.query.get_or_404(account_id)
    
    if request.method == 'POST':
        try:
            amount = float(request.form['amount'])
            
            new_income = Income(
                amount=amount,
                description=request.form['description'],
                account_id=account_id
            )
            
            # Actualizar saldo de la cuenta
            account.balance += amount
            db.session.add(new_income)
            db.session.commit()
            
            flash('Ingreso registrado exitosamente!', 'success')
            return redirect(url_for('accounts.dashboard'))
            
        except Exception as e:
            db.session.rollback()
            flash(f'Error al registrar ingreso: {str(e)}', 'danger')
    
    return render_template('income/add.html', account=account)

@income_bp.route('/edit/<int:income_id>', methods=['GET', 'POST'])
@login_required
def edit(income_id):
    """Editar un ingreso existente"""
    income = Income.query.get_or_404(income_id)
    original_amount = income.amount
    
    if request.method == 'POST':
        try:
            new_amount = float(request.form['amount'])
            
            # Actualizar saldo de la cuenta
            income.account.balance += (new_amount - original_amount)
            
            income.amount = new_amount
            income.description = request.form['description']
            db.session.commit()
            
            flash('Ingreso actualizado!', 'success')
            return redirect(url_for('income.list', account_id=income.account_id))
            
        except Exception as e:
            db.session.rollback()
            flash(f'Error al actualizar: {str(e)}', 'danger')
    
    return render_template('income/edit.html', income=income)

@income_bp.route('/delete/<int:income_id>', methods=['POST'])
@login_required
def delete(income_id):
    """Eliminar un ingreso"""
    income = Income.query.get_or_404(income_id)
    account_id = income.account_id
    
    try:
        # Revertir el saldo
        income.account.balance -= income.amount
        db.session.delete(income)
        db.session.commit()
        flash('Ingreso eliminado!', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error al eliminar: {str(e)}', 'danger')
    
    return redirect(url_for('income.list', account_id=account_id))

@income_bp.route('/list/<int:account_id>')
@login_required
def list(account_id):
    """Listar todos los ingresos de una cuenta"""
    account = Account.query.get_or_404(account_id)
    incomes = Income.query.filter_by(account_id=account_id).order_by(Income.date.desc()).all()
    return render_template('income/list.html', account=account, incomes=incomes)