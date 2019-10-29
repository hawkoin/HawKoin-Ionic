const {describe, it} = require('mocha')
const {expect} = require('chai')
//const student = require('../../src/pages/student.ts')

describe('student', function () {

  describe('constructor', function () {
      it('should have default NavController', function () {

      })
  })

  describe('httpRequest', function () {

  })

  describe('toggleBalance', function () {
    it('balance should display correctly', function () {

    })
    it('balance displayed should change after non-zero transaction', function () {

    })
  })
  describe('Transactions', function () {
    it('negative balance transactions are not allowed',function () {

    })
    it('balance is actually changed after transaction occurs', function () {

    })
  })
  describe('Confirmation', function () {
    it('confirmation is displayed to Spender',function () {

    })
    it('Confirm reflects a change to non-zero balance', function () {

    })
    it('Cancel reflects no change to balance', function() {

    })
  })

  it('should show initial display correctly', () => {
    //expect(calculator.initialState.display).to.equal('0')
  })
  it('should replace 0 in initialState', () => {
    //expect(stream('4').display).to.equal('4')
  })
})