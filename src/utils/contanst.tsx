export enum STATUS {
  IDLE = 'idle',
  ERROR = 'error',
  LOADING = 'loading',
  ERROR500 = '500',
  ERROR404 = '404'
}

export const typeSearchAdmin = [
  {
    typeID: 1,
    type: 'Name'
  },
  {
    typeID: 2,
    type: 'Email'
  },
  {
    typeID: 3,
    type: 'Phone'
  }
]
