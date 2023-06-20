import random
from django.core.management.base import BaseCommand
from faker import Faker
from ...models import Comment, CustomUser, Product

class Command(BaseCommand):
    help = 'Create dummy data for the Comment model'

    def add_arguments(self, parser):
        parser.add_argument('total', type=int, help='Indicates the number of comments to create')

    def handle(self, *args, **kwargs):
        faker = Faker()
        total = kwargs['total']
        users = list(CustomUser.objects.all())
        products = list(Product.objects.all())
        possible_comments = [
            "Great product!",
            "I love this!",
            "Amazing quality.",
            "Not worth the price.",
            "I didn't like it.",
            "Best purchase ever!",
            # Add more comments as needed
        ]

        for _ in range(total):
            Comment.objects.create(
                from_user=random.choice(users),
                to_product=random.choice(products),
                comment=random.choice(possible_comments),
                rating=faker.random_int(1, 5),
                isApproved=faker.boolean()
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully created {total} comments'))
