from flask import (
  Blueprint,
  request,
  render_template,
  session,
  redirect, url_for
)

view = Blueprint('view',__name__)

# subjects
data = [
  {
    "subject": "Philosophy",
    "teacher": "Mary Grace Remulla"
  },
  {
    "subject": "Entrepreneurship",
    "teacher": "Cristina Mendoza"
  },
  {
    "subject": "Contemporary Philippine Arts",
    "teacher": "Renz Cruz"
  },
  {
    "subject": "Understanding Culture, Society and Politics",
    "teacher": "Nelson U. Rubio"
  },
  {
    "subject": "21st Century",
    "teacher": "Catherine Bergado"
  },
  {
    "subject": "Physical Education ans Health",
    "teacher": "Edison V. Palceso"
  },
  {
    "subject": "Practical Research 2",
    "teacher": "Jaime R. Soriano"
  }
]

@view.route('/')
def home():
  if not session.get('is_login'):
    return redirect(url_for('auth.login'))
  return render_template('home.html', subjects=data)