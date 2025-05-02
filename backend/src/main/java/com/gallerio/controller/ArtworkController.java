package com.gallerio.controller;

import com.gallerio.dto.ArtworkDTO;
import com.gallerio.service.ArtworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artworks")
@CrossOrigin(origins = "*")
public class ArtworkController {

    @Autowired
    private ArtworkService artworkService;

    @PostMapping
    public ResponseEntity<ArtworkDTO> createArtwork(@RequestBody ArtworkDTO artworkDTO) {
        return ResponseEntity.ok(artworkService.createArtwork(artworkDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtworkDTO> getArtwork(@PathVariable Long id) {
        return ResponseEntity.ok(artworkService.getArtwork(id));
    }

    @GetMapping
    public ResponseEntity<List<ArtworkDTO>> getAllArtworks() {
        return ResponseEntity.ok(artworkService.getAllArtworks());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ArtworkDTO>> getArtworksByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(artworkService.getArtworksByUser(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArtworkDTO> updateArtwork(@PathVariable Long id, @RequestBody ArtworkDTO artworkDTO) {
        return ResponseEntity.ok(artworkService.updateArtwork(id, artworkDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtwork(@PathVariable Long id) {
        artworkService.deleteArtwork(id);
        return ResponseEntity.ok().build();
    }
} 