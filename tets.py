import dataset

db = dataset.connect("sqlite:///db/database.db")
acc = db['accounts']

print(acc.update(dict(id=1, is_admin=True), ['id']))
