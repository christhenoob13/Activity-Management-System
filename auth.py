from flask import (
  Blueprint,
  request,
  render_template,
  session,
  redirect, url_for
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
  error = None
  if request.method == 'POST':
    username = request.form.get('username').strip()
    password = request.form.get('password').strip()
    if not username and not password:
      error = "Username and password cannot be blank"
    elif not username or not password:
      error = f"{'Username' if not username else 'Password'} cannot be blank"
    # TODO: more logic here... e.g user not in database
    # the error message must be "Invalid username"
    if username == 'admin' and password == 'admin':
      error = None
      session['is_login'] = True
      return redirect(url_for('view.home'))
    error = "Invalid username or password"
    # TODO: logic to add data in database or tbrow an error
  return render_template('login.html', error=error)

"""
@auth.route('/signup', methods=['GET', 'POST'])
def signup():
  if request.method == 'GET':
    return render_template('signup.html')
  form = request.form
"""