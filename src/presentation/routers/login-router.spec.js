const LoginRouter = require('./login-router');
const MissingParamError = require('../helpers/missing-param-error');

// Design Pattern Factory.
const makeSut = () => {
  // Mock para capturar valor para comparar.
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
    }
  }

  // Dependency Injector
  const authUseCaseSpy = new AuthUseCaseSpy();
  const sut = new LoginRouter(authUseCaseSpy);

  return {
    sut, authUseCaseSpy,
  };
};

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    /* sut = system under test.
    Nomenclatura que refere-se a um sistema que está sendo testado para operação correta. */
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    /* sut = system under test.
    Nomenclatura que refere-se a um sistema que está sendo testado para operação correta. */
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any@email.com',
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 500 if no httpRequest is provided', () => {
    const { sut } = makeSut();

    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  test('Should return 500 if no httpRequest has no body', () => {
    const { sut } = makeSut();

    const httpResponse = sut.route({});
    expect(httpResponse.statusCode).toBe(500);
  });

  test('Should call AuthUseCase with corret params', () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password',
      },
    };

    sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test('Should return 401 when invalid credentials are provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password',
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
  });
});
