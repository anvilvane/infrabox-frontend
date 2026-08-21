'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleOneTap from './GoogleOneTap';

export default function GoogleOneTapWrapper(props) {
  // Without a real client ID, GoogleOAuthProvider still loads Google's GSI
  // script and initializes One Tap with client_id: undefined — Google logs
  // "Missing required parameter: client_id" and the prompt never appears, on
  // every single page load. Skip mounting the whole thing until this
  // deployment actually has NEXT_PUBLIC_GOOGLE_CLIENT_ID set.
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <GoogleOneTap {...props} />
    </GoogleOAuthProvider>
  );
}
