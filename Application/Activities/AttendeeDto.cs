using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Activities
{
    //189
    public class AttendeeDto
    {
         public string Username { get; set; }     
        public string DisplayName { get; set; }     
        public string Bio { get; set; }     
        public string Image { get; set; }  
        public bool Following { get; set; }//228
        public int FollowersCount { get; set; }//228
        public int FollowingCount { get; set; }//228
        
    }
}