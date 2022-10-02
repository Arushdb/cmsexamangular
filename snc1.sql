-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: snc
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `house`
--

DROP TABLE IF EXISTS `house`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `house` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mohalla` int NOT NULL,
  `houseno` varchar(10) DEFAULT NULL,
  `Colony` varchar(45) DEFAULT 'DAYALBAGH',
  `yearofconstruction` varchar(10) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `city` varchar(45) DEFAULT 'AGRA',
  `country` varchar(45) DEFAULT 'INDIA',
  `createdby` varchar(45) DEFAULT NULL,
  `modifiedby` varchar(45) DEFAULT NULL,
  `createdon` datetime DEFAULT NULL,
  `modifiedon` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `house`
--

LOCK TABLES `house` WRITE;
/*!40000 ALTER TABLE `house` DISABLE KEYS */;
INSERT INTO `house` VALUES (1,3,'67','Dayalbagh','1932','D','Agra','India','Arush',NULL,'2022-08-24 14:18:59',NULL);
/*!40000 ALTER TABLE `house` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `lft` int NOT NULL,
  `rgt` int NOT NULL,
  `route` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'root',1,1000,''),(2,'Resident',2,20,''),(3,'Enter Seva',3,4,'seva_detail'),(4,'ResidentMAster',5,6,'resident');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residenthouse`
--

DROP TABLE IF EXISTS `residenthouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residenthouse` (
  `id` int NOT NULL AUTO_INCREMENT,
  `residentid` int NOT NULL,
  `houseid` int NOT NULL,
  `date_allocated` varchar(45) DEFAULT NULL,
  `active` tinyint DEFAULT NULL,
  `createdby` varchar(45) DEFAULT NULL,
  `modifiedby` varchar(45) DEFAULT NULL,
  `createdon` datetime DEFAULT NULL,
  `modifiedon` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_RESIDENTHOUSE_HOUSEID_idx` (`houseid`),
  KEY `FK_RESIDENTHOUSE_RESIDENTID_idx` (`residentid`),
  CONSTRAINT `FK_RESIDENTHOUSE_HOUSEID` FOREIGN KEY (`houseid`) REFERENCES `house` (`id`),
  CONSTRAINT `FK_RESIDENTHOUSE_RESIDENTID` FOREIGN KEY (`residentid`) REFERENCES `residents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residenthouse`
--

LOCK TABLES `residenthouse` WRITE;
/*!40000 ALTER TABLE `residenthouse` DISABLE KEYS */;
/*!40000 ALTER TABLE `residenthouse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residents`
--

DROP TABLE IF EXISTS `residents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `residentname` varchar(45) NOT NULL,
  `fathername` varchar(45) NOT NULL,
  `mothername` varchar(45) NOT NULL,
  `gender` char(1) NOT NULL,
  `residentuid` varchar(20) DEFAULT NULL,
  `dateofbirth` date NOT NULL,
  `licensee` char(1) NOT NULL,
  `relationwithlicensee` varchar(10) DEFAULT NULL,
  `role` varchar(3) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `residentstatus` char(2) DEFAULT NULL,
  `fatherstatus` char(2) DEFAULT NULL,
  `fatheruid` varchar(20) DEFAULT NULL,
  `motherstatus` char(2) DEFAULT NULL,
  `motheruid` varchar(20) DEFAULT NULL,
  `qualification` varchar(45) DEFAULT NULL,
  `designation` varchar(45) DEFAULT NULL,
  `department` varchar(45) DEFAULT NULL,
  `maritalstatus` char(1) DEFAULT NULL,
  `spousename` varchar(45) DEFAULT NULL,
  `spousestatus` char(2) DEFAULT NULL,
  `spouseuid` varchar(20) DEFAULT NULL,
  `createdby` varchar(45) NOT NULL,
  `createdon` datetime DEFAULT NULL,
  `modifiedby` varchar(45) DEFAULT NULL,
  `modifiedon` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniqueid_UNIQUE` (`residentuid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Resident Master to store resident data';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residents`
--

LOCK TABLES `residents` WRITE;
/*!40000 ALTER TABLE `residents` DISABLE KEYS */;
INSERT INTO `residents` VALUES (1,'Arush','Jagdish Chander','Kaushalya Devi','M','AKU1992041816151','1967-08-23','Y','SELF','RES',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ARUSH','2022-08-24 14:32:44',NULL,NULL);
/*!40000 ALTER TABLE `residents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residentseva`
--

DROP TABLE IF EXISTS `residentseva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residentseva` (
  `id` int NOT NULL,
  `residentid` int NOT NULL,
  `sevaId` int NOT NULL,
  `year` int DEFAULT NULL,
  `approved` tinyint DEFAULT NULL,
  `approvedby` int DEFAULT NULL,
  `attendence` int DEFAULT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `createdby` varchar(45) DEFAULT NULL,
  `modifiedby` varchar(45) DEFAULT NULL,
  `createdon` datetime DEFAULT NULL,
  `modifiedon` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_RESIDENTSEVA_RESIDENTID_idx` (`residentid`),
  KEY `FK_RESIDENTSEVA_SEVAID_idx` (`sevaId`),
  CONSTRAINT `FK_RESIDENTSEVA_RESIDENTID` FOREIGN KEY (`residentid`) REFERENCES `residents` (`id`),
  CONSTRAINT `FK_RESIDENTSEVA_SEVAID` FOREIGN KEY (`sevaId`) REFERENCES `seva` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residentseva`
--

LOCK TABLES `residentseva` WRITE;
/*!40000 ALTER TABLE `residentseva` DISABLE KEYS */;
/*!40000 ALTER TABLE `residentseva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_menu`
--

DROP TABLE IF EXISTS `role_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_menu` (
  `role_id` int NOT NULL,
  `menu_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`menu_id`),
  KEY `FK_ROLE_MENU_MENUID_idx` (`menu_id`),
  CONSTRAINT `FK_ROLE_MENU_MENUID` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`),
  CONSTRAINT `FK_ROLE_MENU_ROLEID` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_menu`
--

LOCK TABLES `role_menu` WRITE;
/*!40000 ALTER TABLE `role_menu` DISABLE KEYS */;
INSERT INTO `role_menu` VALUES (1,2),(1,3),(1,4);
/*!40000 ALTER TABLE `role_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ROLE_RESIDENT');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seva`
--

DROP TABLE IF EXISTS `seva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seva` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(6) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `type` char(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seva`
--

LOCK TABLES `seva` WRITE;
/*!40000 ALTER TABLE `seva` DISABLE KEYS */;
INSERT INTO `seva` VALUES (2,'BG','Bhandar Ghar','');
/*!40000 ALTER TABLE `seva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `default_role` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FK_USER_ROLES_ROLEID_idx` (`role_id`),
  CONSTRAINT `FK_USER_ROLES_ROLEID` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FK_USER_ROLES_USERID` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1,1);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL DEFAULT '0',
  `password` varchar(120) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'$2a$12$DLYPRhzsb0XQ7H.uYjMiAeDFHGqLonihZb1wyrB1fdtIubb3.5Cyy','arush');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-02 11:54:54
