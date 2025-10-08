package nz.co.market.admin.mapper;

import nz.co.market.admin.dto.ReportResponse;
import nz.co.market.admin.entity.Report;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    
    AdminMapper INSTANCE = Mappers.getMapper(AdminMapper.class);
    
    @Mapping(target = "reporter.id", source = "reporter.id")
    @Mapping(target = "reporter.displayName", source = "reporter.displayName")
    @Mapping(target = "reporter.email", source = "reporter.email")
    @Mapping(target = "resolvedBy.id", source = "resolvedBy.id")
    @Mapping(target = "resolvedBy.displayName", source = "resolvedBy.displayName")
    @Mapping(target = "resolvedBy.email", source = "resolvedBy.email")
    ReportResponse toReportResponse(Report report);
}
