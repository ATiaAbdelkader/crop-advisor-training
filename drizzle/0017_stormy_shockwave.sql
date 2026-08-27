CREATE TABLE `learnerExerciseSummaryShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerUserId` int NOT NULL,
	`exerciseRoute` varchar(160) NOT NULL,
	`sharedAt` timestamp NOT NULL DEFAULT (now()),
	`revokedAt` timestamp,
	CONSTRAINT `learnerExerciseSummaryShares_id` PRIMARY KEY(`id`),
	CONSTRAINT `learner_exercise_summary_share_owner_route_unique` UNIQUE(`ownerUserId`,`exerciseRoute`)
);
--> statement-breakpoint
ALTER TABLE `learnerExerciseSummaryShares` ADD CONSTRAINT `learnerExerciseSummaryShares_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `learner_exercise_summary_share_active_idx` ON `learnerExerciseSummaryShares` (`revokedAt`,`sharedAt`);--> statement-breakpoint
CREATE INDEX `learner_exercise_summary_share_owner_idx` ON `learnerExerciseSummaryShares` (`ownerUserId`,`revokedAt`);