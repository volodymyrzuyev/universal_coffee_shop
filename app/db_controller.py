"""
Dedicated controller for writing to and reading from the main database.
Please run "database_connect()" to connect to the database prior to transactions and "database_close()" to disconnect when done with operations.
"""
import sqlite3
import os

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

    def database_connect(self):
        """
        Connects to the database
        """
        self.connection = sqlite3.connect(self.database_location)
        self.cursor = self.connection.cursor()
        self.is_closed = False

    def database_close(self):
        """
        Closes the current database connection.
        """
        if not self.is_closed:
            self.connection.close()
            self.is_closed = True


    def _create_database(self):
        """
        Initializes the database.
        """
        self.database_connect()

        self.cursor.execute("BEGIN TRANSACTION;")
        self.cursor.execute("""
        CREATE TABLE users(
            user_id TEXT PRIMARY KEY UNIQUE,
            user_name TEXT,
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

        self.database_close()

    def __del__(self):
        if not self.is_closed:
            print(f"Error: Closing {self.database_location} database on garbage collection. Please close databases manually before deletion.")
            self.database_close()