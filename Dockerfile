FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIP_NO_CACHE_DIR 1

RUN pip install "poetry==2.1.3"

WORKDIR /app

COPY pyproject.toml uv.lock ./

RUN poetry config virtualenvs.create false && \
    poetry install --only main --no-interaction --no-root

COPY src/ .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
