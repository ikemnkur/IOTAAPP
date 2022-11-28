-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 06, 2022 at 05:56 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `nodelogin`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('Member','Admin') NOT NULL DEFAULT 'Member',
  `activation_code` varchar(255) NOT NULL DEFAULT '',
  `rememberme` varchar(255) NOT NULL DEFAULT '',
  `reset` varchar(255) NOT NULL DEFAULT '',
  `registered` datetime NOT NULL DEFAULT current_timestamp(),
  `last_seen` datetime NOT NULL DEFAULT current_timestamp(),
  `tfa_code` varchar(255) NOT NULL DEFAULT '',
  `ip` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

INSERT INTO `accounts` (`id`, `username`, `password`, `email`, `role`, `activation_code`, `rememberme`, `reset`, `registered`, `last_seen`, `tfa_code`, `ip`) VALUES
(1, 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'admin@example.com', 'Admin', 'activated', '', '', '2022-01-11 17:30:11', '2022-02-01 19:10:30', '', ''),
(2, 'member', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'member@example.com', 'Member', 'activated', '', '', '2022-01-11 17:30:11', '2022-01-12 19:47:11', '', '');

-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2022 at 07:52 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `nodelogin`
--

-- --------------------------------------------------------

--
-- Table structure for table `userstats`
--

CREATE TABLE `userstats` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `role` enum('Member','Admin') NOT NULL DEFAULT 'Member',
  `registered` datetime NOT NULL DEFAULT current_timestamp(),
  `last_seen` datetime NOT NULL DEFAULT current_timestamp(),
  `coins` int(11) NOT NULL DEFAULT 100,
  `xp` int(11) NOT NULL DEFAULT 0,
  `friends` text NOT NULL DEFAULT '[]',
  `roomConfig` text NOT NULL DEFAULT '[]',
  `blockedUsers` text NOT NULL DEFAULT '[]',
  `followers` text NOT NULL DEFAULT '[]'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `userstats`
--

INSERT INTO `userstats` (`id`, `username`, `role`, `registered`, `last_seen`, `coins`, `xp`, `friends`, `roomConfig`, `blockedUsers`, `followers`) VALUES
(1, 'admin', 'Admin', '2022-01-11 17:30:11', '2022-09-11 00:29:42', 85, 17, '[\"admin\",\"mrsMan\"]', '', '[]', '[]'),
(2, 'member', 'Member', '2022-01-11 23:30:11', '2022-10-02 22:15:40', 101, 8, '[]', 'room: [', '[]', '[]'),
(4, 'ikenuru', 'Member', '2022-05-23 03:46:14', '2022-05-23 04:00:51', 100, 0, '[]', 'room: [', '[]', '[]'),
(5, 'mrgenius', 'Member', '2022-05-24 21:16:25', '2022-08-11 09:01:35', 100, 0, '[]', 'room: [', '[]', '[]'),
(6, 'bigbrain', 'Member', '2022-06-02 03:13:29', '2022-10-02 22:14:08', 961, 0, '[]', 'room: [', '[]', '[]'),
(7, 'swag2', 'Member', '2022-06-08 01:16:09', '2022-09-22 23:07:24', 26, 35, '[\"admin\",\"mrsMan\",\"person\"]', '', '[\"person\"]', '[]'),
(8, 'pcmasterrace', 'Member', '2022-06-20 23:36:04', '2022-06-26 17:08:16', 100, 0, '[]', 'room: [', '[]', '[]'),
(9, 'devops', 'Member', '2022-06-26 19:25:00', '2022-06-26 21:18:01', 100, 0, '[]', 'room: [', '[]', '[]'),
(10, 'mrsMan', 'Member', '2022-07-02 17:10:10', '2022-09-07 17:29:24', 15, 20, '[\"person\",\"swag2\"]', '', '[]', '[]'),
(11, 'person', 'Member', '2022-08-20 17:01:39', '2022-10-02 22:11:43', 89, 20, '[\"swag2\",\"mrsMan\"]', '\'{\"room\": []}\'', '[\"swag2\"]', '[]'),
(12, 'test4', 'Member', '2022-11-28 00:50:46', '2022-11-28 00:50:46', 100, 0, '[]', '[]', '[]', '[]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `userstats`
--
ALTER TABLE `userstats`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `userstats`
--
ALTER TABLE `userstats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

--
-- Dumping data for table `accounts`
--

-- INSERT INTO `accounts` (`id`, `username`, `role`,`registered`, `last_seen`, `tfa_code`, `ip`, `coins`, `xp`, `friends`, `roomConfig`, `blockedUsers`, `followers`) VALUES
-- (1, 'admin', 'Admin', '', '2022-01-11 17:30:11', '2022-09-11 00:29:42', '', '', 85, 17, '[\"admin\",\"mrsMan\"]', '', '[]', '[]'),
-- (2, 'member',  'Member', '', '2022-01-11 23:30:11', '2022-10-02 22:15:40', '', '', 101, 8, '[]', 'room: [', '[]', '[]'),
-- (4, 'ikenuru', 'Member',  '2022-05-23 04:00:51', '', '::1', 100, 0, '[]', 'room: [', '[]', '[]'),
-- (5, 'mrgenius', 'Member',  '2022-08-11 09:01:35', '', '::1', 100, 0, '[]', 'room: [', '[]', '[]'),
-- (6, 'bigbrain', 'Member', '', '2022-06-02 03:13:29', '2022-10-02 22:14:08', '', '::1', 961, 0, '[]', 'room: [', '[]', '[]'),
-- (7, 'swag2', 'Member',  '', '2022-06-08 01:16:09', '2022-09-22 23:07:24', '', '::1', 26, 35, '[\"admin\",\"mrsMan\",\"person\"]', '', '[\"person\"]', '[]'),
-- (8, 'pcmasterrace', 'Member',  '2022-06-26 17:08:16', '', '::1', 100, 0, '[]', 'room: [', '[]', '[]'),
-- (9, 'devops','Member', 'activated', '2022-06-26 19:25:00', '2022-06-26 21:18:01', '', '::1', 100, 0, '[]', 'room: [', '[]', '[]'),
-- (10, 'mrsMan',  'Member', '2022-07-02 17:10:10', '2022-09-07 17:29:24', '', '::1', 15, 20, '[\"person\",\"swag2\"]', '', '[]', '[]'),
-- (11, 'person',  'Member', '2022-08-20 17:01:39', '2022-10-02 22:11:43', '', '::1', 89, 20, '[\"swag2\",\"mrsMan\"]', '\'{\"room\": []}\'', '[\"swag2\"]', '[]');

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` int(11) NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `attempts_left` tinyint(1) NOT NULL DEFAULT 5,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `roomID` varchar(25) NOT NULL,
  `host` varchar(50) NOT NULL,
  `passcode` varchar(16) NOT NULL,
  `topic` varchar(100) NOT NULL,
  `createDate` datetime NOT NULL DEFAULT current_timestamp(),
  `teams` varchar(255) NOT NULL,
  `users` text NOT NULL,
  `private` int(1) NOT NULL DEFAULT 0,
  `watchCost` int(11) NOT NULL,
  `joinCost` int(11) NOT NULL,
  `tags` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`roomID`, `host`, `passcode`, `topic`, `createDate`, `teams`, `users`, `private`, `watchCost`, `joinCost`, `tags`) VALUES
