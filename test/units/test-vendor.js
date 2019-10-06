const {describe, it} = require('mocha')
const {expect} = require('chai')
<<<<<<< HEAD
//const student = require('../../src/pages/vendor.ts')

describe('vendor', function () {

  it('should construct a vendor correctly', () => {
    //if this needs many tests it should probably be wrapped in a constructor describe
  })

  describe('scan function', function () {
      it('should reject an amount = 0', function () {

      })
      it('should reject an amount < 0', function () {

      })
      it('should scan a barcode', function () {
        //no idea how to test barcodeScanner.scan()
      })
      it('should split up barcode data properly', function () {

      })
      it('should construct a correct payload', function () {

      })
      it('should post a transaction', function () {

      })
      it('should reject a flawed transaction', function () {

      })
  })

  describe('refresh function', function () {
    it('should clear amount, checkbox, and checkmark', function () {

    })
  })

=======
//const student = require('../../src/pages/student.ts')

describe('vendor', function () {

  describe('constructor', function () {
      it('Sample description', function () {

      })
  })
/**
  it('should show initial display correctly', () => {
    //expect(calculator.initialState.display).to.equal('0')
  })
  it('should replace 0 in initialState', () => {
    //expect(stream('4').display).to.equal('4')
  }) */
>>>>>>> 6dce7b5a1d494f92ddd6534073320da9081d6643
})