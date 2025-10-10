package nz.co.market.admin.mapper;

import javax.annotation.processing.Generated;
import nz.co.market.admin.dto.ReportResponse;
import nz.co.market.admin.entity.Report;
import nz.co.market.auth.entity.User;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-10T14:30:10+1300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class AdminMapperImpl implements AdminMapper {

    @Override
    public ReportResponse toReportResponse(Report report) {
        if ( report == null ) {
            return null;
        }

        ReportResponse.ReportResponseBuilder reportResponse = ReportResponse.builder();

        reportResponse.reporter( userToReporterDto( report.getReporter() ) );
        reportResponse.resolvedBy( userToUserDto( report.getResolvedBy() ) );
        reportResponse.createdAt( report.getCreatedAt() );
        reportResponse.id( report.getId() );
        reportResponse.reason( report.getReason() );
        reportResponse.resolutionNotes( report.getResolutionNotes() );
        reportResponse.resolvedAt( report.getResolvedAt() );
        reportResponse.status( report.getStatus() );
        reportResponse.targetId( report.getTargetId() );
        reportResponse.targetType( report.getTargetType() );

        return reportResponse.build();
    }

    protected ReportResponse.ReporterDto userToReporterDto(User user) {
        if ( user == null ) {
            return null;
        }

        ReportResponse.ReporterDto.ReporterDtoBuilder reporterDto = ReportResponse.ReporterDto.builder();

        reporterDto.id( user.getId() );
        reporterDto.displayName( user.getDisplayName() );
        reporterDto.email( user.getEmail() );

        return reporterDto.build();
    }

    protected ReportResponse.UserDto userToUserDto(User user) {
        if ( user == null ) {
            return null;
        }

        ReportResponse.UserDto.UserDtoBuilder userDto = ReportResponse.UserDto.builder();

        userDto.id( user.getId() );
        userDto.displayName( user.getDisplayName() );
        userDto.email( user.getEmail() );

        return userDto.build();
    }
}
