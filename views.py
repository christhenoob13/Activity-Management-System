from flask import (
  Blueprint,
  request,
  render_template,
  session,
  redirect, url_for
)

view = Blueprint('view',__name__)

@view.route('/')
def home():
  if not session.get('is_login'):
    return redirect(url_for('auth.login'))
  return render_template('home.html')