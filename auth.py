from flask import (
  Blueprint,
  request,
  render_template,
  session,
  redirect, url_for,
  current_app
)
auth = Blueprint('auth',__name__)

@auth.route('/logout', methods=['GET'])
def logout():
  if not session.get('is_login'):
    return redirect(url_for('auth.login'))
  del session['is_login']
  return redirect(url_for('auth.login'))

@auth.route('/login', methods=['GET','POST'])
def login():
  if session.get('is_login'):
    return redirect(url_for('view.home'))
  error = ''
  if request.method == 'POST':
    akawnt = current_app.config['DATABASE']['accounts']
    email = request.form.get('email').strip()
    password = request.form.get('password').strip()
    
    admin = current_app.config.get("ADMIN")
    if email.lower() == admin['email'].lower() and password == admin['password']:
      session['user'] = dict(is_admin=True)
      session['is_login'] = True
      return redirect(url_for('view.home'))
    
    if not email and not password:
      error = "Username and password cannot be blank"
    elif not email or not password:
      error = f"{'Email' if not email else 'Password'} cannot be blank"
    elif not akawnt.find_one(email=email):
      error = 'Invalid username or password'
    else:
      user = akawnt.find_one(email=email)
      if user['password'] != password:
        error = 'Invalid username or password'
      else:
        session['user'] = {
          "id": user['id'],
          "firstname": user['firstname'],
          "lastname": user['lastname'],
          "email": user['email'],
          #"is_admin": user['is_admin']
        }
        error = ''
        session['is_login'] = True
        return redirect(url_for('view.home'))
  return render_template('login.html', error=error)

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
  error = ''
  if request.method == 'POST':
    sNum = lambda s: any(char.isdigit() for char in s)
    form = request.form
    firstname = form.get('firstname').strip()
    lastname = form.get('lastname').strip()
    grade = form.get('grade').strip()
    strand = form.get('strand').strip()
    
    email = form.get('email')
    password = form.get('password')
    password_confirm = form.get('password_confirm')
    
    if sNum(firstname):
      error = 'Invalid firstname value'
    elif sNum(lastname):
      error = 'Invalid lastname value'
    elif int(grade) not in [11,12]:
      error = 'Invalid grade level'
    elif strand not in ['STEM', 'HUMSS', 'ABM', 'TVL']:
      error = 'Invalid strand name'
    elif password != password_confirm:
      error = 'password do not match'
    elif len(password) < 6 or len(password) > 16:
      error = 'password must be 6-16 characters'
    else:
      db = current_app.config.get('DATABASE')
      akawnt = db['accounts']
      if akawnt.find_one(email=email):
        error = 'Email already exist'
      else:
        error = ''
        akawnt.insert(dict(
          email = email,
          password = password,
          firstname = firstname.title(),
          lastname = lastname.title(),
          grade = int(grade),
          strand = strand.upper(),
          is_admin=False
        ))
        return redirect(url_for('auth.login'))
  if session.get('is_login'):
    return redirect(url_for('view.home'))
  return render_template('signup.html', error=error, show_eruda=True)