package com.gallerio.service;

import com.gallerio.dto.ArtworkDTO;
import java.util.List;

public interface ArtworkService {
    ArtworkDTO createArtwork(ArtworkDTO artworkDTO);
    ArtworkDTO getArtwork(Long id);
    List<ArtworkDTO> getAllArtworks();
    List<ArtworkDTO> getArtworksByUser(Long userId);
    ArtworkDTO updateArtwork(Long id, ArtworkDTO artworkDTO);
    void deleteArtwork(Long id);
} 