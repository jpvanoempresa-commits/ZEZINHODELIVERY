CREATE TABLE `balances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(15,2) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `balances_id` PRIMARY KEY(`id`),
	CONSTRAINT `balances_userId_unique` UNIQUE(`userId`)
);
