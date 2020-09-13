// eslint-disable-next-line max-classes-per-file
const LoginRouter = require('./login-router');
const MissingParamError = require('../helpers/missing-param-error');
const UnauthorizedError = require('../helpers/unauthorized-error');

// Design Pattern Factory.
const makeSut = () => {
  // Mock para capturar valor para comparar.
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;

      return this.accessToken;
    }
  }

  // Dependency Injector
  const authUseCaseSpy = new AuthUseCaseSpy();
  authUseCaseSpy.accesToken = 'valid_token';

  // Set default token case route not set acess token.
  // authUseCaseSpy.accessToken = 'valid_token';

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

  // 401 quando o sistema não identifica o usuário.
  // 403 quando o sistema identifica o usuário, mas ele não ter permissão para executar a ação.
  test('Should return 401 when invalid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut();

    authUseCaseSpy.accesToken = null;

    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password',
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test('Should return 200 when valid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut();

    authUseCaseSpy.accessToken = 'valid_token';

    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_password',
      },
    };

    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(200);

    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test('Should return 500 if no AuthUseCase is provided', () => {
    const sut = new LoginRouter();

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test('Should return 500 if no AuthUseCase has no auth method', () => {
    const sut = new LoginRouter({});

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });
});
