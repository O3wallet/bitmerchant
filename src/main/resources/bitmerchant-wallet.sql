


CREATE TABLE 'orders' (
'id' INTEGER NOT NULL  DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'status_id' INTEGER NOT NULL  DEFAULT NULL REFERENCES 'order_statuses' ('id'),
'total_satoshis' INTEGER NOT NULL  DEFAULT NULL,
'receive_address' TEXT DEFAULT NULL,
'button_id' INTEGER NOT NULL  DEFAULT NULL REFERENCES 'buttons' ('id'),
'transaction_hash' INTEGER DEFAULT NULL,
'payment_request_url' TEXT DEFAULT NULL,
'payment_url' TEXT DEFAULT NULL,
'merchant_data' TEXT DEFAULT NULL,
'memo' TEXT DEFAULT NULL,
'expire_time' INTEGER DEFAULT (CURRENT_TIMESTAMP + 600000),
'created_at' INTEGER NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE 'currencies' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'desc' TEXT DEFAULT NULL,
'iso' TEXT NOT NULL  DEFAULT 'NULL',
'unicode' TEXT NOT NULL  DEFAULT 'NULL',
'created_at' INTEGER NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE 'order_statuses' (
'id' INTEGER DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'status' TEXT NOT NULL  DEFAULT 'NULL',
'created_at' INTEGER NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE 'refunds' (
'id' INTEGER NOT NULL  DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'payment_id' INTEGER NOT NULL  DEFAULT NULL REFERENCES 'payments' ('id'),
'index_' INTEGER DEFAULT NULL,
'amount' INTEGER NOT NULL  DEFAULT NULL,
'script_bytes' NONE NOT NULL  DEFAULT NULL,
'created_at' INTEGER DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE 'transactions' (
'id' INTEGER NOT NULL  DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'payment_id' INTEGER DEFAULT NULL REFERENCES 'payments' ('id'),
'index_' INTEGER NOT NULL  DEFAULT NULL,
'satoshis' INTEGER DEFAULT NULL,
'bytes' NONE NOT NULL  DEFAULT NULL,
'created_at' INTEGER NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE 'buttons' (
'id' INTEGER NOT NULL  DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'type_id' INTEGER DEFAULT NULL REFERENCES 'button_types' ('id'),
'style_id' INTEGER DEFAULT NULL REFERENCES 'button_styles' ('id'),
'text' TEXT DEFAULT NULL,
'name' TEXT NOT NULL  DEFAULT 'NULL',
'description' TEXT DEFAULT NULL,
'network' TEXT DEFAULT 'test',
'callback_url' TEXT DEFAULT NULL,
'total_native' INTEGER NOT NULL  DEFAULT NULL,
'native_currency_id' INTEGER NOT NULL  DEFAULT NULL REFERENCES 'currencies' ('id'),
'variable_price' INTEGER DEFAULT 0,
'price_select' NUMERIC DEFAULT 0,
'price_1' INTEGER DEFAULT NULL,
'price_2' INTEGER DEFAULT NULL,
'price_3' INTEGER DEFAULT NULL,
'price_4' INTEGER DEFAULT NULL,
'price_5' INTEGER DEFAULT NULL,
'created_at' INTEGER NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE 'button_types' (
'id' INTEGER NOT NULL  DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'type' TEXT NOT NULL  DEFAULT 'NULL',
'created_at' INTEGER NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE 'button_styles' (
'id' INTEGER NOT NULL  DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'style' TEXT NOT NULL  DEFAULT 'NULL',
'created_at' INTEGER NOT NULL  DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE 'payments' (
'id' INTEGER NOT NULL  DEFAULT NULL PRIMARY KEY AUTOINCREMENT,
'order_id' INTEGER NOT NULL  DEFAULT NULL REFERENCES 'orders' ('id'),
'merchant_data' NONE DEFAULT NULL,
'satoshis_received' INTEGER DEFAULT NULL,
'memo' TEXT DEFAULT NULL,
'current_timestamp' INTEGER DEFAULT CURRENT_TIMESTAMP,
'created_at' INTEGER DEFAULT CURRENT_TIMESTAMP
);


