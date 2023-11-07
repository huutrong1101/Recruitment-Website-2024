export interface QuestionListConfig {
  page?: number | string
  size?: number | string
  skill?: string
  type?: string
  note?: number | string
  content?: string
}

export interface QuestionListInterface {
  skill: string
  type: string
  questionId?: number | string
  note: number | string
  content: string
}
