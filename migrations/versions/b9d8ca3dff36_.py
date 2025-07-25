"""empty message

Revision ID: b9d8ca3dff36
Revises: cca51486e0f3
Create Date: 2025-07-17 18:13:42.156704

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b9d8ca3dff36'
down_revision = 'cca51486e0f3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('expenses', schema=None) as batch_op:
        batch_op.drop_constraint('expenses_tax_type_id_fkey', type_='foreignkey')
        batch_op.drop_constraint('expenses_withholding_id_fkey', type_='foreignkey')
        batch_op.drop_column('withholding_id')
        batch_op.drop_column('tax_type_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('expenses', schema=None) as batch_op:
        batch_op.add_column(sa.Column('tax_type_id', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('withholding_id', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.create_foreign_key('expenses_withholding_id_fkey', 'withholdings', ['withholding_id'], ['id'])
        batch_op.create_foreign_key('expenses_tax_type_id_fkey', 'tax_types', ['tax_type_id'], ['id'])

    # ### end Alembic commands ###
