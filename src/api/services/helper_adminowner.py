from api.models import AdminOwnerProperty
from api.models.users import Role

def get_accessible_owner_ids(user):
    """
    Devuelve una lista de owner_id a los que el usuario tiene acceso.
    - ADMIN → todos los propietarios asociados
    - PROPIETARIO → solo su propio id
    """
    print ("User:", user)
    if user.role == Role.ADMIN:
        relations = AdminOwnerProperty.query.filter_by(admin_id=user.id, active=True).all()
        return [rel.owner_id for rel in relations]
    elif user.role == Role.PROPIETARIO:
        return [user.id]
    else:
        return []
