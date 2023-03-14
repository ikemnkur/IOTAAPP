-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 11, 2023 at 05:28 PM
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
  `ip` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `password`, `email`, `role`, `activation_code`, `rememberme`, `reset`, `registered`, `last_seen`, `tfa_code`, `ip`) VALUES
(1, 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'admin@example.com', 'Admin', 'activated', '97503bd500906f54f9656c45de36a1d64773de41', '', '2022-01-11 17:30:11', '2023-03-11 09:38:49', '', ''),
(2, 'member', '6467baa3b187373e3931422e2a8ef22f3e447d77', 'member@example.com', 'Member', 'activated', 'c92ffb3280bd1a5d4801aa2e7808468b517992cb', '', '2022-01-11 23:30:11', '2023-03-11 09:50:20', '', ''),
(4, 'ikenuru', 'e885109014e7eb028c4ee03e3defedf6d684e821', 'ikenuru@gmail.com', 'Member', 'activated', '', '', '2022-05-23 03:46:14', '2022-05-23 04:00:51', '', '::1'),
(5, 'mrgenius', '27aced306f42ceebd872ccf84f345b4ad1b6c95c', 'mrgenius@gmail.com', 'Member', 'activated', '', '', '2022-05-24 21:16:25', '2022-08-11 09:01:35', '', '::1'),
(6, 'bigbrain', 'c5949f923691b76f614df9f639660f3c1c76c75a', 'bigbranez@gmail.com', 'Member', 'activated', 'e26674d0abbe05d25d172c70d0ea20585865cd5f', '', '2022-06-02 03:13:29', '2023-03-11 10:01:18', '', '::1'),
(7, 'swag2', '273cdd4447a348a193a2fe33227389667bb863ab', 'swagger2@gmail.com', 'Member', 'activated', '3482b1473ba015f676216c6632be3a0bfaff70a3', '', '2022-06-08 01:16:09', '2023-02-19 22:26:53', '', '::1'),
(8, 'pcmasterrace', '1c79ea21ec86243580d0114a518b5e26b7cd6fdd', 'pcmasterrace@hotmail.com', 'Member', 'activated', '', '', '2022-06-20 23:36:04', '2022-06-26 17:08:16', '', '::1'),
(9, 'devops', 'c2c369c9e498b1ecfb102707c472799832235dc0', 'devops@admin.com', 'Member', 'activated', '', '', '2022-06-26 19:25:00', '2022-06-26 21:18:01', '', '::1'),
(10, 'mrsMan', '9ad95f69a485659aa57eba12c18da584890fb1e7', 'mrsmale@shemail.com', 'Member', 'activated', '7345898b1afcb5dab41ebe52480e636a965eadbe', '', '2022-07-02 17:10:10', '2023-03-07 04:22:06', '', '::1'),
(11, 'person', 'd39a47507bbe27c2a7948861847f3607eda8e1be', 'person@gmail.com', 'Member', 'activated', 'abe31f9c46f21c12d14d6c61e1547cf9645ec3d6', '', '2022-08-20 17:01:39', '2023-03-08 22:04:19', '', '::1'),
(12, 'user2', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'user2@gmail.com', 'Member', 'activated', '', '', '2022-10-30 14:10:42', '2023-01-28 23:19:17', '', '::1'),
(13, 'test2', '109f4b3c50d7b0df729d299bc6f8e9ef9066971f', 'test2@gmail.com', 'Member', 'activated', '', '', '2022-11-28 00:41:17', '2022-11-28 00:41:26', '', '::1'),
(16, 'test3', '3ebfa301dc59196f18593c45e519287a23297589', 'test@gmail.com', 'Member', 'activated', '', '', '2022-11-28 00:48:17', '2022-11-28 00:48:17', '', '::1'),
(17, 'test4', '1ff2b3704aede04eecb51e50ca698efd50a1379b', 'test4@gmail.com', 'Member', 'activated', '', '', '2022-11-28 00:50:46', '2022-11-28 00:58:57', '', '::1'),
(18, 'user6', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', 'user6@gmail.com', 'Member', 'activated', '', '', '2022-12-01 23:17:15', '2022-12-02 18:42:59', '', '::1'),
(19, 'member2', 'e3070b522277c5cf015a97fb86cbaefe3df1db8f', 'member2@gmail.com', 'Member', 'activated', '', '', '2023-03-11 09:51:32', '2023-03-11 09:57:30', '', '::1');

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
  `time` int(11) NOT NULL DEFAULT 600,
  `teams` varchar(255) NOT NULL DEFAULT '[]',
  `users` text NOT NULL DEFAULT '[]',
  `private` int(1) NOT NULL DEFAULT 0,
  `watchCost` int(11) NOT NULL DEFAULT 0,
  `joinCost` int(11) NOT NULL DEFAULT 1,
  `tags` varchar(255) NOT NULL DEFAULT '[]',
  `roomCfg` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`roomID`, `host`, `passcode`, `topic`, `createDate`, `time`, `teams`, `users`, `private`, `watchCost`, `joinCost`, `tags`, `roomCfg`) VALUES
