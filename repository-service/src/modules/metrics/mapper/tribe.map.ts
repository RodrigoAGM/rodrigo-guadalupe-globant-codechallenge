import { IRepositoryMetricDTO, IRepositoryMetricsDTO } from '../dtos/metrics.dto';
import { repositoryStateToNaturalLanguage } from '../../../utils/repository.state.parser';
import { PopulatedTribeWithMetrics } from '../../tribe/model/tribe.model';

function mapMetricByTribeToRepositoryMetricsDto(
  tribe: PopulatedTribeWithMetrics
): IRepositoryMetricsDTO {
  const data: IRepositoryMetricDTO[] = [];

  tribe.repositories.forEach((repository) => {
    if (!repository.metric) return;

    data.push({
      id: repository.id,
      name: repository.name.trim(),
      tribe: tribe.name.trim(),
      organization: tribe.organization.name.trim(),
      coverage: `${Number(repository.metric.coverage) * 100}%`,
      codeSmells: repository.metric.codeSmells,
      bugs: repository.metric.bugs,
      vulnerabilities: repository.metric.vulnerabilities,
      hotspots: repository.metric.hotspot,
      verificationState: '',
      state: repositoryStateToNaturalLanguage(repository.state),
    });
  });

  return { repositories: data };
}

export { mapMetricByTribeToRepositoryMetricsDto };
