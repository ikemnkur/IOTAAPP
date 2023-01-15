-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 30, 2022 at 08:17 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `iotadb`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
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
  `coins` int(11) NOT NULL DEFAULT 100,
  `xp` int(11) NOT NULL DEFAULT 0,
  `friends` text NOT NULL,
  `roomConfig` mediumtext NOT NULL,
  `blockedUsers` text NOT NULL,
  `followers` text NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `password`, `email`, `role`, `activation_code`, `rememberme`, `reset`, `registered`, `last_seen`, `tfa_code`, `ip`, `coins`, `xp`, `friends`, `roomConfig`, `blockedUsers`, `followers`) VALUES
(1, 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'admin@example.com', 'Admin', 'activated', '97503bd500906f54f9656c45de36a1d64773de41', '', '2022-01-11 17:30:11', '2022-10-24 00:32:15', '', '', 85, 17, '[\"admin\",\"mrsMan\"]', '{\"topic\":\"test\",\"roomID\":\"test\",\"passcode\":\"1234\",\"joinCost\":\"1\",\"watchCost\":\"0\",\"teams\":[\"1\",\"2\",\"3\"],\"tags\":[\"abc\",\"def\",\"ghi\"],\"private\":1,\"saveRmCfg\":\"on\",\"host\":\"admin\"}', '[]', '[]'),
(2, 'member', '6467baa3b187373e3931422e2a8ef22f3e447d77', 'member@example.com', 'Member', 'activated', 'c92ffb3280bd1a5d4801aa2e7808468b517992cb', '', '2022-01-11 23:30:11', '2022-10-02 22:15:40', '', '', 101, 8, '[]', 'room: [', '[]', '[]'),
(4, 'ikenuru', 'e885109014e7eb028c4ee03e3defedf6d684e821', 'ikenuru@gmail.com', 'Member', 'activated', '', '', '2022-05-23 03:46:14', '2022-05-23 04:00:51', '', '::1', 100, 0, '[]', 'room: [', '[]', '[]'),
(5, 'mrgenius', '27aced306f42ceebd872ccf84f345b4ad1b6c95c', 'mrgenius@gmail.com', 'Member', 'activated', '', '', '2022-05-24 21:16:25', '2022-08-11 09:01:35', '', '::1', 100, 0, '[]', 'room: [', '[]', '[]'),
(6, 'bigbrain', 'c5949f923691b76f614df9f639660f3c1c76c75a', 'bigbranez@gmail.com', 'Member', 'activated', 'e26674d0abbe05d25d172c70d0ea20585865cd5f', '', '2022-06-02 03:13:29', '2022-10-24 00:53:05', '', '::1', 961, 0, '[]', 'room: [', '[]', '[]'),
(7, 'swag2', '273cdd4447a348a193a2fe33227389667bb863ab', 'swagger2@gmail.com', 'Member', 'activated', '3482b1473ba015f676216c6632be3a0bfaff70a3', '', '2022-06-08 01:16:09', '2022-09-22 23:07:24', '', '::1', 26, 35, '[\"admin\",\"mrsMan\",\"person\"]', '', '[\"person\"]', '[]'),
(8, 'pcmasterrace', '1c79ea21ec86243580d0114a518b5e26b7cd6fdd', 'pcmasterrace@hotmail.com', 'Member', 'activated', '', '', '2022-06-20 23:36:04', '2022-06-26 17:08:16', '', '::1', 100, 0, '[]', 'room: [', '[]', '[]'),
(9, 'devops', 'c2c369c9e498b1ecfb102707c472799832235dc0', 'devops@admin.com', 'Member', 'activated', '', '', '2022-06-26 19:25:00', '2022-06-26 21:18:01', '', '::1', 100, 0, '[]', 'room: [', '[]', '[]'),
(10, 'mrsMan', '9ad95f69a485659aa57eba12c18da584890fb1e7', 'mrsmale@shemail.com', 'Member', 'activated', '7345898b1afcb5dab41ebe52480e636a965eadbe', '', '2022-07-02 17:10:10', '2022-10-23 10:40:35', '', '::1', 15, 20, '[\"person\",\"swag2\"]', '', '[]', '[]'),
(11, 'person', 'd39a47507bbe27c2a7948861847f3607eda8e1be', 'person@gmail.com', 'Member', 'activated', 'abe31f9c46f21c12d14d6c61e1547cf9645ec3d6', '', '2022-08-20 17:01:39', '2022-10-02 22:11:43', '', '::1', 89, 20, '[\"swag2\",\"mrsMan\"]', '\'{\"room\": []}\'', '[\"swag2\"]', '[]'),
(12, 'user2', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'user2@gmail.com', 'Member', 'activated', '', '', '2022-10-30 14:10:42', '2022-10-30 14:16:12', '', '::1', 100, 0, '\'[]\'', '\'{\"room\": []}\'', '[]', '[]');

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
  `teams` varchar(255) NOT NULL DEFAULT '[]',
  `users` text NOT NULL,
  `private` int(1) NOT NULL DEFAULT 0,
  `watchCost` int(11) NOT NULL DEFAULT 0,
  `joinCost` int(11) NOT NULL DEFAULT 1,
  `tags` varchar(255) NOT NULL DEFAULT '[]'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`roomID`, `host`, `passcode`, `topic`, `createDate`, `teams`, `users`, `private`, `watchCost`, `joinCost`, `tags`) VALUES
