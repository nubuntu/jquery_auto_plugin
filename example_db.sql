-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Oct 04, 2015 at 12:12 AM
-- Server version: 5.6.24-72.2
-- PHP Version: 5.5.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `example_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_siswa`
--

CREATE TABLE IF NOT EXISTS `tbl_siswa` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `kota` varchar(100) NOT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `tanggal_daftar` date DEFAULT NULL,
  `status` enum('AKTIF','NON AKTIF') DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_siswa`
--

INSERT INTO `tbl_siswa` (`id`, `nama`, `kota`, `tanggal_lahir`, `tanggal_daftar`, `status`) VALUES
(1, 'Noer', 'Jakarta', '2015-10-03', '2015-10-16', 'AKTIF'),
(2, 'Kendo', 'Jakarta', '2015-10-22', '2015-10-21', 'AKTIF'),
(3, 'Vibi', 'Bekasi', '2015-10-07', '2015-10-29', 'AKTIF'),
(4, 'Budi', 'Bekasi', '2015-10-21', '2015-10-15', 'NON AKTIF'),
(5, 'Alfi', 'Bekasi', '2015-10-08', '2015-10-08', 'AKTIF'),
(6, 'Cinta', 'Jakarta', '2015-10-20', '2015-10-06', 'NON AKTIF'),
(7, 'Dani', 'Bekasi', '2015-10-28', '2015-10-28', 'AKTIF'),
(8, 'Erna', 'Jakarta', '2015-10-08', '2015-10-13', 'NON AKTIF'),
(9, 'Ferry', 'Depok', '2015-10-14', '2015-10-08', 'AKTIF'),
(10, 'Gilang', 'Depok', '2015-10-16', '2015-10-21', 'AKTIF'),
(11, 'Hani', 'Depok', '2015-10-13', '2015-10-20', 'AKTIF');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_students`
--

CREATE TABLE IF NOT EXISTS `tbl_students` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `register_date` date DEFAULT NULL,
  `status` enum('ACTIVE','PASSIVE') DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_students`
--

INSERT INTO `tbl_students` (`id`, `name`, `city`, `date_of_birth`, `register_date`, `status`) VALUES
(1, 'Noer', 'Jakarta', '2015-10-03', '2015-10-16', ''),
(2, 'Kendo', 'Jakarta', '2015-10-22', '2015-10-21', ''),
(3, 'Vibi', 'Bekasi', '2015-10-07', '2015-10-29', ''),
(4, 'Budi', 'Bekasi', '2015-10-21', '2015-10-15', ''),
(5, 'Alfi', 'Bekasi', '2015-10-08', '2015-10-08', ''),
(6, 'Cinta', 'Jakarta', '2015-10-20', '2015-10-06', ''),
(7, 'Dani', 'Bekasi', '2015-10-28', '2015-10-28', ''),
(8, 'Erna', 'Jakarta', '2015-10-08', '2015-10-13', ''),
(9, 'Ferry', 'Depok', '2015-10-14', '2015-10-08', ''),
(10, 'Gilang', 'Depok', '2015-10-16', '2015-10-21', ''),
(11, 'Hani', 'Depok', '2015-10-13', '2015-10-20', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_siswa`
--
ALTER TABLE `tbl_siswa`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_students`
--
ALTER TABLE `tbl_students`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_siswa`
--
ALTER TABLE `tbl_siswa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `tbl_students`
--
ALTER TABLE `tbl_students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
