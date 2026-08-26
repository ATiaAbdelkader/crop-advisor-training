CREATE TABLE `fieldInquiryPeerReflections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shareId` int NOT NULL,
	`userId` int NOT NULL,
	`payloadJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fieldInquiryPeerReflections_id` PRIMARY KEY(`id`),
	CONSTRAINT `field_inquiry_peer_reflection_owner_share_unique` UNIQUE(`userId`,`shareId`)
);
--> statement-breakpoint
ALTER TABLE `fieldInquiryPeerReflections` ADD CONSTRAINT `fieldInquiryPeerReflections_shareId_fieldInquiryPeerShares_id_fk` FOREIGN KEY (`shareId`) REFERENCES `fieldInquiryPeerShares`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fieldInquiryPeerReflections` ADD CONSTRAINT `fieldInquiryPeerReflections_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;