CREATE TABLE `fieldInquiryDecisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` varchar(128) NOT NULL,
	`payloadJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fieldInquiryDecisions_id` PRIMARY KEY(`id`),
	CONSTRAINT `field_inquiry_decision_owner_module_unique` UNIQUE(`userId`,`moduleId`)
);
--> statement-breakpoint
CREATE TABLE `fieldInquiryPeerShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`decisionId` int NOT NULL,
	`ownerUserId` int NOT NULL,
	`shareToken` varchar(64) NOT NULL,
	`pairLabel` varchar(80),
	`reviewerUserId` int,
	`reviewerName` varchar(160),
	`feedbackJson` text,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`revokedAt` timestamp,
	CONSTRAINT `fieldInquiryPeerShares_id` PRIMARY KEY(`id`),
	CONSTRAINT `fieldInquiryPeerShares_shareToken_unique` UNIQUE(`shareToken`)
);
--> statement-breakpoint
ALTER TABLE `fieldInquiryDecisions` ADD CONSTRAINT `fieldInquiryDecisions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fieldInquiryPeerShares` ADD CONSTRAINT `fieldInquiryPeerShares_decisionId_fieldInquiryDecisions_id_fk` FOREIGN KEY (`decisionId`) REFERENCES `fieldInquiryDecisions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fieldInquiryPeerShares` ADD CONSTRAINT `fieldInquiryPeerShares_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fieldInquiryPeerShares` ADD CONSTRAINT `fieldInquiryPeerShares_reviewerUserId_users_id_fk` FOREIGN KEY (`reviewerUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `field_inquiry_peer_share_owner_decision_idx` ON `fieldInquiryPeerShares` (`ownerUserId`,`decisionId`,`revokedAt`);