const required = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `\n❌ Missing required Firebase environment variables:\n${missing
      .map((k) => ` - ${k}`)
      .join('\n')}\n\nSet these in your Netlify dashboard (Site settings → Build & deploy → Environment).\n`
  );
  process.exit(1);
} else {
  console.log('✅ All required Firebase environment variables are present.');
}
