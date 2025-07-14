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
  accounts_count = len(current_app.config.get('DATABASE')['accounts']) - 1
  subjects_count = len(current_app.config.get('SUBJECTS',{}))
  activity_count = 10 # TO-DO: the length of all activity
  return render_template("admin/dashboard.html", show_eruda=True, accounts_count=accounts_count, subjects_count=subjects_count, activity_count=activity_count)


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
  return render_template('admin/accounts.html', data=data, show_eruda=True)

@admin.route('/activity')
def dash_activities():
  if not session.get('is_login'):
    return redirect(url_for('auth.login'))
  if not session.get('user',{}).get('is_admin'):
    return render_template('error_pages/permission.html')
  data = [
    {
      "task": 'Activity 1',
      "description": 'eto ay description para sa mga pogi',
      "category": 'activity',
      "subject_id": 1,
      "date": 'July 17, 2025'
    } for _ in range(22)
  ]
  return render_template('admin/activity.html', show_eruda=True, data=data)

"""ADMIN APIs"""
@admin.route('/api/delete-account', methods=['GET'])
def api_delete_account():
  if not session.get('is_login'):
    return jsonify({
      "status": 'error',
      "message": 'Hindi ka pa naka login'
    }), 2020
  if not session.get('user',{}).get('is_admin'):
    return jsonify({
      "status": 'error',
      "message": 'Wala kang permission'
    }), 2021
  uid = request.args.get("id")
  if not uid:
    return jsonify({"status":'error',"message":'Missing id parameters'}), 2023
  users = current_app.config.get('DATABASE')['accounts']
  try:
    if users.find_one(id=int(uid)):
      users.delete(id=int(uid))
      return jsonify({
        "status": 'success',
        "message": "Account has been deleted"
      }),2005
    else:
      return jsonify({
        "status": 'error',
        "message": f'Account with \'{uid}\' id not found'
      }),200
  except ValueError:
    return jsonify({"status":'error',"message":'Invalid id parameter value'}),2002
  except Exception as e:
    print("ERROR: ", e)
    return jsonify({"status":'error', 'message': str(e)})