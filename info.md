To Run:
- uvicorn app.main:app --reload

Requirements:
- pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary, pydantic

Database generation:
- alembic revision --autogenerate -m "Initial migration"
- alembic upgrade head


