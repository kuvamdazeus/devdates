export interface GithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: false;
  name: string;
  company: null;
  blog: string;
  location: null;
  email: string;
  hireable: true;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: false;
  plan: {
    name: string;
    space: number;
    collaborators: number;
    private_repos: number;
  };
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  profile_url: string;
  website: string;
  bio: string;
  images: string[];
  metadata: GithubUser;
}
