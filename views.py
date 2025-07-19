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
  return render_template('student/dashboard.html', subjects=data)

@view.route('/page/subject')
def subject():
  if not session.get('is_login'):
    return redirect(url_for('auth.login'))
  subject_id = int(request.args.get('id'))
  subjects = current_app.config.get('SUBJECTS', {})
  if subject_id not in subjects:
    return redirect(url_for('view.home'))
  return render_template("student/checkSubject.html", subject=dict(id=subject_id,name=subjects[subject_id]['subject']))