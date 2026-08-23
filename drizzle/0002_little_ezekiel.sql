CREATE TABLE `assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`moduleId` int,
	`slug` varchar(128) NOT NULL,
	`kind` enum('module','final') NOT NULL,
	`title` varchar(240) NOT NULL,
	`description` text NOT NULL,
	`passMark` int NOT NULL,
	`questionsJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`),
	CONSTRAINT `assessments_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `courseModules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`slug` varchar(128) NOT NULL,
	`title` varchar(240) NOT NULL,
	`description` text NOT NULL,
	`sortOrder` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseModules_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_module_slug_unique` UNIQUE(`courseId`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(128) NOT NULL,
	`title` varchar(240) NOT NULL,
	`description` text NOT NULL,
	`credentialName` varchar(240) NOT NULL,
	`passMark` int NOT NULL,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`slug` varchar(128) NOT NULL,
	`title` varchar(240) NOT NULL,
	`summary` text NOT NULL,
	`contentMarkdown` text NOT NULL,
	`durationMinutes` int NOT NULL,
	`sortOrder` int NOT NULL,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`),
	CONSTRAINT `module_lesson_slug_unique` UNIQUE(`moduleId`,`slug`)
);
--> statement-breakpoint
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_moduleId_courseModules_id_fk` FOREIGN KEY (`moduleId`) REFERENCES `courseModules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courseModules` ADD CONSTRAINT `courseModules_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_moduleId_courseModules_id_fk` FOREIGN KEY (`moduleId`) REFERENCES `courseModules`(`id`) ON DELETE cascade ON UPDATE no action;