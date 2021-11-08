using System.Collections.Generic;
using Domain;

namespace Application.Profiles
{
    public class Profile
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        public bool Following { get; set; }//225
        public int FollowersCount { get; set; }//225
        public int FollowingCount { get; set; }//225
        public ICollection<Photo> Photos { get; set; }
    }
}