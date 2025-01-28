export interface CreateFunctionDto {
  /** Function name is unique in the application */
  name: string
  description?: string
  methods: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD')[]
  /** The source code of the function */
  code: string
  tags?: string[]
}