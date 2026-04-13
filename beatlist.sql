CREATE DATABASE IF NOT EXISTS beatlist;
USE beatlist;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE playlists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  is_public TINYINT(1) DEFAULT 1,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tracks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  artist VARCHAR(150) NOT NULL,
  duration_seconds INT NOT NULL,
  genre VARCHAR(100),
  playlist_id INT NOT NULL,
  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE
);

-- Mot de passe : Password1! (bcrypt hash)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@beatlist.io', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('alice', 'alice@mail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

INSERT INTO playlists (title, description, is_public, user_id) VALUES
('Chill Vibes', 'Pour travailler sans stress', 1, 2),
('Pump It Up', 'Séance sport', 1, 2),
('Privée', 'Ma playlist secrète', 0, 2);

INSERT INTO tracks (title, artist, duration_seconds, genre, playlist_id) VALUES
('Sunset Lover', 'Petit Biscuit', 214, 'Electronic', 1),
('Retrograde', 'James Blake', 264, 'Indie', 1),
('Titanium', 'David Guetta', 245, 'EDM', 2),
('Alors on danse', 'Stromae', 213, 'Electronic', 2);
