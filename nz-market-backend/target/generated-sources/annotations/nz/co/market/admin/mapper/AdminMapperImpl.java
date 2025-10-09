package nz.co.market.admin.mapper;

import javax.annotation.processing.Generated;
import nz.co.market.admin.dto.ReportResponse;
import nz.co.market.admin.entity.Report;
import nz.co.market.auth.entity.User;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-09T21:28:43+1300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
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
        reportResponse.id( report.getId() );
        reportResponse.targetType( report.getTargetType() );
        reportResponse.targetId( report.getTargetId() );
        reportResponse.reason( report.getReason() );
        reportResponse.status( report.getStatus() );
        reportResponse.createdAt( report.getCreatedAt() );
        reportResponse.resolvedAt( report.getResolvedAt() );
        reportResponse.resolutionNotes( report.getResolutionNotes() );

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
