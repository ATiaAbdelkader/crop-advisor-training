CREATE TABLE `cropDiagnosisAnnotationReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`payloadJson` text NOT NULL,
	`status` enum('submitted','reviewed','revision_requested') NOT NULL DEFAULT 'submitted',
	`supervisorUserId` int,
	`supervisorName` varchar(160),
	`feedback` text,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cropDiagnosisAnnotationReviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `cropDiagnosisAnnotationReviews` ADD CONSTRAINT `cropDiagnosisAnnotationReviews_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cropDiagnosisAnnotationReviews` ADD CONSTRAINT `cropDiagnosisAnnotationReviews_supervisorUserId_users_id_fk` FOREIGN KEY (`supervisorUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `annotation_review_learner_submitted_idx` ON `cropDiagnosisAnnotationReviews` (`userId`,`submittedAt`);--> statement-breakpoint
CREATE INDEX `annotation_review_status_submitted_idx` ON `cropDiagnosisAnnotationReviews` (`status`,`submittedAt`);