export enum ERROR_MESSAGES {
  PASSWORD_NOT_STRONG = 'Your password is not string enough. Please try again',
  DUPLICATE_USERNAME = 'Username already exists, please try a different username.',
  LOGIN_FAILED = 'Username or Password was not correct. Please check your login credentials.',
  SLUG_MESSAGE = 'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  UNABLE_TO_PROCESS = 'Unable to process your request at this time. Please try again later',
  TAGS_NOT_CORRECT = 'Please check your Tag Ids and ensure they are correct',
  POST_NOT_FOUND = 'The Post Id does not exist',
}

export enum ERROR_CODES {
  DUPLICATE_USERNAME = '23505',
}
