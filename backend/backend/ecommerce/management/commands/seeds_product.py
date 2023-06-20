import os
from django.conf import settings
from django.core.files import File
import random
from django.core.management.base import BaseCommand
from faker import Faker
from ...models import Product, CustomUser, Category


class Command(BaseCommand):
    help = 'Create dummy data for the Product model'

    def add_arguments(self, parser):
        parser.add_argument('total', type=int, help='Indicates the number of products to create')

    def handle(self, *args, **kwargs):
        faker = Faker()
        total = kwargs['total']
        product_managers = list(CustomUser.objects.filter(role=CustomUser.PRODUCT_MANAGER))
        sale_managers = list(CustomUser.objects.filter(role=CustomUser.SALE_MANAGER))

        # Specify the path of the image relative to MEDIA_ROOT
        image_path = os.path.join(settings.MEDIA_ROOT, "product_image",'send.png')

        with open(image_path, 'rb') as image_file:
            image = File(image_file)

            for _ in range(total):
                if not product_managers or not sale_managers:
                    self.stdout.write(self.style.WARNING(f'Not enough Product Managers or Sales Managers to assign to products. Please create more users with these roles.'))
                    break

                product = Product(
                    product_manager=random.choice(product_managers),
                    sale_manager=random.choice(sale_managers),
                    product_name=faker.catch_phrase(),
                    brand=faker.company(),
                    category=random.choice(Category.objects.all()),
                    description=faker.text(),
                    initial_price=faker.random.uniform(1, 1000),
                    count_in_stock=faker.random_int(0, 100),
                    image=image # Assign the image to the product instance
                )
                product.save()

        self.stdout.write(self.style.SUCCESS(f'Successfully created {total} products'))