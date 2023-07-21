interface IVerifiedRepoDTO {
  id: number,
  state: number
 }

interface IVerifiedReposDTO {
 repositories: IVerifiedRepoDTO[]
}

export { IVerifiedReposDTO, IVerifiedRepoDTO };
