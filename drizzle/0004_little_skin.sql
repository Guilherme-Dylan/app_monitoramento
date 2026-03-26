ALTER TABLE `visit_schedules` DROP FOREIGN KEY `visit_schedules_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `visit_schedules` DROP FOREIGN KEY `visit_schedules_requestId_search_requests_id_fk`;
--> statement-breakpoint
ALTER TABLE `visit_schedules` MODIFY COLUMN `scheduledDate` timestamp NOT NULL;