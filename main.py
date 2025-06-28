from flask import Flask, Blueprint

from auth import auth
from views import view

app = Flask(__name__)
app.secret_key = "&U-7Bjueh&:£77-jisiwiiJiebz8eh3iU*y682I"

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(view)

if __name__ == '__main__':
  app.run(debug=False)