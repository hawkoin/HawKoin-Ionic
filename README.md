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

# Testing

## Test purposes

## How to run Tests

# Authors

# Acknowledgements