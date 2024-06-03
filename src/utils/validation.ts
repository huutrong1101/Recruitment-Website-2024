export const validateGPA = (_: any, value: any) => {
  if (value < 0 || value > 4) {
    return Promise.reject(new Error('GPA phải nằm trong khoảng từ 0.0 đến 4.0'))
  }
  return Promise.resolve()
}

export const validatePhone = (_: any, value: any) => {
  if (!value) {
    return Promise.reject(new Error('Vui lòng nhập số điện thoại'))
  }
  const phoneRegex = /^[0-9]{10}$/
  if (!phoneRegex.test(value)) {
    return Promise.reject(new Error('Số điện thoại không hợp lệ'))
  }
  return Promise.resolve()
}

export const validateEmail = (_: any, value: any) => {
  if (!value) {
    return Promise.reject(new Error('Vui lòng nhập email'))
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return Promise.reject(new Error('Email không hợp lệ'))
  }
  return Promise.resolve()
}
