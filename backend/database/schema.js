const db = require("./database");


db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );


    CREATE TABLE IF NOT EXISTS apis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        base_url TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );


    CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_id INTEGER NOT NULL,
        key_hash TEXT NOT NULL,
        key_prefix TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (api_id)
        REFERENCES apis(id)
        ON DELETE CASCADE
    );


    CREATE TABLE IF NOT EXISTS request_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_id INTEGER NOT NULL,
        method TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        status_code INTEGER,
        response_time INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (api_id)
        REFERENCES apis(id)
        ON DELETE CASCADE
    );


    CREATE TABLE IF NOT EXISTS rate_limit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        api_id INTEGER NOT NULL,
        api_key_id INTEGER,
        endpoint TEXT NOT NULL,
        status_code INTEGER DEFAULT 429,
        retry_after INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (api_id)
        REFERENCES apis(id)
        ON DELETE CASCADE,

        FOREIGN KEY (api_key_id)
        REFERENCES api_keys(id)
        ON DELETE SET NULL
    );
`);


console.log(
    "Database tables created successfully"
);