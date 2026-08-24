CREATE TABLE `fieldRecordReviewShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordId` int NOT NULL,
	`ownerUserId` int NOT NULL,
	`shareToken` varchar(64) NOT NULL,
	`reviewerName` varchar(160),
	`reviewComment` text,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`revokedAt` timestamp,
	CONSTRAINT `fieldRecordReviewShares_id` PRIMARY KEY(`id`),
	CONSTRAINT `fieldRecordReviewShares_shareToken_unique` UNIQUE(`shareToken`)
);
--> statement-breakpoint
CREATE TABLE `learnerReflections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`focus` varchar(96) NOT NULL,
	`reflection` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learnerReflections_id` PRIMARY KEY(`id`),
	CONSTRAINT `learner_reflection_owner_focus_unique` UNIQUE(`userId`,`focus`)
);
--> statement-breakpoint
CREATE TABLE `scenarioAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` varchar(128) NOT NULL,
	`scenarioId` varchar(128) NOT NULL,
	`score` int NOT NULL,
	`passed` enum('yes','no') NOT NULL,
	`answersJson` text NOT NULL,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scenarioAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `fieldRecordReviewShares` ADD CONSTRAINT `fieldRecordReviewShares_recordId_fieldRecords_id_fk` FOREIGN KEY (`recordId`) REFERENCES `fieldRecords`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fieldRecordReviewShares` ADD CONSTRAINT `fieldRecordReviewShares_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learnerReflections` ADD CONSTRAINT `learnerReflections_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scenarioAttempts` ADD CONSTRAINT `scenarioAttempts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `field_record_share_owner_record_idx` ON `fieldRecordReviewShares` (`ownerUserId`,`recordId`,`revokedAt`);--> statement-breakpoint
CREATE INDEX `scenario_attempt_owner_scenario_idx` ON `scenarioAttempts` (`userId`,`scenarioId`,`submittedAt`);