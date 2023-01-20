import type { ActionArgs, LinksFunction } from '@remix-run/node';
import { Link, useSearchParams, useActionData } from '@remix-run/react';
import stylesUrl from '~/styles/login.css';
import { badRequest } from '~/utils/request.server';

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
export const action = async ({request} : ActionArgs) =>{
  const form = await request.formData()
  const username = form.get("username")
  const password = form.get("password")
  const loginType = form.get("loginType") || "/motinotes"
  if (
    typeof loginType !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
}}


export default function login() {
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
                defaultChecked
              />{' '}
              Login
            </label>
            <label>
              <input type="radio" name="loginType" value="register" /> Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input type="text" id="username-input" name="username" />
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input id="password-input" name="password" type="password" />
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
