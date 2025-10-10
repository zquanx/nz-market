package nz.co.market.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    
    @NotBlank(message = "{validation.email.required}")
    @Email(message = "{validation.email.invalid}")
    private String email;
    
    @NotBlank(message = "{validation.password.required}")
    @Size(min = 6, message = "{validation.password.size}")
    private String password;
    
    @NotBlank(message = "{validation.displayName.required}")
    @Size(min = 2, max = 100, message = "{validation.displayName.size}")
    private String displayName;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "{validation.phone.invalid}")
    private String phone;
}
