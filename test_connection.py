import psycopg2

# PostgreSQL ulanish sozlamalari
DB_CONFIG = {
    'host': '172.18.33.254',
    'database': 'hmdm',
    'user': 'hmdm',
    'password': 'Ax@30-10',
    'port': '5432'
}

def test_database_connection():
    """PostgreSQL ga ulanishni tekshirish"""
    try:
        # Bazaga ulanish
        conn = psycopg2.connect(**DB_CONFIG)
        
        # Agar ulanish muvaffaqiyatli bo'lsa
        print("Ma'lumotlar bazasiga muvaffaqiyatli ulandi!")
        
        # Ulanishni yopish
        conn.close()
        
    except Exception as e:
        # Xatolik yuz berganda
        print("Bazaga ulanib bo'lmadi!")
        print("Xatolik: ", str(e))

if __name__ == "__main__":
    test_database_connection()
