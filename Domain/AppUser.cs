using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        //propteries we need along with identity user
        public  string DisplayName  { get; set; }
        public  string Bio { get; set; }
    }
}