('ANDIODvIOS', 'pcmasterrace', 'PCKING', 'IOS vs Android', '2022-06-20 23:38:34', '[\"IOS\", \"ANDRIOD\", \"BLACKBERRY\", \"NOKIA\"]', '[\"user2\"]', 0, 1, 3, '  [\"pc\", \"android\", \"PHONE\", \"IOS\", \"compared\"]'),
('britishfood1', 'swag2', 'swagger', 'britishfood', '2022-06-12 02:10:36', '[\"yummy\", \"nasty\", \"okay\"]', '[\"admin\",\"person\"]', 0, 0, 2, '[\"British\", \"food\", \"taste\", \"cuisine\", \"yummy\", \"nasty\", \"biscuit\", \"chips\", \"muffins\", \"English\"]\n'),
('Colored Frogs', 'admin', 'frog', 'frogs', '2022-08-12 04:53:07', '[\"dark blue\", \"blue\", \"light blue\"]', '[\"member\",\"bigbrain\"]', 0, 0, 2, '[\"frogs\",\" toads\",\" color\",\" nature\"]'),
('dogs1', 'admin', '1234', 'dogs12', '2022-10-23 16:54:21', 'dogs, cats, birds', 'admin', 1, 1, 1, 'dogs, animals, cats'),
('dogs122', 'admin', '123', 'dogs121', '2022-10-23 16:58:26', 'dogs, cats, birds', 'admin', 1, 1, 1, 'dogs, animals, cats'),
('frogColor', 'admin', 'admin', 'frogs', '2022-08-12 04:55:41', '[\"team A\", \"team B\"]', '[\"admin\",\"swag2\"]', 0, 1, 2, '[\"frogs\",\" toads\",\" color\",\" nature\"]'),
('PCisKing123', 'pcmasterrace', 'PCKING', 'pc vs console', '2022-06-20 23:38:34', '[\"PC\",\"Console\",\"Switch\",\"Other\"]', '[\"pcmasterrace\",\"admin\"]', 0, 0, 1, '[\"pc\", \"mobile\", \"console\", \"switch\", \"gaming\"]'),
('pethaters', 'swag2', 'swagger', 'pets', '2022-06-09 17:10:30', '\"hater\", \"lover\",\" nochalants\"]', '[\"admin\",\"swag2\"]', 0, 2, 5, '[\"pets\", \"hate\", \"dog\", \"cat\", \"lover\"]'),
('roomID123', 'admin', 'pscode123', 'color ', '2022-06-08 02:41:01', '[\"red-team\", \"blue-team\"]', '[\"admin\",\"swag2\"]', 0, 0, 1, '[\"tagA\",\"tagB\",\"tagC\",\"tagD\",\"tagE\"]\n'),
('test', 'admin', '1234', 'test', '2022-10-23 23:47:38', '1,2,3', 'admin', 1, 0, 1, 'abc,def,ghi');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
