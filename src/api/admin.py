  
import os
from flask_admin import Admin
from api.models import( db, User, Contract, Action,Issue,Apartment,AssocTenantApartmentContract,
                       Invoice,ContactRequest,Expense,
                       ExpenseCategory,Contractor,TaxType,Withholding, Docusing, AdminOwnerProperty, Subscription)
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Contract, db.session))
    admin.add_view(ModelView(Action, db.session))
    admin.add_view(ModelView(Issue, db.session))
    admin.add_view(ModelView(Apartment, db.session))
    admin.add_view(ModelView(AssocTenantApartmentContract, db.session))
    admin.add_view(ModelView(Invoice, db.session))
    admin.add_view(ModelView(ContactRequest, db.session))
    admin.add_view(ModelView(Contractor, db.session))
    admin.add_view(ModelView(Expense, db.session))
    admin.add_view(ModelView(ExpenseCategory, db.session))
    admin.add_view(ModelView(TaxType, db.session))
    admin.add_view(ModelView(Withholding, db.session))
    admin.add_view(ModelView(Docusing, db.session))
    admin.add_view(ModelView(AdminOwnerProperty, db.session))
    admin.add_view(ModelView(Subscription, db.session))
 