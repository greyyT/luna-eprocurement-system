# Generated by Django 4.2.5 on 2023-10-10 15:38

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('code', models.CharField(db_index=True, max_length=20, unique=True)),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='LegalEntity',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('legal_entity_code', models.CharField(db_index=True, max_length=20, unique=True)),
                ('business_num', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('SKU', models.CharField(max_length=200)),
                ('brand', models.CharField(max_length=200)),
                ('code', models.CharField(db_index=True, max_length=200, unique=True)),
                ('category', models.CharField(max_length=200)),
                ('weight', models.CharField(max_length=5)),
                ('width', models.CharField(max_length=5)),
                ('height', models.CharField(max_length=5)),
                ('length', models.CharField(max_length=5)),
                ('color', models.CharField(max_length=200)),
                ('material', models.CharField(max_length=200)),
                ('image', models.ImageField(blank=True, default=None, null=True, upload_to='images/products')),
                ('legal_entity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='api.legalentity')),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('code', models.CharField(db_index=True, max_length=200, unique=True)),
                ('label', models.CharField(max_length=200)),
                ('is_default', models.BooleanField(default=False)),
                ('purchase_allowance', models.DecimalField(decimal_places=2, max_digits=10)),
                ('current_purchase', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('purchase_count', models.IntegerField(default=0)),
                ('legal_entity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='projects', to='api.legalentity')),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('role', models.CharField(choices=[('ADMINISTRATOR', 'Administrator'), ('MANAGER', 'Manager'), ('MEMBER', 'Member'), ('VIEWER', 'Viewer'), ('SUPERVISOR', 'Supervisor')], max_length=15)),
                ('approve', models.BooleanField(default=True)),
                ('reject', models.BooleanField(default=True)),
                ('legal_entity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='roles', to='api.legalentity')),
            ],
            options={
                'unique_together': {('role', 'legal_entity')},
            },
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('code', models.CharField(db_index=True, max_length=20, unique=True)),
                ('name', models.CharField(max_length=200)),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='teams', to='api.department')),
            ],
        ),
        migrations.CreateModel(
            name='Vendor',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('code', models.CharField(db_index=True, max_length=200, unique=True)),
                ('description', models.TextField(blank=True, default=None, null=True)),
                ('business_num', models.CharField(max_length=200)),
                ('image', models.ImageField(upload_to='images/vendors')),
                ('legal_entity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vendors', to='api.legalentity')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=30, unique=True)),
                ('email', models.EmailField(db_index=True, max_length=200, unique=True)),
                ('password', models.CharField(max_length=200)),
                ('department', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.department')),
                ('legal_entity', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='users', to='api.legalentity')),
                ('role', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.role')),
                ('team', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.team')),
            ],
        ),
        migrations.CreateModel(
            name='PurchaseRequisition',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('priority', models.CharField(choices=[('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High')], max_length=10)),
                ('target_date', models.DateField()),
                ('due_date', models.DateField()),
                ('status', models.CharField(choices=[('DRAFT', 'Draft'), ('READY', 'Ready'), ('WAITING_TO_APPROVAL', 'Waiting to Approval'), ('TO_DO', 'To Do'), ('IN_PROGRESS', 'In Progress'), ('ON_HOLD', 'On Hold'), ('CANCELLED', 'Cancelled'), ('COMPLETED', 'Completed')], default='DRAFT', max_length=20)),
                ('is_approved', models.BooleanField(default=False)),
                ('is_rejected', models.BooleanField(default=False)),
                ('rejected_comment', models.TextField(blank=True, default=None, null=True)),
                ('legal_entity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='purchase_requisitions', to='api.legalentity')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='purchase_requisitions', to='api.project')),
                ('requester', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='purchase_requisitions', to='api.user')),
            ],
        ),
        migrations.AddField(
            model_name='department',
            name='legal_entity',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='departments', to='api.legalentity'),
        ),
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('phone', models.CharField(max_length=200)),
                ('position', models.CharField(max_length=200)),
                ('vendor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contacts', to='api.vendor')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_updated', models.BooleanField(default=False)),
                ('purchase_requisition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='api.purchaserequisition')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='comments', to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='ProductPurchaseRequisition',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('quantity', models.IntegerField()),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='purchase_requisitions', to='api.product')),
                ('purchase_requisition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product_purchase_requisitions', to='api.purchaserequisition')),
                ('vendor', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='product_purchase_requisitions', to='api.vendor')),
            ],
            options={
                'unique_together': {('product', 'purchase_requisition')},
            },
        ),
        migrations.CreateModel(
            name='Price',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prices', to='api.product')),
                ('vendor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prices', to='api.vendor')),
            ],
            options={
                'unique_together': {('product', 'vendor')},
            },
        ),
    ]