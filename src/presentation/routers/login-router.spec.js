class LoginRouter {
  route(httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) {
      return {
        statusCode: 400,
      };
    }
  }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    /* sut = system under test.
    Nomenclatura que refere-se a um sistema que está sendo testado para operação correta. */
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });

  test('Should return 400 if no password is provided', () => {
    /* sut = system under test.
    Nomenclatura que refere-se a um sistema que está sendo testado para operação correta. */
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: 'any@email.com',
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});
