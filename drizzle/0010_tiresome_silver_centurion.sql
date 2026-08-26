CREATE TABLE `timedAssessmentSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(128) NOT NULL,
	`assessmentId` varchar(128) NOT NULL,
	`timeLimitSeconds` int NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	`submittedAt` timestamp,
	CONSTRAINT `timedAssessmentSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `timedAssessmentSessions` ADD CONSTRAINT `timedAssessmentSessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `timed_assessment_session_owner_idx` ON `timedAssessmentSessions` (`userId`,`assessmentId`,`submittedAt`,`expiresAt`);