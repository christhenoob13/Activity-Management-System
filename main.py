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
  },
  2: {
    "id": 2,
    "subject": "Earth Science",
    "teacher": "RBNoro"
  },
  3: {
    "id": 3,
    "subject": "Physical Education",
    "teacher": "EVPalceso"
  },
  4: {
    "id": 4,
    "subject": "Pre-Calculus",
    "teacher": "ARRecto"
  },
  5: {
    "id": 5,
    "subject": "General Mathematics",
    "teacher": "ARRecto"
  },
  6: {
    "id": 6,
    "subject": "English for Academic and Pofessional Purposes",
    "teacher": "MBFlores"
  },
  7: {
    "id": 7,
    "subject": "Oral Communication",
    "teacher": "HNMendoza"
  },
  7: {
    "id": 7,
    "subject": "Komunikasyon at Pananaliksik sa Wikang Filipino at Kulturang Pilipino",
    "teacher": "MDAndaya"
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
    port=PORT,
    debug=False,
  )