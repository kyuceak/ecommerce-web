from django.core.management.base import BaseCommand
from django.contrib.auth.models import UserManager
from ...models import CustomUser

class Command(BaseCommand):
    help = 'Create dummy users for the CustomUser model'

    def add_arguments(self, parser):
        parser.add_argument('total', type=int, help='Indicates the number of users to create')

    def handle(self, *args, **kwargs):
        total = kwargs['total']
        password = '123456'
        roles = [CustomUser.PRODUCT_MANAGER, CustomUser.SALE_MANAGER, CustomUser.USER]

        for i in range(total):
            username = f'user{i+1}'
            email = f'user{i+1}@example.com'
            role = roles[i % len(roles)]  # This will distribute the roles among users
            user = CustomUser(username=username, email=email, role=role)
            user.set_password(password)
            user.save()

            self.stdout.write(self.style.SUCCESS(f'Successfully created user {username} with role {role}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully created {total} users'))
