export class LoginResponseUserDto {
  email: string;
  username: string;
  token: string;

  constructor(email: string, username: string, token: string) {
    this.email = email;
    this.username = username;
    this.token = token;
  }
}
