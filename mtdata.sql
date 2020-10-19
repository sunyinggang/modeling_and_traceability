-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2020-10-08 10:34:06
-- 服务器版本： 5.7.26
-- PHP 版本： 7.3.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `mtdata`
--

-- --------------------------------------------------------

--
-- 表的结构 `gq`
--

CREATE TABLE `gq` (
  `qualityParameterName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dataType` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lowerBoundValue` double DEFAULT NULL,
  `upperBoundValue` double DEFAULT NULL,
  `unit` text COLLATE utf8_unicode_ci,
  `dir` text COLLATE utf8_unicode_ci,
  `cyz` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `gq`
--

INSERT INTO `gq` (`qualityParameterName`, `dataType`, `lowerBoundValue`, `upperBoundValue`, `unit`, `dir`, `cyz`) VALUES
('产品精度误差', '离散型', 0, 0.2, '毫米', '负', '参与者1'),
('产品生产效率', '连续型', 0, 3000, '件/小时', '正', '参与者2'),
('产品废品率', '离散型', 0, 1, '无', '负', '参与者3');

-- --------------------------------------------------------

--
-- 表的结构 `gq_gq`
--

CREATE TABLE `gq_gq` (
  `id` int(11) NOT NULL,
  `qualityParameterNameRow` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `qualityParameterNameRank` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `valueQualityType` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `BValue` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `gq_gq`
--

INSERT INTO `gq_gq` (`id`, `qualityParameterNameRow`, `qualityParameterNameRank`, `valueQualityType`, `BValue`) VALUES
(1, '0', '0', '0', 5),
(2, '0', '1', '0', 5),
(3, '0', '2', '0', 5),
(4, '0', '3', '0', 5),
(5, '0', '4', '0', 5),
(6, '0', '5', '0', 5),
(7, '0', '6', '0', 5),
(8, '0', '7', '0', 5),
(9, '0', '8', '0', 5),
(10, '0', '9', '0', 5),
(11, '1', '0', '0', 5),
(12, '1', '1', '0', 5),
(13, '1', '2', '0', 5),
(14, '1', '3', '0', 5),
(15, '1', '4', '0', 5),
(16, '1', '5', '0', 5),
(17, '1', '6', '0', 5),
(18, '1', '7', '0', 5),
(19, '1', '8', '0', 5),
(20, '1', '9', '0', 5),
(21, '2', '0', '0', 5),
(22, '2', '1', '0', 5),
(23, '2', '2', '0', 5),
(24, '2', '3', '0', 5),
(25, '2', '4', '0', 5),
(26, '2', '5', '0', 5),
(27, '2', '6', '0', 5),
(28, '2', '7', '0', 5),
(29, '2', '8', '0', 5),
(30, '2', '9', '0', 5);

-- --------------------------------------------------------

--
-- 表的结构 `tmp_varinfo`
--

CREATE TABLE `tmp_varinfo` (
  `id` int(11) DEFAULT NULL,
  `qualityParameterName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `varType` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `disv` text COLLATE utf8_unicode_ci,
  `rel` text COLLATE utf8_unicode_ci,
  `dir` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `tmp_varinfo`
--

INSERT INTO `tmp_varinfo` (`id`, `qualityParameterName`, `varType`, `disv`, `rel`, `dir`) VALUES
(1, '物料可加工性等级', 'x', '47.63655', '12 11 13', NULL),
(2, '物料尺寸偏差', 'x', '1628.0', '12 13', NULL),
(3, '加工机械保养状况等级', 'x', '5.0', '12 13', NULL),
(4, '加工机械故障率', 'x', '1.6815228', '11 12', NULL),
(5, '车间清洁度等级', 'x', '30.061901', '12 11 13', NULL),
(6, '车间温度偏差', 'x', '5.4968476', '11 13', NULL),
(7, '设备主轴转速偏差', 'x', '2.6347732', '11 12', NULL),
(8, '设备进给速度偏差', 'x', '2.9951465e-05', '11 12', NULL),
(9, '操作人员技术熟练等级', 'x', '2.0479581e-05', '12 11 13', NULL),
(10, '操作人员反馈最小时间', 'x', '3.340539e-05', '12 11 13', NULL),
(11, '产品精度误差', 'y', '0.1', NULL, '负'),
(12, '产品生产效率', 'y', '1500', NULL, '正'),
(13, '产品废品率', 'y', '0.5', NULL, '负');

-- --------------------------------------------------------

--
-- 表的结构 `value`
--

CREATE TABLE `value` (
  `qualityParameterName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `operator` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `evalue` double DEFAULT NULL,
  `unit` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `rating` text COLLATE utf8_unicode_ci,
  `cyz` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `value`
--

INSERT INTO `value` (`qualityParameterName`, `operator`, `evalue`, `unit`, `rating`, `cyz`) VALUES
('物料可加工性等级', '正', 5, '级', '0.167', '参与者1'),
('物料尺寸偏差', '负', 0.1, '毫米', '0.167', '参与者2'),
('加工机械保养状况等级', '正', 6, '级', '0.167', '参与者3'),
('加工机械故障率', '负', 0.1, '无', '0.167', '参与者4'),
('车间清洁度等级', '正', 7, '级', '0.167', '参与者5'),
('车间温度偏差', '负', 2, '℃', '0.167', '参与者6'),
('设备主轴转速偏差', '负', 250, 'RPM', '0.167', '参与者7'),
('设备进给速度偏差', '负', 10, '分钟', '0.167', '参与者8'),
('操作人员技术熟练等级', '正', 4, '级', '0.167', '参与者9'),
('操作人员反馈最小时间', '负', 60, '分钟', '0.167', '参与者10');

-- --------------------------------------------------------

--
-- 表的结构 `varinfo`
--

CREATE TABLE `varinfo` (
  `id` int(11) DEFAULT NULL,
  `qualityParameterName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `varType` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `varinfo`
--

INSERT INTO `varinfo` (`id`, `qualityParameterName`, `varType`) VALUES
(1, '物料可加工性等级', 'x'),
(2, '物料尺寸偏差', 'x'),
(3, '加工机械保养状况等级', 'x'),
(4, '加工机械故障率', 'x'),
(5, '车间清洁度等级', 'x'),
(6, '车间温度偏差', 'x'),
(7, '设备主轴转速偏差', 'x'),
(8, '设备进给速度偏差', 'x'),
(9, '操作人员技术熟练等级', 'x'),
(10, '操作人员反馈最小时间', 'x'),
(11, '产品精度误差', 'y'),
(12, '产品生产效率', 'y'),
(13, '产品废品率', 'y');

-- --------------------------------------------------------

--
-- 表的结构 `v_gq`
--

CREATE TABLE `v_gq` (
  `id` int(11) NOT NULL,
  `qualityParameterNameRow` text COLLATE utf8_unicode_ci,
  `qualityParameterNameRank` text COLLATE utf8_unicode_ci,
  `valueQualityType` text COLLATE utf8_unicode_ci,
  `BValue` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `v_gq`
--

INSERT INTO `v_gq` (`id`, `qualityParameterNameRow`, `qualityParameterNameRank`, `valueQualityType`, `BValue`) VALUES
(1, '0', '0', '5', 5),
(2, '0', '1', '5', 5),
(3, '0', '2', '5', 5),
(4, '1', '0', '0', 5),
(5, '1', '1', '6', 5),
(6, '1', '2', '5', 5),
(7, '2', '0', '0', 5),
(8, '2', '1', '5', 5),
(9, '2', '2', '6', 5),
(10, '3', '0', '6', 5),
(11, '3', '1', '5', 5),
(12, '3', '2', '0', 5),
(13, '4', '0', '5', 5),
(14, '4', '1', '6', 5),
(15, '4', '2', '5', 5),
(16, '5', '0', '5', 5),
(17, '5', '1', '0', 5),
(18, '5', '2', '5', 5),
(19, '6', '0', '5', 5),
(20, '6', '1', '5', 5),
(21, '6', '2', '0', 5),
(22, '7', '0', '6', 5),
(23, '7', '1', '5', 5),
(24, '7', '2', '0', 5),
(25, '8', '0', '6', 5),
(26, '8', '1', '6', 5),
(27, '8', '2', '6', 5),
(28, '9', '0', '6', 5),
(29, '9', '1', '6', 5),
(30, '9', '2', '6', 5);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
