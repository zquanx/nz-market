// Error message mappings for different languages
export const errorMessages = {
  en: {
    // Validation errors
    'validation.email.required': 'Email is required',
    'validation.email.invalid': 'Invalid email format',
    'validation.password.required': 'Password is required',
    'validation.password.size': 'Password must be at least 6 characters',
    'validation.displayName.required': 'Display name is required',
    'validation.displayName.size': 'Display name must be between 2 and 100 characters',
    'validation.phone.invalid': 'Invalid phone number format',
    
    // Authentication errors
    'auth.email.exists': 'Email already exists',
    'auth.invalid.credentials': 'Invalid email or password',
    'auth.user.not.found': 'User not found',
    'auth.user.not.found.with.email': 'User not found with email: {0}',
    'auth.token.invalid': 'Invalid token',
    'auth.token.expired': 'Token has expired',
    'auth.email.not.verified': 'Email not verified',
    'auth.email.not.found': 'Email not found',
    'auth.password.reset.sent': 'Password reset email sent',
    'auth.password.reset.success': 'Password reset successful',
    'auth.password.reset.invalid': 'Invalid or expired reset token',
    'auth.registration.success': 'Registration successful',
    
    // General errors
    'error.network': 'Network error',
    'error.server': 'Internal server error',
    'error.validation': 'Validation failed',
    'error.unauthorized': 'Unauthorized access',
    'error.forbidden': 'Access forbidden',
    
    // Fallback messages
    'login.failed': 'Login failed',
    'registration.failed': 'Registration failed',
    'passwords.not.match': 'Passwords do not match',
  },
  zh: {
    // Validation errors
    'validation.email.required': '邮箱地址不能为空',
    'validation.email.invalid': '邮箱格式不正确',
    'validation.password.required': '密码不能为空',
    'validation.password.size': '密码至少需要6个字符',
    'validation.displayName.required': '显示名称不能为空',
    'validation.displayName.size': '显示名称必须在2-100个字符之间',
    'validation.phone.invalid': '手机号码格式不正确',
    
    // Authentication errors
    'auth.email.exists': '邮箱地址已存在',
    'auth.invalid.credentials': '邮箱或密码错误',
    'auth.user.not.found': '用户不存在',
    'auth.user.not.found.with.email': '未找到邮箱为 {0} 的用户',
    'auth.token.invalid': '无效的令牌',
    'auth.token.expired': '令牌已过期',
    'auth.email.not.verified': '邮箱未验证',
    'auth.email.not.found': '邮箱不存在',
    'auth.password.reset.sent': '密码重置邮件已发送',
    'auth.password.reset.success': '密码重置成功',
    'auth.password.reset.invalid': '无效或已过期的重置令牌',
    'auth.registration.success': '注册成功',
    
    // General errors
    'error.network': '网络错误',
    'error.server': '服务器内部错误',
    'error.validation': '验证失败',
    'error.unauthorized': '未授权访问',
    'error.forbidden': '访问被禁止',
    
    // Fallback messages
    'login.failed': '登录失败',
    'registration.failed': '注册失败',
    'passwords.not.match': '密码不匹配',
  }
};

export const getErrorMessage = (errorKey: string, language: 'en' | 'zh'): string => {
  const messages = errorMessages[language];
  return messages[errorKey] || errorKey;
};

export const parseApiError = (errorData: any, language: 'en' | 'zh'): string => {
  // Handle validation errors
  if (errorData && typeof errorData === 'object') {
    // Check if it's a validation error with field-specific messages
    const fieldErrors = Object.values(errorData);
    if (fieldErrors.length > 0) {
      const firstError = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors[0];
      if (typeof firstError === 'string') {
        return firstError;
      }
    }
    
    // Check for direct error message
    if (errorData.error) {
      // Handle both string errors and error objects
      if (typeof errorData.error === 'string') {
        return getErrorMessage(errorData.error, language);
      } else if (typeof errorData.error === 'object') {
        const errorValues = Object.values(errorData.error);
        if (errorValues.length > 0) {
          return errorValues[0] as string;
        }
      }
    }
    
    if (errorData.message) {
      return getErrorMessage(errorData.message, language);
    }
    
    // Check for specific field errors
    if (errorData.email) return errorData.email;
    if (errorData.password) return errorData.password;
    if (errorData.displayName) return errorData.displayName;
  }
  
  // Handle string errors
  if (typeof errorData === 'string') {
    return getErrorMessage(errorData, language);
  }
  
  // Fallback
  return language === 'en' ? 'An error occurred' : '发生错误';
};
