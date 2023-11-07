interface LocalizationDeclarationType {
  [index: string]: string
}

export const JOB_POSITION: LocalizationDeclarationType = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  CONTRACT: 'Contract',
  FREELANCE: 'Freelance',
  FTOWN1: 'F-Town 1',
  FTOWN2: 'F-Town 2',
  FTOWN3: 'F-Town 3',
  FRONTEND: 'Front-End',
  BACKEND: 'Back-End',
  REMOTE: 'Remote'
}

export const TYPE_alter: LocalizationDeclarationType = {
  TECHNICAL: 'Technical',
  SOFT_SKILL: 'Soft-skill'
}

export const TECHNICAL: LocalizationDeclarationType = {}

export const REC_INTERVIEW_STATUS: LocalizationDeclarationType = {
  NOT_RECEIVED: 'Not Received',
  RECEIVED: 'Received',
  PASSED: 'Pass',
  FAILED: 'Fail'
}
/**
 * @deprecated using Localization.APPLICANTS_STATUS instead
 */
export const APPLY_STATUS: LocalizationDeclarationType = {
  NOT_RECEIVED: 'Not Received',
  RECEIVED: 'Received',
  PASSED: 'Pass',
  FAILED: 'Fail'
}
export const REC_CANDIDATE_STATUS: LocalizationDeclarationType = {
  NOT_RECEIVED: 'Not Received',
  RECEIVED: 'Received',
  PASSED: 'Pass',
  FAILED: 'Received'
}
export const APPLICANTS_STATUS: LocalizationDeclarationType = {
  NOT_RECEIVED: 'Not Received',
  RECEIVED: 'Received',
  PASS: 'Passed',
  FAIL: 'Failed',
  PASSED: 'Passed',
  FAILED: 'Received',
  PENDING: 'Pending'
}

export const ADMIN_APPLICANTS_STATUS: LocalizationDeclarationType = {
  NOT_RECEIVED: 'Not Received',
  RECEIVED: 'Received',
  PASS: 'Passed',
  FAIL: 'Failed',
  PASSED: 'Passed',
  FAILED: 'Failed'
}
