import validate from 'validate.js'

export default function createModelValidator(constraints) {
  return {
    validator: () => {
      const validations = validate(this, constraints, {
        format: `flat`,
      })

      if (validations) {
        throw new Error(validations.join(`, `))
      }
    },
  }
}
