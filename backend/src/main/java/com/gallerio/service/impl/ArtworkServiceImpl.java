package com.gallerio.service.impl;

import com.gallerio.Repository.ArtworkRepository;
import com.gallerio.Repository.UserRepository;
import com.gallerio.dto.ArtworkDTO;
import com.gallerio.model.Artwork;
import com.gallerio.model.User;
import com.gallerio.model.Role;
import com.gallerio.service.ArtworkService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ArtworkServiceImpl implements ArtworkService {

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public ArtworkDTO createArtwork(ArtworkDTO artworkDTO) {
        Artwork artwork = new Artwork();
        BeanUtils.copyProperties(artworkDTO, artwork, "image");
        
        User user = userRepository.findById(artworkDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify that the user is an artist
        if (user.getRole() != Role.ARTIST) {
            throw new RuntimeException("Only artists can create artworks");
        }
        
        artwork.setUser(user);

        // Set the status from the DTO
        artwork.setStatus(artworkDTO.getStatus());

        // Handle image upload
        if (artworkDTO.getImage() != null && !artworkDTO.getImage().isEmpty()) {
            try {
                // Create upload directory if it doesn't exist
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // Generate unique filename
                String filename = UUID.randomUUID().toString() + "_" + artworkDTO.getImage().getOriginalFilename();
                Path filePath = uploadPath.resolve(filename);

                // Save the file
                Files.copy(artworkDTO.getImage().getInputStream(), filePath);

                // Set the image URL in the artwork
                artwork.setImageUrl("/uploads/" + filename);
            } catch (IOException e) {
                throw new RuntimeException("Failed to store image file", e);
            }
        }
        
        Artwork savedArtwork = artworkRepository.save(artwork);
        BeanUtils.copyProperties(savedArtwork, artworkDTO);
        artworkDTO.setUserId(savedArtwork.getUser().getId());
        return artworkDTO;
    }

    @Override
    public ArtworkDTO getArtwork(Long id) {
        Artwork artwork = artworkRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Artwork not found"));
        ArtworkDTO artworkDTO = new ArtworkDTO();
        BeanUtils.copyProperties(artwork, artworkDTO);
        artworkDTO.setUserId(artwork.getUser().getId());
        return artworkDTO;
    }

    @Override
    public List<ArtworkDTO> getAllArtworks() {
        return artworkRepository.findAll().stream()
            .map(artwork -> {
                ArtworkDTO dto = new ArtworkDTO();
                BeanUtils.copyProperties(artwork, dto);
                dto.setUserId(artwork.getUser().getId());
                return dto;
            })
            .collect(Collectors.toList());
    }

    @Override
    public List<ArtworkDTO> getArtworksByUser(Long userId) {
        return artworkRepository.findByUserId(userId).stream()
            .map(artwork -> {
                ArtworkDTO dto = new ArtworkDTO();
                BeanUtils.copyProperties(artwork, dto);
                dto.setUserId(artwork.getUser().getId());
                return dto;
            })
            .collect(Collectors.toList());
    }

    @Override
    public ArtworkDTO updateArtwork(Long id, ArtworkDTO artworkDTO) {
        Artwork existingArtwork = artworkRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Artwork not found"));
        
        BeanUtils.copyProperties(artworkDTO, existingArtwork, "id", "createdAt");
        
        if (artworkDTO.getUserId() != null) {
            User user = userRepository.findById(artworkDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Verify that the user is an artist
            if (user.getRole() != Role.ARTIST) {
                throw new RuntimeException("Only artists can own artworks");
            }
            
            existingArtwork.setUser(user);
        }
        
        Artwork updatedArtwork = artworkRepository.save(existingArtwork);
        BeanUtils.copyProperties(updatedArtwork, artworkDTO);
        artworkDTO.setUserId(updatedArtwork.getUser().getId());
        return artworkDTO;
    }

    @Override
    public void deleteArtwork(Long id) {
        if (!artworkRepository.existsById(id)) {
            throw new RuntimeException("Artwork not found");
        }
        artworkRepository.deleteById(id);
    }
} 