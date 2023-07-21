interface IOrganizationCreateDTO {
  name: string,
  status: number
}

interface IOrganizationDTO {
  id: number,
  name: string,
  status: number
}

export { IOrganizationDTO, IOrganizationCreateDTO };
