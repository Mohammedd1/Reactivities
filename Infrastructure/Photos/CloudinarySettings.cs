using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Photos
{
    /*We created this class to strongly type our configuration*/
    public class CloudinarySettings
    {
        public string CloudName { get; set; }
        public string ApiKey { get; set; }

        public string ApiSecret { get; set; }


    }
}