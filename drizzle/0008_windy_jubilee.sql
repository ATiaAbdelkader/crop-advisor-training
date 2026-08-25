CREATE TABLE `competencyAssessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` varchar(128) NOT NULL,
	`payloadJson` text NOT NULL,
	`status` enum('submitted','scored','revision_requested') NOT NULL DEFAULT 'submitted',
	`scorecardJson` text,
	`supervisorUserId` int,
	`supervisorName` varchar(160),
	`feedback` text,
	`feedbackReadAt` timestamp,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `competencyAssessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `competencyAssessments` ADD CONSTRAINT `competencyAssessments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `competencyAssessments` ADD CONSTRAINT `competencyAssessments_supervisorUserId_users_id_fk` FOREIGN KEY (`supervisorUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `competency_assessment_learner_module_idx` ON `competencyAssessments` (`userId`,`moduleId`,`submittedAt`);--> statement-breakpoint
CREATE INDEX `competency_assessment_status_submitted_idx` ON `competencyAssessments` (`status`,`submittedAt`);