('ANDIODvIOS', 'pcmasterrace', 'PCKING', 'IOS vs Android', '2022-06-20 23:38:34', 874, '[\"IOS\", \"ANDRIOD\", \"BLACKBERRY\", \"NOKIA\"]', '[\"admin\"]', 0, 1, 3, '  [\"pc\", \"android\", \"PHONE\", \"IOS\", \"compared\"]', ''),
('bestcar2022', 'admin', 'bestcar', 'Best car of 2022', '2023-03-11 09:37:51', 600, 'ford truck, merecedes, tesla', '[\"admin\"]', 1, 1, 5, 'cars, vehicle', ''),
('britishfood1', 'swag2', 'swagger', 'britishfood', '2022-06-12 02:10:36', 7832, '[\"yummy\", \"nasty\", \"okay\"]', '[\"admin\"]', 0, 0, 2, '[\"British\", \"food\", \"taste\", \"cuisine\", \"yummy\", \"nasty\", \"biscuit\", \"chips\", \"muffins\", \"English\"]\n', ''),
('candyz', 'swag2', 'swagger', 'candy', '2023-01-16 22:10:58', 91224, 'hard, soft, taffy, sour, sweet, rock, creamy', '[]', 1, 3, 2, 'car, favorite, vechicle', ''),
('candyz12', 'swag2', '', 'candy1', '2023-01-28 22:44:44', 500245, 'vovlo, camero, mercedes, toyota', '[]', 1, 0, 0, 'car, favorite, vechicle', ''),
('cars', 'bigbrain', 'bigbrane', 'favorite car', '2022-12-09 23:32:54', 500, 'vovlo, camero, mercedes, toyota', '[\"member\"]', 1, 3, 2, 'car, favorite, vechicle', ''),
('Colored Frogs', 'admin', 'frog', 'frogs', '2022-08-12 04:53:07', 3543438, '[\"dark blue\", \"blue\", \"light blue\"]', '[]', 0, 0, 2, '[\"frogs\",\" toads\",\" color\",\" nature\"]', ''),
('dogs1', 'admin', '1234', 'dogs12', '2022-10-23 16:54:21', 427373, 'dogs, cats, birds', '[]', 1, 1, 1, 'dogs, animals, cats', ''),
('dogs122', 'admin', '123', 'dogs121', '2022-10-23 16:58:26', 78872, 'dogs, cats, birds', '[\"admin\"]', 1, 1, 1, 'dogs, animals, cats', ''),
('frogColor', 'admin', 'admin', 'frogs', '2022-08-12 04:55:41', 3873, '[\"team A\", \"team B\"]', '[\"admin\",\"swag2\"]', 0, 1, 2, '[\"frogs\",\" toads\",\" color\",\" nature\"]', ''),
('PCisKing123', 'pcmasterrace', 'PCKING', 'pc vs console', '2022-06-20 23:38:34', 837207, '[\"PC\",\"Console\",\"Switch\",\"Other\"]', '[\"mrsMan\"]', 0, 0, 1, '[\"pc\", \"mobile\", \"console\", \"switch\", \"gaming\"]', ''),
('pethaters', 'swag2', 'swagger', 'pets', '2022-06-09 17:10:30', 8378782, '[\"hater\", \"lover\",\" nochalants\"]', '[\"admin\",\"swag2\"]', 0, 2, 5, '[\"pets\", \"hate\", \"dog\", \"cat\", \"lover\"]', ''),
('roomID123', 'admin', 'pscode123', 'color ', '2022-06-08 02:41:01', 83873, '[\"red-team\", \"blue-team\"]', '[\"admin\",\"swag2\"]', 0, 0, 1, '[\"tagA\",\"tagB\",\"tagC\",\"tagD\",\"tagE\"]\n', ''),
('sfdsfb', 'admin', 'admin', 'candy', '2023-02-17 15:32:17', 600, 'vovlo, camero, mercedes, toyota', '[]', 1, 1, 5, 'a,b,d,f,i,yt', ''),
('test', 'admin', '1234', 'test', '2022-10-23 23:47:38', 453, '1,2,3', '[]', 1, 0, 1, 'abc,def,ghi', ''),
('tests', 'admin', 'admin', 'favorite cars', '2022-12-17 15:53:10', 12354, '23,acd,45y,money', '[]', 1, 2, 3, 'cash, gwap, bands', ''),
('testweew', 'admin', 'admin', 'favorite car', '2022-12-17 15:35:02', 606542, 'vovlo, camero, mercedes, toyota', 'admin', 1, 3, 9, 'car, favorite, vechicle', '');

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
(6, 'auto_login_after_register', 'true', 'Registration'),
(7, 'recaptcha', 'false', 'reCAPTCHA'),
(8, 'recaptcha_site_key', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', 'reCAPTCHA'),
(9, 'recaptcha_secret_key', '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe', 'reCAPTCHA');

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
  `followers` text NOT NULL DEFAULT '[]',
  `messages` text DEFAULT NULL,
  `profilePic` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `userstats`
--

INSERT INTO `userstats` (`id`, `username`, `role`, `registered`, `last_seen`, `coins`, `xp`, `friends`, `roomConfig`, `blockedUsers`, `followers`, `messages`, `profilePic`) VALUES
(1, 'admin', 'Admin', '2022-01-11 17:30:11', '2022-09-11 00:29:42', 83, 26, '[\"admin\",\"mrsMan\"]', '{\"topic\":\"Best car of 2022\",\"roomID\":\"bestcar2022\",\"passcode\":\"bestcar\",\"joinCost\":5,\"watchCost\":1,\"teams\":[\"ford truck\",\" merecedes\",\" tesla\"],\"tags\":[\"cars\",\" vehicle\"],\"private\":1,\"saveRmCfg\":\"on\",\"host\":\"admin\",\"randNum\":88,\"time\":600}', '[]', '[]', 'absbds', '../upload/-admin-profilePic.gif'),
(2, 'member', 'Member', '2022-01-11 23:30:11', '2022-10-02 22:15:40', 105, 13, '[\"bigbrain\"]', '[]', '[]', '[]', NULL, ''),
(4, 'ikenuru', 'Member', '2022-05-23 03:46:14', '2022-05-23 04:00:51', 100, 0, '[\"mrgenius\"]', '[]', '[]', '[]', 'asdadfsd', ''),
(5, 'mrgenius', 'Member', '2022-05-24 21:16:25', '2022-08-11 09:01:35', 100, 0, '[\"ikenuru\"]', '[]', '[]', '[]', ' ytjty jtyd', ''),
(6, 'bigbrain', 'Member', '2022-06-02 03:13:29', '2022-10-02 22:14:08', 957, 18, '[\"pcmasterrace\",\"member\"]', '{\"topic\":\"favorite car\",\"roomID\":\"cars\",\"passcode\":\"bigbrane\",\"joinCost\":\"2\",\"watchCost\":\"3\",\"teams\":[\"vovlo\",\" camero\",\" mercedes\",\" toyota\"],\"tags\":[\"car\",\" favorite\",\" vechicle\"],\"private\":1,\"saveRmCfg\":\"on\",\"host\":\"bigbrain\"}', '[]', '[]', NULL, ''),
(7, 'swag2', 'Member', '2022-06-08 01:16:09', '2022-09-22 23:07:24', 26, 35, '[\"admin\",\"mrsMan\",\"person\"]', '{\"topic\":\"candy1\",\"roomID\":\"candyz12\",\"passcode\":\"\",\"joinCost\":\"0\",\"watchCost\":\"0\",\"teams\":[\"vovlo\",\" camero\",\" mercedes\",\" toyota\"],\"tags\":[\"car\",\" favorite\",\" vechicle\"],\"private\":1,\"saveRmCfg\":\"on\",\"host\":\"swag2\",\"randNum\":57}', '[\"person\"]', '[]', '{\n                                msgId; \"123\",\n                                from: \"abc\",\n                                to: \"xyz\",\n                                when: [12:30, 11/9/2019],\n                                Text: \"hello Alphabetical leters\",\n                                data: [\"heart\", \"happy\", \"proud\"],\n                            }', '../upload/-swag2-profilePic.gif'),
(8, 'pcmasterrace', 'Member', '2022-06-20 23:36:04', '2022-06-26 17:08:16', 100, 0, '[\"person\", \"user6\"]', '[]', '[]', '[]', NULL, ''),
(9, 'devops', 'Member', '2022-06-26 19:25:00', '2022-06-26 21:18:01', 100, 0, '[\"bigbrain\", \"swag2\"]', '[]', '[]', '[]', NULL, ''),
(10, 'mrsMan', 'Member', '2022-07-02 17:10:10', '2022-09-07 17:29:24', 15, 22, '[\"person\",\"swag2\"]', '[]', '[]', '[]', NULL, ''),
(11, 'person', 'Member', '2022-08-20 17:01:39', '2022-10-02 22:11:43', 91, 26, '[\"swag2\",\"mrsMan\",\"pcmasterrace\"]', '[]', '[\"swag2\"]', '[]', 'fngn ryuk', ''),
(12, 'test4', 'Member', '2022-11-28 00:50:46', '2022-11-28 00:50:46', 100, 0, '[\"user6\"]', '[]', '[]', '[]', NULL, ''),
(13, 'user6', 'Member', '2022-12-01 23:17:15', '2022-12-01 23:17:15', 100, 10, '[\"test4\",\"pcmasterrace\"]', '[]', '[]', '[]', NULL, ''),
(14, 'member2', 'Member', '2023-03-11 09:51:32', '2023-03-11 09:51:32', 100, 10, '[]', '[]', '[]', '[]', NULL, '../upload/-member2-profilePic.gif');

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
-- Indexes for table `userstats`
--
ALTER TABLE `userstats`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

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

--
-- AUTO_INCREMENT for table `userstats`
--
ALTER TABLE `userstats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;
