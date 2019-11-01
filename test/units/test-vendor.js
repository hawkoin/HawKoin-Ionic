const {describe, it} = require('mocha')
const {expect} = require('chai')
//const student = require('../../src/pages/vendor.ts')

describe('vendor', function () {

  it('should construct a vendor correctly', function ()  {
    //if this needs many tests it should probably be wrapped in a constructor describe
  })
  describe('DisplayState', function () {
    it('should have default NavController', function () {

    })
    it('Should display vendor content correctly', function () {

    })
  })

  describe('Scan', function () {
    it('Scanner should appear after pressing button', function () {
      
    })
      it('should scan a barcode', function () {
        //no idea how to test barcodeScanner.scan()
      })
      it('should split up barcode data properly', function () {

      })
      it('should construct a correct payload', function () {

      })
  })
  describe('Transaction', function () {
    it('should reject an amount = 0', function () {

    })
    it('should reject an amount < 0', function () {

    })
    it('should reject a flawed transaction', function () {

    })
})
  describe('Confirmation', function () {
    it('Properly terminates after time has passed', function () {

    })
 
    it('Displays success after user accepts', function () {

    })
    it('Displays failure after user declines', function () {

    })
  })

  describe('refresh function', function () {
    it('should clear amount, checkbox, and checkmark', function () {

    })
  })

//const student = require('../../src/pages/student.ts')


})