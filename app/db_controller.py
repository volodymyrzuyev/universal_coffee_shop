"""
Dedicated controller for writing to and reading from the main database.
Please run "database_connect()" to connect to the database prior to transactions and "database_close()" to disconnect when done with operations.
"""
import sqlite3
import os
from typing import List
import uuid

class DatabaseController:

    def __init__(self, database_location: str):
        """
        Initializes the database controller.
        If the database does not exist, it will be created and initialized with empty tables.
        If you link an invalid database, undocumented behavior will occur.
        """
        self.database_location = database_location

        if not os.path.isfile(self.database_location):
            self._create_database()

        self.is_closed = False

    def database_connect(self) -> None:
        """
        Connects to the database
        """
        self.connection = sqlite3.connect(self.database_location)
        self.cursor = self.connection.cursor()
        self.is_closed = False

    def database_close(self) -> None:
        """
        Closes the current database connection.
        """
        if not self.is_closed:
            self.connection.close()
            self.is_closed = True

    def _create_database(self) -> None:
        """
        Initializes the database.
        """
        self.database_connect()

        self.cursor.execute("BEGIN TRANSACTION;")
        self.cursor.execute("""
        CREATE TABLE users(
            user_id TEXT PRIMARY KEY UNIQUE,
            user_name TEXT UNIQUE,
            password TEXT,
            is_admin INTEGER
        );
        """)
        self.connection.commit()

        self.cursor.execute("BEGIN TRANSACTION;")
        self.cursor.execute("""
        CREATE TABLE google_tokens(
            token TEXT PRIMARY KEY,
            user_id TEXT,
            FOREIGN KEY(user_id) REFERENCES users(user_id)
        );
        """)
        self.connection.commit()
        
        self.cursor.execute("BEGIN TRANSACTION;")
        self.cursor.execute("""
        CREATE TABLE apple_tokens(
            token TEXT PRIMARY KEY,
            user_id TEXT,
            FOREIGN KEY(user_id) REFERENCES users(user_id)
        );
        """)
        self.connection.commit()

        self.cursor.execute("BEGIN TRANSACTION;")
        self.cursor.execute("""
        CREATE TABLE facebook_tokens(
            token TEXT PRIMARY KEY,
            user_id TEXT,
            FOREIGN KEY(user_id) REFERENCES users(user_id)
        );
        """)
        self.connection.commit()

        # New domain tables
        self.cursor.execute("BEGIN TRANSACTION;")
        self.cursor.execute("""
        CREATE TABLE stores(
            store_id TEXT PRIMARY KEY,
            coffee_shop_name TEXT,
            owner_id TEXT,
            street_address TEXT,
            city TEXT,
            state TEXT,
            phone_number INTEGER,
            FOREIGN KEY(owner_id) REFERENCES users(user_id)
        );
        """)
        self.connection.commit()

        self.cursor.execute("BEGIN TRANSACTION;")
        self.cursor.execute("""
        CREATE TABLE user_owns(
            user_id TEXT,
            store_id TEXT,
            PRIMARY KEY(user_id, store_id),
            FOREIGN KEY(user_id) REFERENCES users(user_id),
            FOREIGN KEY(store_id) REFERENCES stores(store_id)
        );
        """)
        self.connection.commit()

        self.database_close()

    def create_user(self, user_id: str, user_name: str, password: str, is_admin: bool) -> None:
        """
        Creates a new user in the database.
        """
        self.cursor.execute("BEGIN TRANSACTION;")
        self.cursor.execute("""
        INSERT INTO users (user_id, user_name, password, is_admin)
        VALUES (?, ?, ?, ?);
        """, (user_id, user_name, password, int(is_admin)))
        self.connection.commit()
    
    def get_user_from_id(self, user_id: str) -> tuple:
        """
        Retrieves a user from the database by user ID.
        """
        self.cursor.execute("""
        SELECT * FROM users WHERE user_id = ?;
        """, (user_id,))
        return self.cursor.fetchone()
    
    def get_user_from_token(self, token: str, platform: str) -> tuple:
        """
        Retrieves a user from the database by token and platform.
        Platform must be "google", "apple", or "facebook".
        """
        table_mapping = {
            "google": "google_tokens",
            "apple": "apple_tokens",
            "facebook": "facebook_tokens"
        }
        table = table_mapping.get(platform)
        if table is None:
            raise ValueError("Invalid platform. Must be one of 'google', 'apple', or 'facebook'.")

        query = f"""
        SELECT users.* FROM users
        JOIN {table} ON users.user_id = {table}.user_id
        WHERE {table}.token = ?;
        """
        self.cursor.execute(query, (token,))
        return self.cursor.fetchone()
    
    def validate_password(self, user_id: str, password: str) -> bool:
        """
        Validates a user's password.
        """
        self.cursor.execute("""
        SELECT password FROM users WHERE user_id = ?;
        """, (user_id,))
        result = self.cursor.fetchone()
        if result is None:
            return False
        return result[0] == password
    
    def check_unique_username(self, user_name: str) -> bool:
        """
        Checks if a username is unique.
        """
        self.cursor.execute("""
        SELECT * FROM users WHERE user_name = ?;
        """, (user_name,))
        result = self.cursor.fetchone()
        return result is None


    """
    ---------------------------
    Functions for managing store data.
    ---------------------------
    """

    def add_user_store(self, user_id: str, store_id: str) -> None:
        """Creates a link in user_owns: a user owns/has access to a store."""
        self.cursor.execute("BEGIN TRANSACTION;")
        self.cursor.execute(
            """
            INSERT INTO user_owns (user_id, store_id)
            VALUES (?, ?);
            """,
            (user_id, store_id),
        )
        self.connection.commit()

    def get_store_by_id(self, store_id: str) -> tuple:
        """Fetch a single store record by ID."""
        self.cursor.execute(
            """
            SELECT store_id, coffee_shop_name, owner_id, street_address, city, state, phone_number
            FROM stores WHERE store_id = ?;
            """,
            (store_id,),
        )
        return self.cursor.fetchone()

    def get_stores_for_user(self, user_id: str) -> List[tuple]:
        """Return all stores linked to a user via user_owns."""
        self.cursor.execute(
            """
            SELECT s.store_id, s.coffee_shop_name, s.owner_id, s.street_address, s.city, s.state, s.phone_number
            FROM stores s
            JOIN user_owns uo ON uo.store_id = s.store_id
            WHERE uo.user_id = ?;
            """,
            (user_id,),
        )
        return self.cursor.fetchall()

    def create_coffee_shop(self, coffee_shop_name: str, owner_id: str, street_address: str, city: str, state: str, phone_number: int) -> str:
        """
        Creates a coffee shop with a generated unique store_id and returns it.
        Also links the owner to the store in user_owns.
        """
        while True:
            store_id = uuid.uuid4().hex
            self.cursor.execute("SELECT 1 FROM stores WHERE store_id = ?;", (store_id,))
            if self.cursor.fetchone() is None:
                break

        self.cursor.execute("BEGIN TRANSACTION;")
        self.cursor.execute(
            """
            INSERT INTO stores (store_id, coffee_shop_name, owner_id, street_address, city, state, phone_number)
            VALUES (?, ?, ?, ?, ?, ?, ?);
            """,
            (store_id, coffee_shop_name, owner_id, street_address, city, state, phone_number),
        )
        self.connection.commit()

        self.add_user_store(owner_id, store_id)

        return store_id
    
    def __del__(self):
        if not self.is_closed:
            print(f"Error: Closing {self.database_location} database on garbage collection. Please close databases manually before deletion.")
            self.database_close()