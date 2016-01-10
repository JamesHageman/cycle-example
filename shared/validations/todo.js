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
