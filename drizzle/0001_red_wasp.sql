CREATE TABLE `customerUploads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteId` int,
	`userId` int,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`fileName` varchar(255),
	`fileType` varchar(100),
	`fileSize` int,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customerUploads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`beforeImageUrl` text,
	`afterImageUrl` text NOT NULL,
	`cabinetType` varchar(100),
	`style` varchar(100),
	`roomType` varchar(100),
	`featured` int NOT NULL DEFAULT 0,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricingFormulas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(100) NOT NULL,
	`itemName` varchar(255) NOT NULL,
	`basePrice` varchar(50) NOT NULL,
	`unit` varchar(50),
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pricingFormulas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteId` int,
	`userId` int,
	`projectName` varchar(255) NOT NULL,
	`status` enum('design','approved','ordered','manufacturing','delivery','installation','completed') NOT NULL DEFAULT 'design',
	`estimatedStartDate` timestamp,
	`estimatedCompletionDate` timestamp,
	`actualStartDate` timestamp,
	`actualCompletionDate` timestamp,
	`finalPrice` varchar(50),
	`depositPaid` varchar(50),
	`balanceDue` varchar(50),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(20),
	`roomType` varchar(100),
	`projectDescription` text,
	`roomLength` varchar(50),
	`roomWidth` varchar(50),
	`roomHeight` varchar(50),
	`cabinetType` varchar(100),
	`cabinetStyle` varchar(100),
	`woodType` varchar(100),
	`finish` varchar(100),
	`finishColor` varchar(100),
	`hardwareStyle` varchar(100),
	`hardwareFinish` varchar(100),
	`estimatedCost` varchar(50),
	`materialsCost` varchar(50),
	`laborCost` varchar(50),
	`hardwareCost` varchar(50),
	`status` enum('draft','pending','reviewed','approved','declined','converted') NOT NULL DEFAULT 'pending',
	`crmLeadId` varchar(255),
	`sentToCrm` int NOT NULL DEFAULT 0,
	`conversationData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `customerUploads` ADD CONSTRAINT `customerUploads_quoteId_quotes_id_fk` FOREIGN KEY (`quoteId`) REFERENCES `quotes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customerUploads` ADD CONSTRAINT `customerUploads_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gallery` ADD CONSTRAINT `gallery_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_quoteId_quotes_id_fk` FOREIGN KEY (`quoteId`) REFERENCES `quotes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;