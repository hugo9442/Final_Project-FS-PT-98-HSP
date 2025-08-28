import psycopg2

try:
    conn = psycopg2.connect(
        dbname="example",
        user="gitpod",
        password="postgres",
        host="localhost",
        port="5432"
    )
    print("Conexión OK")
    conn.close()
except Exception as e:
    print("Error de conexión:", e)
