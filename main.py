from flask import Flask, Blueprint
import dataset
import os

from auth import auth
from views import view

# database config
database_url = os.getenv('DB_URL', 'sqlite:///database.db')
db = dataset.connect(database_url)

# app configuration
app = Flask(__name__)
app.secret_key = "&U-7Bjueh&:£77-ji[ SIKRETONG MALUPET ]z8eh3iU*y682I"
app.config['DATABASE'] = db
app.config['SUBJECTS'] = {
  1: {
    "id": 1,
    "subject": "Philosophy",
    "teacher": "Mary Grace Remulla"
  },
  2: {
    "id": 2,
    "subject": "Entrepreneurship",
    "teacher": "Cristina Mendoza"
  },
  3: {
    "id": 3,
    "subject": "Contemporary Philippine Arts",
    "teacher": "Renz Cruz"
  },
  4: {
    "id": 4,
    "subject": "Understanding Culture, Society and Politics",
    "teacher": "Nelson U. Rubio"
  },
  5: {
    "id": 5,
    "subject": "21st Century",
    "teacher": "Catherine Bergado"
  },
  6: {
    "id": 6,
    "subject": "Physical Education ans Health",
    "teacher": "Edison V. Palceso"
  },
  7: {
    "id": 7,
    "subject": "Practical Research 2",
    "teacher": "Jaime R. Soriano"
  }
}

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(view)

if __name__ == '__main__':
  app.run(debug=True)