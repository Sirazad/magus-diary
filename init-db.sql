-- Calendar Types
CREATE TABLE calendar_types (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    days_per_year INT NOT NULL,
    days_per_week INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendar Configuration
CREATE TABLE calendar_configuration (
    id BIGSERIAL PRIMARY KEY,
    calendar_type_code VARCHAR(50) NOT NULL,
    month_number INT NOT NULL,
    month_name VARCHAR(100) NOT NULL,
    day_start INT NOT NULL,
    day_end INT NOT NULL,
    season VARCHAR(50),
    god VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (calendar_type_code) REFERENCES calendar_types(code),
    UNIQUE(calendar_type_code, month_number)
);


-- Participants
CREATE TABLE participants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parties
CREATE TABLE parties (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Party Members
CREATE TABLE party_members (
    party_id BIGSERIAL NOT NULL,
    participant_id BIGSERIAL NOT NULL,
    PRIMARY KEY (party_id, participant_id),
    FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Participant Notable Dates
CREATE TABLE participant_notable_date (
    id BIGSERIAL PRIMARY KEY,
    participant_id BIGSERIAL NOT NULL,
    calendar_type_code VARCHAR(50) NOT NULL,
    year INT,  -- NULL if recurring
    day INT NOT NULL,
    day_end INT,
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_recurring BOOLEAN DEFAULT false,
    year_start INT,  -- when recurring starts
    year_end INT,  -- when recurring ends (NULL = forever)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (calendar_type_code) REFERENCES calendar_types(code),
    UNIQUE(participant_id, calendar_type_code, year, day)
);

-- Party Notable Dates
CREATE TABLE party_notable_date (
    id BIGSERIAL PRIMARY KEY,
    party_id BIGSERIAL NOT NULL,
    calendar_type_code VARCHAR(50) NOT NULL,
    year INT,  -- NULL if recurring
    day INT NOT NULL,
    day_end INT,  -- for multi-day events
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_recurring BOOLEAN DEFAULT false,
    year_start INT,  -- when recurring starts
    year_end INT,  -- when recurring ends (NULL = forever)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE,
    FOREIGN KEY (calendar_type_code) REFERENCES calendar_types(code),
    UNIQUE(party_id, calendar_type_code, year, day)
);

-- Indexes
CREATE INDEX idx_participant_notable ON participant_notable_date(participant_id, calendar_type_code);
CREATE INDEX idx_party_notable ON party_notable_date(party_id, calendar_type_code);
CREATE INDEX idx_calendar_config ON calendar_configuration(calendar_type_code, day_start);
-- Insert Calendar Types
INSERT INTO calendar_types (code, name, days_per_year, days_per_week) VALUES
    ('pyarr', 'Pyarronita Naptár', 620, 5),
    ('kyr', 'Kyr Naptár', 620, 5);

-- Insert Pyarr Calendar Configuration (31 months × 20 days = 620 days)
INSERT INTO calendar_configuration (calendar_type_code, month_number, month_name, day_start, day_end, season, god) VALUES
    ('pyarr', 1, 'Szándék', 1, 20, 'Hideg évszak', 'Kyel'),
    ('pyarr', 2, 'Akarat', 21, 40, 'Hideg évszak', 'Kyel'),
    ('pyarr', 3, 'Harag', 41, 60, 'Hideg évszak', 'Kyel'),
    ('pyarr', 4, 'Végítélet', 61, 80, 'Hideg évszak', 'Kyel'),
    ('pyarr', 5, 'Sikolyok', 81, 100, 'Hideg évszak', 'Darton'),
    ('pyarr', 6, 'Csend', 101, 120, 'Hideg évszak', 'Datron'),
    ('pyarr', 7, 'Kacaj', 121, 140, 'Hideg évszak', 'Darton'),
    ('pyarr', 8, 'Pengék', 141, 160, 'Hideg évszak', 'Uwel'),
    ('pyarr', 9, 'Csontok', 161, 180, 'Hideg évszak', 'Uwel'),
    ('pyarr', 10, 'Hamvak', 181, 200, 'Hideg évszak', 'Uwel'),
    ('pyarr', 11, 'Lant', 201, 220, 'Meleg évszak', 'Albourne'),
    ('pyarr', 12, 'Álmok', 221, 240, 'Meleg évszak', 'Albourne'),
    ('pyarr', 13, 'Ébredés', 241, 260, 'Meleg évszak', 'Albourne'),
    ('pyarr', 14, 'Áldozat', 261, 280, 'Meleg évszak', 'Adron'),
    ('pyarr', 15, 'Engesztelés', 281, 300, 'Meleg évszak', 'Adron'),
    ('pyarr', 16, 'Lángok', 301, 320, 'Meleg évszak', 'Adron'),
    ('pyarr', 17, 'Feloldozás', 321, 340, 'Meleg évszak', 'Adron'),
    ('pyarr', 18, 'Ifjak', 341, 360, 'Meleg évszak', 'Krad'),
    ('pyarr', 19, 'Bölcsek', 361, 380, 'Meleg évszak', 'Krad'),
    ('pyarr', 20, 'Beavatottak', 381, 400, 'Meleg évszak', 'Krad'),
    ('pyarr', 21, 'Felemelkedők', 401, 420, 'Meleg évszak', 'Krad'),
    ('pyarr', 22, 'Fogadalmak', 421, 440, 'Esős évszak', 'Dreina'),
    ('pyarr', 23, 'Esküvések', 441, 460, 'Esős évszak', 'Dreina'),
    ('pyarr', 24, 'Fohászok', 461, 480, 'Esős évszak', 'Dreina'),
    ('pyarr', 25, 'Hullámok', 481, 500, 'Esős évszak', 'Antos'),
    ('pyarr', 26, 'Áradás', 501, 520, 'Esős évszak', 'Antoh'),
    ('pyarr', 27, 'Tengercsend', 521, 540, 'Esős évszak', 'Antoh'),
    ('pyarr', 28, 'Zivatar', 541, 560, 'Esős évszak', 'Arel'),
    ('pyarr', 29, 'Kék Acél', 561, 580, 'Esős évszak', 'Arel'),
    ('pyarr', 30, 'Sólyomszárny', 581, 600, 'Esős évszak', 'Arel'),
    ('pyarr', 31, 'Holdak és vándorok', 601, 620, 'Esős évszak', 'Arel');

-- Insert Kyr Calendar Configuration (31 months × 20 days = 620 days)
INSERT INTO calendar_configuration (calendar_type_code, month_number, month_name, day_start, day_end, season, god) VALUES
    ('kyr', 1, 'Gyökerek hava', 1, 40, 'Hideg Évszak', '_'),
    ('kyr', 2, 'Skorpiók', 41, 80, 'Hideg Évszak', '_'),
    ('kyr', 3, 'Jéggyémánt', 81, 120, 'Hideg Évszak', '_'),
    ('kyr', 4, 'Fák', 121, 160, 'Langy évszak', '_'),
    ('kyr', 5, 'Rügyek', 161, 200, 'Langy évszak', '_'),
    ('kyr', 6, 'Levelek', 201, 240, 'Langy évszak', '_'),
    ('kyr', 7, 'ünnepek', 241, 245, 'ünnepek', '_'),
    ('kyr', 8, 'Bogarak', 246, 285, 'Meleg évszak', '_'),
    ('kyr', 9, 'Kígyók', 286, 325, 'Meleg évszak', '_'),
    ('kyr', 10, 'Baglyok', 326, 365, 'Meleg évszak', '_'),
    ('kyr', 11, 'ünnepek', 366, 370, 'ünnepek', '_'),
    ('kyr', 12, 'Pókok', 370, 410, 'Hűs évszak', '_'),
    ('kyr', 13, 'Árnyak', 411, 450, 'Hűs évszak', '_'),
    ('kyr', 14, 'Rákok', 451, 490, 'Hűs évszak', '_'),
    ('kyr', 15, 'ünnepek', 491, 495, 'ünnepek', '_'),
    ('kyr', 16, 'Gallyak', 496, 535, 'Nyirkos évszak', '_'),
    ('kyr', 17, 'Ködök', 536, 575, 'Nyirkos évszak', '_'),
    ('kyr', 18, 'Varjak', 576, 615, 'Nyirkos évszak', '_'),
    ('kyr', 19, 'ünnepek', 616, 620, 'ünnepek', '_');


-- Insert System Participants (Calendar Holidays)
INSERT INTO participants (name, type, description) VALUES
    ('PyarrCalendar', 'calendar', 'Pyarronita ünnepek'),
    ('KyrCalendar', 'calendar', 'Kyr ünnepek');

-- Insert Sample Holiday for Pyarr (Day 1 of Year 1)
INSERT INTO participant_notable_date (participant_id, calendar_type_code, year, day, day_end, event_name, description, is_recurring, year_start) VALUES
    (1, 'pyarr', NULL, 16, 20, 'Teremtő akarat ünnepe', 'egy hetes ünnep', TRUE, 1);
