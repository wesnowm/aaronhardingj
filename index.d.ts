import * as Cookies from 'cookies'
import type Firebase from 'firebase'
import type FirebaseAdmin from 'firebase-admin'
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import type { ComponentType } from 'react'
import type { ParsedUrlQuery } from 'querystring'

export enum AuthAction {
  RENDER = 'render',
  SHOW_LOADER = 'showLoader',
  RETURN_NULL = 'returnNull',
  REDIRECT_TO_LOGIN = 'redirectToLogin',
  REDIRECT_TO_APP = 'redirectToApp',
}

export interface AuthUser {
  id: string | null
  email: string | null
  emailVerified: boolean
  phoneNumber: string | null
  displayName: string | null
  photoURL: string | null
  claims: Record<string, string | boolean>
  getIdToken: () => Promise<string | null>
  clientInitialized: boolean
  firebaseUser: Firebase.User | null
  signOut: () => Promise<void>
}

export type SSRPropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = GetServerSidePropsContext<Q> & { AuthUser: AuthUser }

export type SSRPropGetter<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = (context: SSRPropsContext<Q>) => Promise<GetServerSidePropsResult<P>>

interface AuthUserContext extends AuthUser {
  serialize: (opts?: { includeToken?: boolean }) => string
}

type URLResolveFunction = (obj: {
  ctx: GetServerSidePropsContext<ParsedUrlQuery>
  AuthUser: AuthUser
}) => string

type PageURL = string | URLResolveFunction

interface InitConfig {
  authPageURL?: PageURL
  appPageURL?: PageURL
  loginAPIEndpoint?: string
  logoutAPIEndpoint?: string
  tokenChangedHandler?: (user: AuthUser) => void
  firebaseAdminInitConfig?: {
    credential: {
      projectId: string
      clientEmail: string
      privateKey: string
    }
    databaseURL: string
  }
  firebaseAuthEmulatorHost?: string
  firebaseClientInitConfig: {
    apiKey: string
    projectId?: string
    appId?: string
    // "PROJECT_ID.firebaseapp.com"
    authDomain?: string
    // "https://PROJECT_ID.firebaseio.com"
    databaseURL?: string
    // "PROJECT_ID.appspot.com"
    storageBucket?: string
    // "SENDER_ID"
    messagingSenderId?: string
    // "G-MEASUREMENT_ID"
    measurementId?: string
  }
  cookies: Cookies.Option &
    Cookies.SetOption & {
      name: string
    }
}

export const init: (config: InitConfig) => void

export const getFirebaseAdmin: () => FirebaseAdmin

/**
 * Get the Firebase Client API. Use this when developing on the Client (Browser).
 * Before usage ensure that each of the Firebase Modules required are imported into
 * the project (See https://firebase.google.com/docs/web/setup#available-libraries); for example add:
 *
 * @example
 * ```
 * // Add the Firebase products that you want to use (note that this module imports `firebase/auth` already.
 * import "firebase/firestore";
 * import "firebase/functions";
 * import "firebase/messaging";
 * import "firebase/analytics";
 * import "firebase/storage";
 * import "firebase/database";
 * ```
 *
 */
export const getFirebaseClient: () => Firebase.App

export const setAuthCookies: (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<{
  idToken: string
  refreshToken: string
  AuthUser: AuthUser
}>

export const unsetAuthCookies: (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>

export const useAuthUser: () => AuthUserContext

export const verifyIdToken: (token: string) => Promise<AuthUser>

export const withAuthUser: <P = unknown>(options?: {
  whenAuthed?: AuthAction.RENDER | AuthAction.REDIRECT_TO_APP
  whenUnauthedBeforeInit?:
    | AuthAction.RENDER
    | AuthAction.REDIRECT_TO_LOGIN
    | AuthAction.SHOW_LOADER
    | AuthAction.RETURN_NULL
  whenUnauthedAfterInit?: AuthAction.RENDER | AuthAction.REDIRECT_TO_LOGIN
  appPageURL?: PageURL
  authPageURL?: PageURL
  LoaderComponent?: ComponentType | null
}) => (component: ComponentType<P>) => ComponentType<P>

export const withAuthUserTokenSSR: (options?: {
  whenAuthed?: AuthAction.RENDER | AuthAction.REDIRECT_TO_APP
  whenUnauthed?: AuthAction.RENDER | AuthAction.REDIRECT_TO_LOGIN
  appPageURL?: PageURL
  authPageURL?: PageURL
}) => (propGetter?: SSRPropGetter) => ReturnType<SSRPropGetter>

export const withAuthUserSSR: (options?: {
  whenAuthed?: AuthAction.RENDER | AuthAction.REDIRECT_TO_APP
  whenUnauthed?: AuthAction.RENDER | AuthAction.REDIRECT_TO_LOGIN
  appPageURL?: PageURL
  authPageURL?: PageURL
}) => (propGetter?: SSRPropGetter) => ReturnType<SSRPropGetter>
