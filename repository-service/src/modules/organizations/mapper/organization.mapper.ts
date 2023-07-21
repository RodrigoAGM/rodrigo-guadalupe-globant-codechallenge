import { Organization } from '@prisma/client';
import { IOrganizationDTO } from '../dtos/organization.dto';

function mapOrganizationToOrganizationDto(organization: Organization): IOrganizationDTO {
  return {
    id: organization.id,
    name: organization.name.trim(),
    status: organization.status,
  };
}

function mapOrganizationsToOrganizationDtoList(
  organizations: Organization[]
): IOrganizationDTO[] {
  const dtos = organizations.map((value) => (mapOrganizationToOrganizationDto(value)));
  return dtos;
}

export { mapOrganizationToOrganizationDto, mapOrganizationsToOrganizationDtoList };
