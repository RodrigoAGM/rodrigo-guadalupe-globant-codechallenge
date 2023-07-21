interface IRepositoryMetricDTO {
  id: number,
  name: string,
  tribe: string,
  organization: string,
  coverage: string,
  codeSmells: number,
  bugs: number,
  vulnerabilities: number,
  hotspots: number,
  verificationState: string,
  state: string,
}

interface IRepositoryMetricsDTO {
  repositories: IRepositoryMetricDTO[]
}

export { IRepositoryMetricDTO, IRepositoryMetricsDTO };
