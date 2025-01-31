from flask import Flask, render_template, request, redirect, url_for, session, flash
from app.models.user import db, User
from app.models.accounts import Account, Expense
from app.models.income import Income
from app.routes.accounts import accounts_bp
from app.routes.income import income_bp
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps


app = Flask(__name__,template_folder='app/templates')
app.register_blueprint(accounts_bp, url_prefix='/accounts')
app.register_blueprint(income_bp, url_prefix='/income')
app.secret_key = 'superclave'

# Configuración de base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializamos la base de datos con la app
db.init_app(app)

# Crear tablas en la base de datos
with app.app_context():
    db.create_all()
    db.create_all()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Debes iniciar sesión para acceder a esta página')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/', methods=['GET', 'POST'])
def index():
    """
    Ruta principal que maneja ambos formularios:
    - Registro de nuevos usuarios
    - Inicio de sesión de usuarios existentes
    """
    if request.method == 'POST':
        # Manejar registro
        if 'register' in request.form:
            username = request.form['username']
            email = request.form['email']
            password = request.form['password']
            hashed_password = generate_password_hash(password)
            
            # Verificar si el usuario ya existe
            if User.query.filter_by(username=username).first():
                flash('El nombre de usuario ya existe')
                return redirect(url_for('index'))
            
            # Verificar si el email ya existe
            if User.query.filter_by(email=email).first():
                flash('El correo electrónico ya está registrado')
                return redirect(url_for('index'))
            
            # Crear nuevo usuario
            new_user = User(
                username=username,
                email=email,
                password=hashed_password
            )
            
            db.session.add(new_user)
            db.session.commit()
            flash('Registro exitoso! Ahora puedes iniciar sesión')
            return redirect(url_for('index'))

        # Manejar inicio de sesión
        elif 'login' in request.form:
            username = request.form['username']
            password = request.form['password']
            user = User.query.filter_by(username=username).first()
            
            if user and check_password_hash(user.password, password):
                session['user_id'] = user.id
                flash('Inicio de sesión exitoso!')
                return redirect(url_for('index'))
            else:
                flash('Credenciales incorrectas')
                return redirect(url_for('index'))

    return render_template('index.html')


@app.route('/accounts', methods=['GET', 'POST'])
@login_required
def accounts():
    """
    Ruta para gestionar cuentas:
    - Muestra todas las cuentas registradas
    - Permite eliminarlas con verificación de contraseña
    """
    current_user = User.query.get(session['user_id'])
    
    if request.method == 'POST':
        # Verificar contraseña y eliminar usuario
        user_id_to_delete = request.form.get('user_id')
        password = request.form.get('password')
        
        if check_password_hash(current_user.password, password):
            user_to_delete = User.query.get(user_id_to_delete)
            if user_to_delete:
                db.session.delete(user_to_delete)
                db.session.commit()
                flash('Cuenta eliminada exitosamente')
            else:
                flash('Usuario no encontrado')
        else:
            flash('Contraseña incorrecta')
        
        return redirect(url_for('accounts'))
    
    # Obtener todos los usuarios para mostrar
    all_users = User.query.all()
    return render_template('accounts/accounts.html', users=all_users, current_user=current_user)


@app.route('/logout')
@login_required  # Solo usuarios autenticados pueden cerrar sesión
def logout():
    """
    Ruta para cerrar sesión:
    - Elimina la información de sesión del usuario
    - Redirige al inicio
    """
    session.pop('user_id', None)
    flash('Has cerrado sesión correctamente')
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)