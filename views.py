from flask import (
  Blueprint,
  request,
  render_template,
  session,
  redirect, url_for,
  current_app
)

view = Blueprint('view',__name__)

@view.route('/')
def home():
  if not session.get('is_login'):
    return redirect(url_for('auth.login'))
  data = current_app.config.get("SUBJECTS", {})
  user = session.get('user', {})
  if user.get('is_admin'):
    return redirect(url_for('admin.dashboard'))
  return render_template('home.html', subjects=data, user=user, show_head=True)

#@view.route('/subject/id/<subject_id>')
#def subject(subject_id):