CREATE TABLE `fieldRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`templateId` varchar(96) NOT NULL,
	`title` varchar(160) NOT NULL,
	`payloadJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fieldRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `fieldRecords` ADD CONSTRAINT `fieldRecords_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `field_record_owner_template_updated_idx` ON `fieldRecords` (`userId`,`templateId`,`updatedAt`);