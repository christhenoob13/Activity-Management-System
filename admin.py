from flask import (
  Blueprint,
  request,
  render_template,
  session,
  redirect, url_for,
  current_app,
  jsonify
)

admin = Blueprint('admin',__name__)

@admin.route('/')
def dash():
  return redirect(url_for('admin.dashboard'))

@admin.route('/dashboard')
def dashboard():
  if not session.get('is_login'):
    return redirect(url_for('auth.login'))
  if not session.get('user',{}).get('is_admin'):
    return render_template('error_pages/permission.html')
  subjects_count = len(current_app.config.get('SUBJECTS',{}))
  db = current_app.config.get("DATABASE")
  accounts_count = len([i for i in db['accounts']])
  activity_count = len([i for i in db['activity']])
  return render_template("admin/dashboard.html", accounts_count=accounts_count, subjects_count=subjects_count, activity_count=activity_count)


"""ADMIN PAGES"""
@admin.route('/accounts')
def dash_accounts():
  if not session.get('is_login'):
    return redirect(url_for('auth.login'))
  if not session.get('user',{}).get('is_admin'):
    return render_template('error_pages/permission.html')
  users = current_app.config.get('DATABASE')['accounts']
  data = [{
    "id": user['id'],
    "name": f"{user['lastname']}, {user['firstname']}",
    "strand": user['strand'],
    "grade": user['grade']
  } for user in users if not user['is_admin']]
  return render_template('admin/accounts.html', data=data)

@admin.route('/activity')
def dash_activities():
  if not session.get('is_login'):
    return redirect(url_for('auth.login'))
  if not session.get('user',{}).get('is_admin'):
    return render_template('error_pages/permission.html')
  subjects = current_app.config.get('SUBJECTS')
  return render_template('admin/activity.html', subjects=subjects)