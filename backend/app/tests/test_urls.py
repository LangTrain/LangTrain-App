from django.test import TestCase, Client
from django.urls import reverse
from django.http import QueryDict
from unittest.mock import patch, MagicMock


class UserProfileTests(TestCase):
    def setUp(self):
        self.client = Client()
        # Mock Firestore client for setup
        patcher = patch("app.views.db")
        self.addCleanup(patcher.stop)
        self.mock_db = patcher.start()

        # Prepare mock collection and document
        self.mock_collection = MagicMock()
        self.mock_document = MagicMock()
        self.mock_db.collection.return_value = self.mock_collection
        self.mock_collection.document.return_value = self.mock_document

    @patch("app.views.db")
    def test_create_user_profile(self, mock_db):
        mock_db.collection.return_value = self.mock_collection
        self.mock_document.set.reset_mock()

        response = self.client.post(
            reverse("create_user_profile"),
            {
                "user_id": "test_user1",
                "email": "test@exampled.com",
                "first_name": "New",
                "last_name": "User",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content, {"status": "success", "message": "User profile created"}
        )
        # Verify set is called with the correct data
        self.mock_document.set.assert_called_once_with(
            {"email": "test@exampled.com", "first_name": "New", "last_name": "User"}
        )

    @patch("app.views.db")
    def test_get_all_users(self, mock_db):
        mock_db.collection.return_value = self.mock_collection
        # Mock document snapshot
        mock_document_snapshot = MagicMock()
        mock_document_snapshot.id = "test_user1"
        mock_document_snapshot.to_dict.return_value = {
            "email": "test@exampled.com",
            "first_name": "New",
            "last_name": "User",
        }
        self.mock_collection.stream.return_value = [mock_document_snapshot]

        response = self.client.get(reverse("get_all_users"))
        self.assertEqual(response.status_code, 200)
        self.assertIn("status", response.json())
        self.assertEqual(response.json()["status"], "success")
        self.assertIn("data", response.json())

    @patch("app.views.db")
    def test_update_user_profile_with_put(self, mock_db):
        # Mock setup
        mock_db.collection.return_value = self.mock_collection
        self.mock_document.update.reset_mock()

        # Ensure the initial state is set
        self.client.post(
            reverse("create_user_profile"),
            {
                "user_id": "test_user",
                "email": "test@example.com",
                "first_name": "Old",
                "last_name": "Name",
            },
        )

        # Perform PUT request
        response = self.client.put(
            reverse("update_user_profile", args=["test_user"]),
            data="first_name=John&last_name=Doe",
            content_type="application/x-www-form-urlencoded",
        )

        # Debugging output
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.content}")

        # Assert the expected result
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content, {"status": "success", "message": "User profile updated"}
        )
        self.mock_document.update.assert_called_once_with(
            {"first_name": "John", "last_name": "Doe"}
        )

    @patch("app.views.db")
    def test_update_user_profile_missing_data(self, mock_db):
        response = self.client.put(
            reverse("update_user_profile", args=["test_user"]),
            QueryDict("first_name=John"),
            content_type="application/x-www-form-urlencoded",
        )
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(
            response.content,
            {"status": "error", "message": "Missing first_name or last_name"},
        )
