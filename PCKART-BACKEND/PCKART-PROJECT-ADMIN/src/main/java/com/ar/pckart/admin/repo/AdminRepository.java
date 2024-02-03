package com.ar.pckart.admin.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ar.pckart.admin.model.Admin;

import jakarta.transaction.Transactional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

	Optional<Admin> findByUsername(String username);

	@Modifying
	@Transactional
	@Query("update Admin a set a.fullname = :fullname, "
			+ "a.mobile= :mobile, a.email= :email, "
			+ "a.image = :image, "
			+ "a.imageName = :imageName, "
			+ "a.imageType = :imageType "
			+ "where a.id = :id")
	void updateAdminById(@Param("id")Long id,@Param("fullname") String fullname,
			@Param("mobile")String mobile, @Param("email")String email, 
			@Param("image") byte[] image,
			@Param("imageName")String imageName,
			@Param("imageType")String imageType);

	@Modifying
	@Transactional
	@Query("UPDATE Admin a SET "
			+ "a.enabled= :enabled, "
			+ "a.nonLocked = :nonLocked "
			+ "WHERE a.id = :id")
	void updateEnabledAndNonLockedById(@Param("id")Long id, 
			@Param("enabled")boolean enabled, @Param("nonLocked")boolean nonLocked);

	@Modifying
	@Transactional
	@Query("UPDATE Admin a SET "
			+ "a.password = :newPassword "
			+ "WHERE a.id = :id")
	void updatePassword(@Param("id")Long id, @Param("newPassword")String newPassword);
}

