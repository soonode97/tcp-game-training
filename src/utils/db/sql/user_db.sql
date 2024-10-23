CREATE TABLE IF NOT EXISTS "user" -- PostgreSQL에서는 user가 예약어이므로 ""로 묶음
(
    id         UUID PRIMARY KEY, -- PostgreSQL에서는 UUID 타입을 사용할 수 있음
    device_id  VARCHAR(255) UNIQUE NOT NULL,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_end
(
    id         UUID PRIMARY KEY, -- PostgreSQL에서는 UUID 타입을 사용할 수 있음
    user_id    UUID NOT NULL,    -- user 테이블의 id와 동일한 타입으로 설정
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score      INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES "user" (id)
);