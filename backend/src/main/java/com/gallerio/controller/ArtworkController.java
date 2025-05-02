package com.gallerio.controller;

import com.gallerio.dto.ArtworkDTO;
import com.gallerio.service.ArtworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/artworks")
@CrossOrigin(origins = "*")
public class ArtworkController {

    @Autowired
    private ArtworkService artworkService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArtworkDTO> createArtwork(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("category") String category,
            @RequestParam("status") String status,
            @RequestParam("userId") Long userId,
            @RequestParam("image") MultipartFile image) {
        
        ArtworkDTO artworkDTO = new ArtworkDTO();
        artworkDTO.setTitle(title);
        artworkDTO.setDescription(description);
        artworkDTO.setPrice(price);
        artworkDTO.setCategory(category);
        artworkDTO.setStatus(status);
        artworkDTO.setUserId(userId);
        artworkDTO.setImage(image);
        
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