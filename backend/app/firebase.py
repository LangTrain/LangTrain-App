import firebase_admin
from firebase_admin import credentials, firestore

# Use the service account key file
cred = credentials.Certificate("firebase_key.json")

# Initialize the Firebase app
firebase_admin.initialize_app(cred)

# Get a reference to the Firestore service
db = firestore.client()
