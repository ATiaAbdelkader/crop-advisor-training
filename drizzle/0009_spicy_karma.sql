ALTER TABLE `competencyAssessments` ADD COLUMN `revisionOfAssessmentId` int;--> statement-breakpoint
ALTER TABLE `competencyAssessments` ADD CONSTRAINT `competency_assessment_learner_revision_unique` UNIQUE(`userId`,`revisionOfAssessmentId`);--> statement-breakpoint
ALTER TABLE `competencyAssessments` ADD CONSTRAINT `competency_assessment_revision_fk` FOREIGN KEY (`revisionOfAssessmentId`) REFERENCES `competencyAssessments`(`id`) ON DELETE set null ON UPDATE no action;
