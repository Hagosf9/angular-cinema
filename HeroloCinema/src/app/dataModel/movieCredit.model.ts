export interface MovieCreditModel {
  id: string,
  cast: [
    {
      cast_id: string,
      character: string,
      credit_id: string,
      gender: string,
      id: string,
      name: string,
      order: string,
      profile_path: string,
    }
  ],
  crew: [
    {
      credit_id: string,
      department: string,
      gender: string,
      id: string,
      job: string,
      name: string,
      order: string,
      profile_path: string,
    }
  ]
}
