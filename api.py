from flask import (
  Blueprint,
  session,
  request,
  jsonify
)

api = Blueprint('api', __name__)
adm_api = Blueprint('adm_api', __name__)

"""
  Normal APIs
"""


"""
  APIs FOR ADMINISTRATOR
"""
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

@adm_api.route('/data/activities', methods=['GET'])
def adm_api_ALL_ACTIVITIES():
  pass