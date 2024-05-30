$('.ui.form')
.form({
  fields: {
    phone: {
      identifier: 'phone',
      rules: [{
        type: 'minLength[10]',
        prompt: 'Please enter a phone number in correct format xxx-xxx-xxxx'
      }]
    },
    password: {
      identifier: 'password',
      rules: [{
        type: 'empty',
        prompt: 'Please enter a password'
      }, {
        type: 'minLength[6]',
        prompt: 'Your password must be at least 6 characters'
      }]
    }
  }
})