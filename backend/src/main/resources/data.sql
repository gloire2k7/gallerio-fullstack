-- Database initialization script for Gallerio
-- This script creates default users for testing purposes

-- Insert default admin user
INSERT INTO _user (id, first_name, last_name, email, password, role, location, bio, profile_photo, enabled) VALUES 
(1, 'Admin', 'User', 'admin@gallerio.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'Kigali, Rwanda', 'System Administrator', null, true)
ON CONFLICT (email) DO NOTHING;

-- Insert default artist user
INSERT INTO _user (id, first_name, last_name, email, password, role, location, bio, profile_photo, enabled) VALUES 
(2, 'Jean', 'Mukamana', 'artist@gallerio.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ARTIST', 'Kigali, Rwanda', 'Contemporary Rwandan Artist specializing in traditional and modern art forms', null, true)
ON CONFLICT (email) DO NOTHING;

-- Insert default collector user
INSERT INTO _user (id, first_name, last_name, email,  password, role, location, bio, profile_photo, enabled) VALUES 
(3, 'Marie', 'Uwimana', 'collector@gallerio.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'COLLECTOR', 'Kigali, Rwanda', 'Art collector and enthusiast passionate about Rwandan contemporary art', null, true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample artwork (optional)
INSERT INTO artworks (id, title, description, price, image_url, user_id, status, category, created_at, updated_at) VALUES 
(1, 'Traditional Rwandan Dance', 'A vibrant painting depicting traditional Rwandan dance ceremonies', 250.00, 'sample-artwork-1.jpg', 2, 'AVAILABLE', 'PAINTING', NOW(), NOW()),
(2, 'Kigali Skyline', 'Modern interpretation of Kigali cityscape at sunset', 180.00, 'sample-artwork-2.jpg', 2, 'AVAILABLE', 'PAINTING', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
