using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        //propteries we need along with identity user
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<ActivityAttendee> Activities { get; set; }
        public ICollection<Photo> Photos { get; set; }//182

        public ICollection<UserFollowing> Followings { get; set; }//222
        public ICollection<UserFollowing> Followers { get; set; }//222


    }
}