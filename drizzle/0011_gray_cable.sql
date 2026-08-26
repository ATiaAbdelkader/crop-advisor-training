CREATE TABLE `assessmentTimeLimitOverrides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessmentId` varchar(128) NOT NULL,
	`timeLimitSeconds` int NOT NULL,
	`updatedByUserId` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessmentTimeLimitOverrides_id` PRIMARY KEY(`id`),
	CONSTRAINT `assessment_time_limit_assessment_unique` UNIQUE(`assessmentId`)
);
--> statement-breakpoint
ALTER TABLE `assessmentTimeLimitOverrides` ADD CONSTRAINT `assessmentTimeLimitOverrides_updatedByUserId_users_id_fk` FOREIGN KEY (`updatedByUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;