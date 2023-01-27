import { prisma } from '@prisma/client';
import type { ActionArgs, LinksFunction } from '@remix-run/node';
import { Link, useSearchParams, useActionData } from '@remix-run/react';
import stylesUrl from '~/styles/login.css';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/request.server';
import { createUserSession, login as authLogin } from '~/utils/session.server';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesUrl },
];

function validateUserName(username: string) {
  if (typeof username !== 'string' || username.length < 3) {
    return 'Username must be at least 3 characters long!';
  }
}

function validatePassword(password: string) {
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be minimum of 6 characters!';
  }
}

function validateUrl(url: string) {
  let urls = ['/motinotes', '/', 'https://remix.run'];
  if (urls.includes(url)) {
    return url;
  }
  return '/motinotes';
}
export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const loginType = form.get('loginType');
  const username = form.get('username');
  const password = form.get('password');
  const redirectTo = validateUrl(form.get('redirectTo') || '/motinotes');
  if (
    typeof loginType !== 'string' ||
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { loginType, username, password };
  const fieldErrors = {
    username: validateUserName(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields, formError: null });
  }

  switch (loginType) {
    case 'login':
      const user = await authLogin({ username, password });
      // server side code so console log runs on server not client
      console.log(user);
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: 'Username or Password is incorrect!',
        });
      }
      return createUserSession(user.id, redirectTo);

    case 'register':
      const userExists = await db.user.findFirst({ where: { username } });
      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `User ${username} already exists`,
        });
      }
      // create the user
      // create their session and redirect to /jokes
      return badRequest({
        fieldErrors: null,
        fields,
        formError: 'we can do that yet! hold on soon  ',
      });

    default:
      return badRequest({
        fieldErrors: null,
        fields,
        formError: 'Login type not good',
      });
  }
};

export default function login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === 'login'
                }
              />{' '}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields?.loginType === 'register'}
              />{' '}
              Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input
              type="text"
              defaultValue={actionData?.fields?.username}
              id="username-input"
              name="username"
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? 'username-error' : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              type="password"
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-errormessage={
                actionData?.fieldErrors?.password ? 'password-error' : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/motinotes">motiNotes</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
