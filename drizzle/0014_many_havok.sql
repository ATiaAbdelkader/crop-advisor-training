CREATE TABLE `caseConferenceReservations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slotId` int NOT NULL,
	`userId` int NOT NULL,
	`status` enum('booked','cancelled') NOT NULL DEFAULT 'booked',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`cancelledAt` timestamp,
	CONSTRAINT `caseConferenceReservations_id` PRIMARY KEY(`id`),
	CONSTRAINT `case_conference_slot_learner_unique` UNIQUE(`slotId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `caseConferenceSlots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`facilitatorUserId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`capacity` int NOT NULL,
	`reservedCount` int NOT NULL DEFAULT 0,
	`status` enum('open','cancelled') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `caseConferenceSlots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `caseConferenceReservations` ADD CONSTRAINT `caseConferenceReservations_slotId_caseConferenceSlots_id_fk` FOREIGN KEY (`slotId`) REFERENCES `caseConferenceSlots`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `caseConferenceReservations` ADD CONSTRAINT `caseConferenceReservations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `caseConferenceSlots` ADD CONSTRAINT `caseConferenceSlots_facilitatorUserId_users_id_fk` FOREIGN KEY (`facilitatorUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `case_conference_learner_booking_idx` ON `caseConferenceReservations` (`userId`,`status`,`slotId`);--> statement-breakpoint
CREATE INDEX `case_conference_slot_open_idx` ON `caseConferenceSlots` (`status`,`startsAt`);--> statement-breakpoint
CREATE INDEX `case_conference_facilitator_idx` ON `caseConferenceSlots` (`facilitatorUserId`,`startsAt`);