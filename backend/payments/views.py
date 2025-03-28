from rest_framework import status
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from account.models import OrderModel
from datetime import datetime

# Placeholder for saving card in the database
def save_card_in_db(cardData, email, cardId, customer_id, user):
    pass

# Just for testing
class TestStripeImplementation(APIView):
    def post(self, request):
        return Response(data={"message": "Test payment process placeholder"}, status=status.HTTP_200_OK)

# Check token expired or not
class CheckTokenValidation(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response("Token is Valid", status=status.HTTP_200_OK)

# Placeholder for creating card token
class CreateCardTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        return Response({"message": "Card token creation placeholder"}, status=status.HTTP_200_OK)

# Charge the customer card
class ChargeCustomerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            # Saving order in Django database
            new_order = OrderModel.objects.create(
                name=data["name"],
                card_number=data["card_number"],
                address=data["address"],
                ordered_item=data["ordered_item"],
                paid_status=data["paid_status"],
                paid_at=datetime.now(),
                total_price=data["total_price"],
                is_delivered=data["is_delivered"],
                delivered_at=data["delivered_at"],
                user=request.user
            )
            return Response(
                data={"message": "Payment successful placeholder"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Retrieve card details placeholder
class RetrieveCardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({"message": "Retrieve card details placeholder"}, status=status.HTTP_200_OK)

# Update a card placeholder
class CardUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        return Response({"message": "Card updated successfully placeholder"}, status=status.HTTP_200_OK)

# Delete card placeholder
class DeleteCardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        return Response("Card deleted successfully placeholder.", status=status.HTTP_200_OK)