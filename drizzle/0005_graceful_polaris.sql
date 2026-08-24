CREATE TABLE `capstoneSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`capstoneId` varchar(128) NOT NULL,
	`payloadJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `capstoneSubmissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `capstone_submission_owner_case_unique` UNIQUE(`userId`,`capstoneId`)
);
--> statement-breakpoint
CREATE TABLE `fieldPracticumEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`payloadJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fieldPracticumEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `capstoneSubmissions` ADD CONSTRAINT `capstoneSubmissions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fieldPracticumEntries` ADD CONSTRAINT `fieldPracticumEntries_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `field_practicum_owner_updated_idx` ON `fieldPracticumEntries` (`userId`,`updatedAt`);