using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        //Regular expression for complex password
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Password must be complex")]
        /*
        -(?=.*\\d) : and will say ? equals then period and an asterisks, 
        which represents any character in apassword.
        And we want to specify that one of them needs to be a number.
        -(?=.*[a-z]):at least one lowercase character
        -(?=.*[A-Z]):at least one uppercase character
        -{4,8}:password long hsould be between 4 to 8 characters
        */
        public string Password { get; set; }
        [Required]
        public string Username { get; set; }
    }
}