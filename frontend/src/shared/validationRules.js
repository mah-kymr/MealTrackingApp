export const validationRules = {
  username: {
    regex: /^[A-Za-z0-9@$!%*#?&]+$/,
    minLength: 3,
    maxLength: 30,
    errorMessage: "ユーザー名は英数字と一部の特殊文字のみ使用できます",
  },
  password: {
    regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    minLength: 8,
    errorMessage:
      "パスワードは8文字以上で、大文字、小文字、数字、特殊文字を含める必要があります",
  },
};
