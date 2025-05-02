package com.gallerio.Repository;

import com.gallerio.model.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    List<Artwork> findByUserId(Long userId);
    List<Artwork> findByCategory(String category);
} 