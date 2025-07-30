import { Redirect } from 'expo-router';

export default function IndexScreen() {
  console.log('IndexScreen rendering - redirecting to debug');
  return <Redirect href="/debug" />;
}