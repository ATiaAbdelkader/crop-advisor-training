CREATE TABLE `assessmentAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(128) NOT NULL,
	`assessmentId` varchar(128) NOT NULL,
	`score` int NOT NULL,
	`passed` enum('yes','no') NOT NULL,
	`answersJson` text NOT NULL,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessmentAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(128) NOT NULL,
	`credentialId` varchar(96) NOT NULL,
	`recipientName` varchar(240) NOT NULL,
	`finalScore` int NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_credentialId_unique` UNIQUE(`credentialId`),
	CONSTRAINT `certificate_course_user_unique` UNIQUE(`userId`,`courseSlug`)
);
--> statement-breakpoint
CREATE TABLE `courseEnrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(128) NOT NULL,
	`status` enum('active','completed') NOT NULL DEFAULT 'active',
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseEnrollments_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_enrollment_unique` UNIQUE(`userId`,`courseSlug`)
);
--> statement-breakpoint
CREATE TABLE `lessonCompletions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseSlug` varchar(128) NOT NULL,
	`lessonId` varchar(128) NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lessonCompletions_id` PRIMARY KEY(`id`),
	CONSTRAINT `lesson_completion_unique` UNIQUE(`userId`,`courseSlug`,`lessonId`)
);
--> statement-breakpoint
ALTER TABLE `assessmentAttempts` ADD CONSTRAINT `assessmentAttempts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courseEnrollments` ADD CONSTRAINT `courseEnrollments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessonCompletions` ADD CONSTRAINT `lessonCompletions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;