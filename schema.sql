DROP TABLE IF EXISTS lap;
DROP TABLE IF EXISTS race;
DROP TABLE IF EXISTS racer;
DROP TABLE IF EXISTS tournament;
DROP TABLE IF EXISTS tournament_racer;
DROP TABLE IF EXISTS bracket;
DROP TABLE IF EXISTS racer;
DROP TABLE IF EXISTS pool;
DROP TABLE IF EXISTS pool_racer;

DROP TYPE IF EXISTS racer_status;
DROP TYPE IF EXISTS lane_name;
DROP TYPE IF EXISTS tournament_status;

CREATE TYPE racer_status AS ENUM('active', 'disqualified', 'withdrawn');
CREATE TYPE lane_name AS ENUM('left', 'right');
CREATE TYPE tournament_status AS ENUM('enrolling', 'qualifying', 'direct-elimination');

CREATE TABLE racer (
    racer_id SERIAL PRIMARY KEY,
    racer_name VARCHAR(256) NOT NULL,
    car_name VARCHAR(256) NOT NULL,
    status racer_status DEFAULT 'active',
    img BYTEA DEFAULT NULL
);

CREATE TABLE lap (
    lap_id SERIAL PRIMARY KEY,
    racer_id INT NOT NULL,
    lane lane_name NOT NULL,
    elapsed_time DECIMAL
);

CREATE TABLE race (
    race_id SERIAL PRIMARY KEY,
    tournament_id INT NOT NULL,
    lap1_id INT NOT NULL,
    lap2_id INT NOT NULL,
    start_timestamp TIMESTAMP
);

CREATE TABLE tournament (
    tournament_id SERIAL PRIMARY KEY,
    status tournament_status DEFAULT 'enrolling'
);

CREATE TABLE tournament_racer (
    tournament_id INT NOT NULL,
    racer_id INT NOT NULL,
    qualifying_lap_id INT,
    seed INT,
    entry_timestamp TIMESTAMP,

    PRIMARY KEY (tournament_id, racer_id)
);

CREATE TABLE bracket (
    bracket_id SERIAL PRIMARY KEY,
    tournament_id INT NOT NULL,
    round INT NOT NULL,
    race_id INT,
    winners_bracker_id INT
);

CREATE TABLE pool (
    pool_id SERIAL PRIMARY KEY,
    tournament_id INT NOT NULL
);

CREATE TABLE pool_racer (
    pool_id INT NOT NULL,
    racer_id INT NOT NULL
);