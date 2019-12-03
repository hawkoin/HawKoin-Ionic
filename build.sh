#!/bin/bash

#build ionic proect for android, ios, and web

echo "Building project"
echo

ionic build

echo 
echo "Building ios project"
echo 

ionic cordova build ios

echo
echo "Building android project"
echo 

ionic cordova build android

echo 
echo "***DONE***"
