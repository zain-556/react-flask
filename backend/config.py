class config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///users.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # FIX: removed stray `from flask_sqlalchemy import SQLAlchemy` that was
    #      sitting inside the class body — it was unused dead code.
    #      The real SQLAlchemy instance lives in model.py.
