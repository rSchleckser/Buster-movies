$('.ui.form')
.form({
  fields: {
    email: {
      identifier: 'email',
      rules: [{
        type: 'email',
        prompt: 'Please enter a valid e-mail'
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