('ANDIODvIOS', 'pcmasterrace', 'PCKING', 'IOS vs Android', '2022-06-20 23:38:34', '[\"IOS\", \"ANDRIOD\", \"BLACKBERRY\", \"NOKIA\"]', '[\"person\",\"member\"]', 0, 1, 3, '  [\"pc\", \"android\", \"PHONE\", \"IOS\", \"compared\"]'),
('britishfood1', 'swag2', 'swagger', 'britishfood', '2022-06-12 02:10:36', '[\"yummy\", \"nasty\", \"okay\"]', '[\"admin\",\"person\"]', 0, 0, 2, '[\"British\", \"food\", \"taste\", \"cuisine\", \"yummy\", \"nasty\", \"biscuit\", \"chips\", \"muffins\", \"English\"]\n'),
('Colored Frogs', 'admin', 'frog', 'frogs', '2022-08-12 04:53:07', '[\"dark blue\", \"blue\", \"light blue\"]', '[\"member\",\"bigbrain\"]', 0, 0, 2, '[\"frogs\",\" toads\",\" color\",\" nature\"]'),
('frogColor', 'admin', 'admin', 'frogs', '2022-08-12 04:55:41', '[\"team A\", \"team B\"]', '[\"admin\",\"swag2\"]', 0, 1, 2, '[\"frogs\",\" toads\",\" color\",\" nature\"]'),
('PCisKing123', 'pcmasterrace', 'PCKING', 'pc vs console', '2022-06-20 23:38:34', '[\"PC\",\"Console\",\"Switch\",\"Other\"]', '[\"pcmasterrace\",\"admin\"]', 0, 0, 1, '[\"pc\", \"mobile\", \"console\", \"switch\", \"gaming\"]'),
('pethaters', 'swag2', 'swagger', 'pets', '2022-06-09 17:10:30', '\"hater\", \"lover\",\" nochalants\"]', '[\"admin\",\"swag2\"]', 0, 2, 5, '[\"pets\", \"hate\", \"dog\", \"cat\", \"lover\"]'),
('roomID123', 'admin', 'pscode123', 'color ', '2022-06-08 02:41:01', '[\"red-team\", \"blue-team\"]', '[\"admin\",\"swag2\"]', 0, 0, 1, '[\"tagA\",\"tagB\",\"tagC\",\"tagD\",\"tagE\"]\n');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(50) NOT NULL,
  `setting_value` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'General'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `category`) VALUES
(1, 'account_activation', 'false', 'General'),
(2, 'mail_from', 'Your Company Name <noreply@yourdomain.com>', 'General'),
(3, 'csrf_protection', 'false', 'Add-ons'),
(4, 'brute_force_protection', 'false', 'Add-ons'),
(5, 'twofactor_protection', 'false', 'Add-ons'),
(6, 'auto_login_after_register', 'false', 'Registration'),
(7, 'recaptcha', 'false', 'reCAPTCHA'),
(8, 'recaptcha_site_key', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', 'reCAPTCHA'),
(9, 'recaptcha_secret_key', '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe', 'reCAPTCHA');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ip_address` (`ip_address`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`roomID`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;


CREATE USER 'IOTAAPP'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'Ibn1031457!*';
GRANT ALL PRIVILEGES ON *.* TO 'IOTA'@'localhost' WITH GRANT OPTION
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'IOTAAPP'@'localhost' WITH GRANT OPTION;

GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'iotaRemote'@'34.136.59.230' WITH GRANT OPTION;