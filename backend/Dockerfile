FROM python:3.8-alpine

ENV PYTHONDONTWRITEBYTECODE 1 \
    PYTHONUNBUFFERED 1

WORKDIR /usr/src/backend
COPY . .

RUN pip install --upgrade pip && \
    pip install --upgrade setuptools && \
    apk add --no-cache alpine-sdk && \
    pip install -r requirements.txt

EXPOSE 8080

CMD ["sh", "-c", "python manage.py makemigrations api && python manage.py migrate && python manage.py runserver 0.0.0.0:8080"]