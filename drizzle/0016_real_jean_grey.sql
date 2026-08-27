CREATE TABLE `learnerExerciseProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`exerciseRoute` varchar(160) NOT NULL,
	`completedPrompts` int NOT NULL DEFAULT 0,
	`totalPrompts` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learnerExerciseProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `learner_exercise_progress_owner_route_unique` UNIQUE(`userId`,`exerciseRoute`)
);
--> statement-breakpoint
ALTER TABLE `learnerExerciseProgress` ADD CONSTRAINT `learnerExerciseProgress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `learner_exercise_progress_owner_updated_idx` ON `learnerExerciseProgress` (`userId`,`updatedAt`);