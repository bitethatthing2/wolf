import 'dotenv/config';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!url) {
  console.error('Supabase URL not set in environment variables.');
  process.exit(1);
}

console.log('Testing fetch to:', url);

fetch(url)
  .then(async (res) => {
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response body:', text.substring(0, 200)); // Print first 200 chars
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fetch failed:', err);
    process.exit(2);
  });
