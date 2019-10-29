# HawKoin-Ionic
HawKoin is a Mobile application that uses blockchain technology to make life easier for students and faculty at Lehigh University. It is intended for students to ditch their IDs in exchange for a simple mobile application on their smartphone. This replaces purchases made previously through GoldPlus and offers an altenative point of purchase for vendors. Vendors who are registered through Lehigh University will be able to perform transactions with Lehigh Students.

# Tech Stack

### Hyperledger Fabric
Distibuted ledger for developing business logic and deploying it into the blockchain.

### Google OAuth
Protocol for authentication and authorization throughout the HawKoin App. Allows for users to login with their @lehigh.edu addresses and helps generate dynamic QR code.

### Mocha/Chai
A JavaScript testing framework that allows functions to be tested throughout changes made to HawKoin. Runs accurate reporting to pinpoint issues and limit debugging time.


### Google AppEngine
Develop scalable backend that adds support for a variety of programming languages and tools.

### Ionic 
Allows for cross-platform App Development such that it would be available on browser, apple, and android devices. Also includes Ionic Studio, an IDE that allows for development and deployment of front-end interface. It also runs emulators in the IDE that make for easier development.


# Users
Users are currently manually given priveleges upon registration, and can occupy 1 of 3 roles: Spender, Vendor, and Admin. Each role has a unique function that manifests itself within the interface upon login. 


## Spender
This can be any student, faculty, or anyone registered under a  Lehigh approved email. Any of these users must be purchasing from a Vendor that supports the HawKoin interface. Those who have access to the Application will be able to make purchases by having a unique QR Code scanned by a Lehigh approved Vendor. 

### How to use

1. Make a purchase with a Vendor that is using the  HawKoin application
2. If signed in, click “Show QR to open QR Code
3. The Vendor should scan the QR Code
4. A window asking for confirmation will show. Press “Confirm” to confirm the transaction
5. Transaction is now confirmed and balance is updated

Note: "Show Balance" Button allows to show your current funds instantly

### Screens

Login Page: This is universal for all users. One will sign in using their @lehigh.edu email, and Google OAuth will automatically assign a user based on predefined roles at registration.

Receipt Page:
This page generates a list of transactions made and totals it

Student Page: This page has various buttons and tools needed to initiate a transaction. It has the sole ability to show the current balance and display a dynamic QR code to the vendor. Upon scanning, it will prompt for confirmation and complete a transaction.

## Vendor
A vendor consists of any Lehigh Approved merchant that sells goods to Lehigh Students. These vendors are intended to be those who sell goods through GoldPlus. Upon login, Vendors will be able to instantly perform transactions by inputting an amount and scanning a Spender's QR Code. 

### How to use

1. Upon login, type your price total into Enter Amount:
2. Click Scan QR Code
3. A QR code should appear with a border to scan the QR code
4. With the Spender’s QR code ready from their HawKoin app, scan their QR code and confirm transaction.

### Screens

Login Page: This is universal for all users. One will sign in using their @lehigh.edu email, and Google OAuth will automatically assign a user based on predefined roles at registration.

Receipt Page:
This page generates a list of transactions made and totals it.

Vendor Page:
A Multifaceted page that allows for the amount of the purchase to be inputted and the Camera to be called for scanning. After inputting amount and calling the camera, the Vendor can scan the QR code and instantly complete the transaction after confirmation by the Spender.

## Admin
Although still in very early stage development, Admins are those within Lehigh that will be able to perform anaylitics on the various transactions completed through the HawKoin App. As of now, these vendors may be able to see limited information about all the transactions performed over time.  


### How to use
### Screens
The admin portal should display data for each transaction that occurs throughout the application. This should constantly refresh and monitor any changes to the blockcahin.

# Testing
We are currnetly using Jasmine's Unit Testing suite in order to ensure that HawKoin persists through changes, version updates, and refactoring. 
## Test purposes
### Spender
It is crucial that the student is able to perform transactions and that his financial status remains correct. Some of the tests we plan to implement

1. Showing that displays are correct
2. Negative balance transactions 
3. Integrity of account balances
4. Navigation to different screens/states are correct
5. Dynamic QR Code properly displays and is scannable
6. Balance properly displays


### Vendor
As the Vendor is another important user of HawKoin, it needs to also maintain integrity throughout changes, version updates, and refactoring. We plan to implement: 

1. Showing displays are correct
2. Negative balance transactions
3. Navigation to different screens/states are correct
4. QR Code correctly Scans for given user
5. Vendor's inputted balance is reflected to Spender


### Receipt
After a Spender requests using his QR code and the vendor scans, there should be proper confirmation by the Spender for the transaciton. This is crucial for the security of a Spender's account balance. We plan to implement:

1. QR Code being scanned engages confirmation
2. Timeout occurs 
3. Proper displays upon confirmation

### Admin
An Admin needs to properly account for transacitons that occur for log purposes. We plan to implement

1. Transaction is displayed
2. Transaction's display refreshes and accounts for incoming transactions

## How to run Tests

# Authors
Year 1: Matt Addessi, Tim LaRowe, and Aaron Rotem
Year 2: Dominic Rubino, Nicholas Stefanidis, and Trent Sawicki
# Acknowledgements
A big thank you  to Sharon Kalafut, Jeff Anthony, and Hank Korth. Your guidance, support, and technical expertise has been crucial to the outcome and delivery of this project. HawKoin would not be where it is at without you guys.