from flask import (
  Blueprint,
  session,
  request,
  jsonify,
  current_app
)
from time import sleep as delay

api = Blueprint('api', __name__)         # /api
adm_api = Blueprint('adm_api', __name__) # /admin/api

@api.route('/data/subject-activity')
def api_SUBJECT_ACTIVITY_TRACK():
  if not session.get('is_login'):
    return jsonify({
      "status": 'error',
      "message": 'Hindi ka pa naka login'
    }), 2020
  user = session.get('user', {})
  if user.get('is_admin'):
    return jsonify({
      "status": 'error',
      "message": 'Unexpected error'
    }), 2003
  
  db = current_app.config.get('DATABASE')
  
  aid = int(request.args.get('subid')) # Subject ID
  sid = int(user.get('id')) # Student ID
  
  activities = [dict(activity) for activity in db['activity'].find(subject_id=f"{aid}")]
  completo = [dict(completed) for completed in db['completedStudentActivity'].find(subject_id=aid, student_id=sid)]
  _completedID = [x['activity_id'] for x in completo]
  
  SUBJECT = current_app.config.get('SUBJECTS').get(aid)
  COMPLETE_ACTIVITIES, INCOMPLETE_ACTIVITIES = [], []
  for activity in activities:
    (COMPLETE_ACTIVITIES if activity['id'] in _completedID else INCOMPLETE_ACTIVITIES).append(activity)
  
  return jsonify({
    "subject": SUBJECT,
    "complete": COMPLETE_ACTIVITIES,
    "incomplete": INCOMPLETE_ACTIVITIES
  })

@adm_api.route('/delete-account', methods=['GET'])
def adm_api_DELETE_ACCOUNT():
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

@api.route('/data/activities', methods=['GET'])
def adm_api_ACTIVITY_DATA():
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
  
  subject_id = request.args.get('subject_id', 1)
  subjects = current_app.config.get('SUBJECTS')
  
  if int(subject_id) not in subjects:
    return jsonify({
      "status": 'error',
      "message": 'Invalid subject id'
    }), 2018
  db = current_app.config.get('DATABASE')['activity']
  data = sorted([dict(x) for x in db.find(subject_id=str(subject_id))], key=lambda y: y['category'])
  return jsonify({"status":'success',"data":data}), 200

@adm_api.route('/delete-activity', methods=['GET'])
def adm_api_DELETE_ACTIVITY():
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
  aid = request.args.get("id")
  if not aid:
    return jsonify({"status":'error',"message":'Missing id parameters'}), 2023
  activ = current_app.config.get('DATABASE')['activity']
  try:
    if activ.find_one(id=int(aid)):
      activ.delete(id=int(aid))
      return jsonify({
        "status": 'success',
        "message": "Activity has been deleted"
      }),200
    else:
      return jsonify({
        "status": 'error',
        "message": f'Activities with \'{aid}\' id not found'
      }),2005
  except ValueError:
    return jsonify({"status":'error',"message":'Invalid id parameter value'}),2002
  except Exception as e:
    print("ERROR: ", e)
    return jsonify({"status":'error', 'message': str(e)})

@adm_api.route('/create-activity', methods=["POST"])
def adm_api_CREATE_ACTIVITY():
  try:
    data = request.get_json()
    db = current_app.config.get('DATABASE')['activity']
    if db.find_one(title=data.get("title"), subject_id=data.get('subject_id')):
      return jsonify({"error_message": "Title already exist, please try another title"})
    db.insert(data)
    return jsonify({'status': 'success'})
  except Exception as e:
    print("\033[41m[CREATE_ACTIVITY] ", e)
    return jsonify({"error_message":str(e)})

@adm_api.route("/accounts")
def adm_api_ALL_ACCOUNTS():
  db = current_app.config.get('DATABASE')
  return jsonify([dict(account) for account in db['accounts']])