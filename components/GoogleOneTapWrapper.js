'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleOneTap from './GoogleOneTap';

export default function GoogleOneTapWrapper(props) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <GoogleOneTap {...props} />
    </GoogleOAuthProvider>
  );
}
