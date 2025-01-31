from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from app.models.accounts import Account, Expense
from app.models.user import db
from functools import wraps

accounts_bp = Blueprint('accounts', __name__, template_folder='templates/accounts')

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Debes iniciar sesión', 'danger')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

@accounts_bp.route('/dashboard')
@login_required
def dashboard():
    """Panel principal de cuentas"""
    accounts = Account.query.all()
    return render_template('accounts/dashboard.html', accounts=accounts)

@accounts_bp.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    """Crear nueva cuenta"""
    if request.method == 'POST':
        try:
            new_account = Account(
                name=request.form['name'],
                initial_balance=float(request.form['initial_balance']),
                balance=float(request.form['initial_balance']),
                can_use='can_use' in request.form
            )
            db.session.add(new_account)
            db.session.commit()
            flash('Cuenta creada exitosamente!', 'success')
            return redirect(url_for('accounts.dashboard'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error al crear cuenta: {str(e)}', 'danger')
    return render_template('accounts/create.html')

@accounts_bp.route('/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit(id):
    """Editar cuenta existente"""
    account = Account.query.get_or_404(id)
    if request.method == 'POST':
        try:
            account.name = request.form['name']
            account.can_use = 'can_use' in request.form
            db.session.commit()
            flash('Cuenta actualizada!', 'success')
            return redirect(url_for('accounts.dashboard'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error al actualizar: {str(e)}', 'danger')
    return render_template('accounts/edit.html', account=account)

@accounts_bp.route('/delete/<int:id>', methods=['GET', 'POST'])
@login_required
def delete(id):
    """Eliminar cuenta con validación de gastos"""
    account = Account.query.get_or_404(id)
    has_expenses = Expense.query.filter_by(account_id=id).first() is not None
    
    if request.method == 'POST':
        try:
            # Validar transferencia si hay gastos
            if has_expenses:
                transfer_account_id = request.form.get('transfer_account')
                if not transfer_account_id:
                    flash('Debes seleccionar una cuenta para transferir los gastos', 'danger')
                    return redirect(url_for('accounts.delete', id=id))
                
                transfer_account = Account.query.get(transfer_account_id)
                if not transfer_account:
                    flash('Cuenta de transferencia inválida', 'danger')
                    return redirect(url_for('accounts.delete', id=id))
                
                # Transferir gastos
                Expense.query.filter_by(account_id=id).update({'account_id': transfer_account_id})
            
            # Eliminar cuenta
            db.session.delete(account)
            db.session.commit()
            flash('Cuenta eliminada exitosamente!', 'success')
            return redirect(url_for('accounts.dashboard'))
        
        except Exception as e:
            db.session.rollback()
            flash(f'Error al eliminar: {str(e)}', 'danger')
    
    # Obtener cuentas disponibles para transferencia
    transfer_accounts = Account.query.filter(Account.id != id).all()
    return render_template('accounts/delete.html', 
                         account=account,
                         has_expenses=has_expenses,
                         transfer_accounts=transfer_accounts)