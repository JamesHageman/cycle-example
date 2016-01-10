import validate from 'validate.js'

export default function createModelValidator(constraints) {
  return {
    validator: function modelValidator() {
      console.log(this.text, this.completed)
      const validations = validate(this, constraints, {
        format: `flat`,
      })

      if (validations) {
        throw new Error(validations.join(`, `))
      }
    },
  }
}
