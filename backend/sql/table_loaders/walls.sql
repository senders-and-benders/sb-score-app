CREATE TABLE IF NOT EXISTS walls (
  id SERIAL PRIMARY KEY,
  gym_id INTEGER NOT NULL,
  gym_area_id INTEGER NOT NULL,
  wall_name VARCHAR(255) NOT NULL,
  wall_number INTEGER NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gym_id) REFERENCES gyms (id),
  FOREIGN KEY (gym_area_id) REFERENCES gym_areas (id)
)