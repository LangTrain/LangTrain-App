# LangTrain-Template

\*For front end:

cd into frontend/LangTrain_frontend

npm install

set up env.js based on envjs-example.js

npx expo start -c

\*For backend:

cd into backend

python -m venv venv

source venv/bin/activate (Mac) or .\venv\Scripts\activate (Windows)

generate firebase key from service accounts and put into firebase_key.json file in backend folder

pip install -r requirements.txt

python manage.py runserver

RUN TESTS:

python manage.py test

or check manual tests in example_tests.txt
