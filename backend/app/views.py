import logging
from django.http import JsonResponse, QueryDict
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from firebase_admin import firestore, initialize_app
from .firebase import db
from django.views.decorators.csrf import csrf_exempt


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure Firebase Admin SDK is initialized
try:
    initialize_app()
except ValueError:
    pass


#! Will need to remove this csrf (security feature) exempt and add csrf compatibility in front end for prod


@csrf_exempt
@require_POST
def create_user_profile(request):
    user_id = request.POST.get("user_id")
    email = request.POST.get("email")
    first_name = request.POST.get("first_name", "")
    last_name = request.POST.get("last_name", "")

    if not user_id or not email:
        return JsonResponse(
            {"status": "error", "message": "Missing user_id or email"}, status=400
        )

    try:
        # Add data to Firestore
        doc_ref = db.collection("users").document(user_id)
        doc_ref.set({"email": email, "first_name": first_name, "last_name": last_name})
        return JsonResponse({"status": "success", "message": "User profile created"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


@csrf_exempt
@require_GET
def get_all_users(request):
    logger.info("Fetching all users")

    try:
        users_ref = db.collection("users")
        users = users_ref.stream()

        users_list = [{"user_id": user.id, "data": user.to_dict()} for user in users]
        logger.info("Fetched %d users", len(users_list))
        return JsonResponse({"status": "success", "data": users_list})
    except Exception as e:
        logger.error("Error fetching users: %s", str(e))
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PUT", "POST"])
def update_user_profile(request, user_id):
    # Handle both PUT and POST data parsing
    if request.method == "PUT":
        data = QueryDict(request.body.decode("utf-8"))
    else:
        data = request.POST

    first_name = data.get("first_name")
    last_name = data.get("last_name")

    if not first_name or not last_name:
        return JsonResponse(
            {"status": "error", "message": "Missing first_name or last_name"},
            status=400,
        )

    try:
        # Update data in Firestore
        doc_ref = db.collection("users").document(user_id)
        doc_ref.update({"first_name": first_name, "last_name": last_name})
        return JsonResponse({"status": "success", "message": "User profile updated"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
