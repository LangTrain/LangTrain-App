import firebase_admin
from firebase_admin import credentials, firestore

#! DO NOT RUN THIS FILE UNLESS YOU WANT TO ADD/CHANGE SOMETHING TO ALL USER SCHEMAS IN FIRESTORE.
# if you do need to change or update the user schema, then run this file after making the edits
# also let the team know after!

if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()


def update_user_schema():
    try:
        users_ref = db.collection("users")
        users = users_ref.stream()

        batch = db.batch()
        for user in users:
            user_id = user.id
            data = user.to_dict()

            # Add or modify fields in each document
            updated_data = {
                "first_name": data.get("first_name", ""),
                "last_name": data.get("last_name", ""),
                # Add more fields or modify existing ones as needed
            }
            user_doc_ref = users_ref.document(user_id)
            batch.update(user_doc_ref, updated_data)

        # Commit the batch
        batch.commit()

        print("Schema update complete.")
    except Exception as e:
        print(f"Error updating schema: {str(e)}")


if __name__ == "__main__":
    update_user_schema()
