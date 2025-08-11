from flask import Flask, Blueprint
import dataset
import os

from auth import auth
from views import view
from admin import admin
from api import adm_api, api

# database config
database_url = os.getenv('DB_URL', 'sqlite:///db/database.db')
db = dataset.connect(database_url)

# app configuration
app = Flask(__name__)
app.secret_key = "bdid82uhxi3hiejxjoehxiejnxd"
app.config['DATABASE'] = db
app.config['ADMIN'] = {
  "email": 'admin',
  "password": 'admin123'
}
app.config['SUBJECTS'] = {
  1: {
    "id": 1,
    "subject": "General Biology",
    "teacher": "JRSoriano"
  }
}

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(admin, url_prefix='/admin')
app.register_blueprint(adm_api, url_prefix='/admin/api')
app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(view)

if __name__ == '__main__':
  PORT = os.getenv('PORT', 5000)
  app.run(
    host='0.0.0.0',
    port=2000,#PORT,
    debug=True,
  )