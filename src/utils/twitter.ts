export function getTwitterProfileImage(twitterUrl: string): string {
  // Extract username from Twitter URL
  const username = twitterUrl.split('/').pop() || ''
  
  // Return the default avatar if no username
  if (!username) {
    return '/team/default-avatar.png'
  }

  // Return the Twitter profile image URL
  return `https://unavatar.io/twitter/${username}`
}
