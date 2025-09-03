-- CreateTable
CREATE TABLE `footer_settings` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL DEFAULT 'SquareUi',
    `companyTagline` VARCHAR(191) NOT NULL DEFAULT 'The most Powerful Figma Ui Kit & Design System for designers.',
    `newsletterTitle` VARCHAR(191) NOT NULL DEFAULT 'Newsletter',
    `newsletterSubtitle` VARCHAR(191) NOT NULL DEFAULT 'Receive product updates news, exclusive discounts and early access.',
    `newsletterEnabled` BOOLEAN NOT NULL DEFAULT true,
    `socialLinks` JSON NOT NULL,
    `companyLinks` JSON NOT NULL,
    `socialsTitle` VARCHAR(191) NOT NULL DEFAULT 'Socials',
    `copyrightText` VARCHAR(191) NOT NULL DEFAULT '© 2025 Web3Comic • All rights reserved • Made with Web3Comic',
    `showBuiltWith` BOOLEAN NOT NULL DEFAULT true,
    `builtWithText` VARCHAR(191) NOT NULL DEFAULT 'Built in Framer',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
