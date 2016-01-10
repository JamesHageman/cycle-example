// validate.js spec used by both the Todo model in Node and the TodoForm in the
// Browser

const todoValidations = {
  text: {
    presence: true,
    length: {
      minimum: 3,
      maximum: 150,
    },
  },
  completed: { presence: true },
}

export default todoValidations
